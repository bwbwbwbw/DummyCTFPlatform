import BaseValidator from './base';

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
  constructor(DI) {
    super(DI);
    this.name = 'Tongji University Mail Validation';
    this.id = 'tongji';
  }
  registerController(app) {
    app.post('/validator/tongji/verify', (req, res, body) => {
      res.send('verify!');
    });
  }
  doRegister(reqBody) {
    if (reqBody.fromForm !== 'true') {
      return {
        type: 'form',
        payload: {
          info: '该比赛仅面向同济大学在校学生，请填写您的学号，我们将发送验证邮件。<br>您也可以跳过验证继续参加这次比赛，但您将没有获奖资格。',
          form: defaultForm,
        },
      };
    }
    let extraInfoText;
    if (!reqBody.isSkip) {
      if (reqBody.cardid && reqBody.cardid.match(/^\d+$/)) {
        const email = `${reqBody.cardid}@tongji.edu.cn`;
        extraInfoText = `验证邮件已发送至 ${email}，请点击邮件中的链接完成身份验证。`;
        // TODO
      } else {
        throw new UserError('学号只允许输入纯数字');
      }
    }
    return {
      type: 'pass',
      payload: {
        cardid: reqBody.cardid,
        validated: false,
      },
      extraInfo: extraInfoText,
    };
  }
}
