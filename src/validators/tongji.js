/*global DI */

import BaseValidator from './base';
import nodemailer from 'nodemailer';
import mg from 'nodemailer-mailgun-transport';
import querystring from 'querystring';
import crypto from 'crypto';
import RateLimiter from 'rolling-rate-limiter';
import i18n from 'i18n';
import promisify from 'promisify-node';

const defaultInfo = '该比赛仅面向同济大学在校学生，请填写您的学号，我们将发送验证邮件。<br>您也可以跳过验证继续参加这次比赛，但您将没有获奖资格。';

const defaultForm = [{
  key: 'cardid',
  type: 'input',
  templateOptions: {
    type: 'text',
    label: '学号',
    placeholder: '请输入您的同济大学学号',
  },
}];

export default class TongjiValidator extends BaseValidator {
  constructor() {
    super();
    this.config = DI.get('config');
    this.name = 'Tongji University Mail Validation';
    this.id = 'tongji';
    this.nodemailerMailgun = nodemailer.createTransport(mg({
      auth: {
        api_key: this.config.validators.tongji.mail.apiKey,
        domain: this.config.validators.tongji.mail.domain,
      },
    }));
    this.emailLimiter = promisify(RateLimiter({
      redis: DI.get('redis'),
      namespace: 'limiter-tongji-email',
      interval: 60 * 1000,
      maxInInterval: 1,
    }));
    this.ipLimiter = promisify(RateLimiter({
      redis: DI.get('redis'),
      namespace: 'limiter-tongji-ip',
      interval: 10 * 60 * 1000,
      maxInInterval: 30,
    }));
  }

  getHmac(payload) {
    return crypto
      .createHmac('sha256', this.config.validators.tongji.secret)
      .update(JSON.stringify(payload))
      .digest('hex');
  }

  registerController(router) {
    router.get('/tongji/verify', async (req, res) => {
      const payload = {
        crid: req.query.crid,
        cardid: req.query.cardid,
      };
      // check hmac
      const hmac = this.getHmac(payload);
      if (hmac !== req.query.mac) {
        throw new UserError('验证失败（参数校验失败）');
      }
      // check login state
      if (!req.session.user || !req.session.user._id) {
        throw new UserError('验证失败，请登录后再访问该地址完成验证');
      }
      // check reg object
      const contestService = DI.get('contestService');
      const cr = await contestService.getContestRegistrationObjectById(payload.crid);
      if (String(cr.user) !== String(req.session.user._id)) {
        throw new UserError('验证失败，您当前没有以对应用户登录，请登录正确的用户后再访问该地址完成验证');
      }
      if (!cr.meta || !cr.meta.tongji || cr.meta.tongji.isSkip) {
        throw new UserError('验证失败（服务器内部错误）');
      }
      if (cr.meta.validated) {
        throw new UserError('您已经验证过身份，不需要再次验证');
      }
      if (cr.meta.tongji.cardid !== payload.cardid) {
        throw new UserError('验证失败，您已经更换过学号，请重新验证');
      }
      await contestService.updateRegistrationMeta(payload.crid, {
        ...cr.meta,
        validated: true,
      });
      res.render('success', {
        title: '验证成功',
        description: '您已成功验证您的身份。',
      });
    });
  }

  sendVerification(contestRegistrationId, email, cardId) {
    const payload = {
      crid: contestRegistrationId,
      cardid: cardId,
    };
    const query = querystring.stringify({
      ...payload,
      mac: this.getHmac(payload),
    });
    const url = `${this.config.canonical}/validator/tongji/verify?${query}`;
    const njenv = DI.get('web.templateEngine');
    const data = {
      from: this.config.validators.tongji.mail.sender,
      to: email,
      subject: '完成 Tongji CTF 身份验证',
      html: njenv.render('mail/tongji.nunjucks', {
        siteTitle: this.config.title,
        verifyLink: url,
      }),
    };
    this.nodemailerMailgun.sendMail(data);
    DI.get('oplogger').info('validator.tongji.sendmail', { to: email });
  }

  async limitRate(req, email) {
    let timeLeft = 0;
    if (!timeLeft) {
      timeLeft = await this.emailLimiter(email);
    }
    if (!timeLeft) {
      timeLeft = await this.ipLimiter(req.connection.remoteAddress);
    }
    if (timeLeft) {
      throw new UserError(i18n.__('error.generic.limitExceeded', {
        minutes: (timeLeft / 1000 / 60).toFixed(1),
      }));
    }
  }

  async beforeRegister(req, prevReg) {
    if (req.body.fromForm !== 'true') {  // first time submit
      if (prevReg && prevReg.meta) {    // previously registered, re-validate
        if (prevReg.meta.validated) {   // break if already validated
          throw new Error('error.contest.registration.validated');
        }
        if (!prevReg.meta.tongji        // previously using other validate method
          || prevReg.meta.tongji.isSkip // previously skipped
          || !prevReg.meta.tongji.cardid) { // previously no cardid
          return {
            validateOnly: true,
            info: defaultInfo,
            form: defaultForm,
          };
        }
        return {
          validateOnly: true,
          info: '您当前身份未验证，将没有获奖资格。请点击验证邮件中的链接完成身份验证。<br>如果您希望更换学号或重新发送验证邮件，请递交下面的表单。',
          form: defaultForm,
          value: {
            cardid: prevReg.meta.tongji.cardid,
          },
        };
      } else {    // register first time
        return {
          info: defaultInfo,
          form: defaultForm,
        };
      }
    } else {
      // second time submit (user submits form)
      if (!req.body.isSkip) {
        if (!req.body.cardid || !req.body.cardid.match(/^\d+$/)) {
          throw new UserError('学号只允许输入纯数字');
        }
      }
    }
  }

  async afterRegister(req, contestRegistrationId, prevReg) {
    const prevMeta = (prevReg && prevReg.meta) ? prevReg.meta : {};
    const contestService = DI.get('contestService');
    await contestService.updateRegistrationMeta(contestRegistrationId, {
      ...prevMeta,
      tongji: {
        isSkip: req.body.isSkip,
        cardid: req.body.cardid,
      },
      validated: false,
    });
    if (!req.body.isSkip) {
      const email = `${req.body.cardid}@tongji.edu.cn`;
      await this.limitRate(req, email);
      this.sendVerification(contestRegistrationId, email, req.body.cardid);
      return `验证邮件已发送至 ${email}，请点击邮件中的链接完成身份验证。由于同济邮箱缺陷，您可能最长需要等待 10 分钟才能收到验证邮件。`;
    }
  }

}
