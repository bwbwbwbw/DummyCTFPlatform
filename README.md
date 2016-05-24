# DummyCTFPlatform

A (nearly) full-featured CTF platform with a easy-to-use management UI.

## Features

- I18N
  Currently we only have Chinese language, PRs are welcome! See [ui/locales/zh.json](https://github.com/SummerWish/DummyCTFPlatform/blob/master/ui/locales/zh.json).

- User register and login
  A user can take part in multiple CTF contests in the platform.

- Challenge repository
  You can store candidate challenges and only choose what you want to a CTF contest.

- Multiple CTF contests
  Needn't to clear database to start a new game. You can start multiple CTF contests.

- CTF contest registration validation
  You can request an email validation if a user want to take part in the CTF contest. You can also implement your own validation method.

- Trendings, Scoreboards
  A chart for displaying the trending and a table for displaying the scoreboard.

- Event timeline
  Let contesters know new challenges or announements.

- Management UI
  You can do everything in the Web UI! Add challenges, add contests, change flags, view users, reset user passwords, view submission historys, etc.

- Site Announcements
  Write anything you want with a WYSIWYG editor when user opens the website.

- Modern and fansy UI
  Built with cutting-edge front-end technologies.

- Export contesters

- Strong protected
  The platform itself is secure enough. We have rate limit mechanism for flag submissions and everything is carefully escaped and checked.

## TODO

- [ ] Remove challenge
- [ ] Remove contest
- [ ] Disable a user
- [ ] Allow customizing event content
- [ ] Refresh scoreboard when user modified its nickname
- [ ] Provide a link to export contesters

## Requirements

- Node.js >= 5: https://nodejs.org/en/download/package-manager/
- MongoDB: https://mirrors.tuna.tsinghua.edu.cn/help/mongodb/
- Redis

## Getting Started

```bash
git clone https://github.com/SummerWish/DummyCTFPlatform
cd DummyCTFPlatform
npm run build:production
npm start
```
