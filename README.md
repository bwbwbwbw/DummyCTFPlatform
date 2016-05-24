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

## Screenshots

### User

| ![](https://raw.githubusercontent.com/SummerWish/DummyCTFPlatform/master/screenshots/user_register.png) | ![](https://raw.githubusercontent.com/SummerWish/DummyCTFPlatform/master/screenshots/manage_users.png) |
| --- | --- |
| Contester: Register user |  Admin: Manage users in the dashboard |

### Announcement

| ![](https://raw.githubusercontent.com/SummerWish/DummyCTFPlatform/master/screenshots/announcements.png) | ![](https://raw.githubusercontent.com/SummerWish/DummyCTFPlatform/master/screenshots/manage_announcements_1.png) |
| --- | --- |
| Contester: Announcements |  Admin: Manage announcements |
| ![](https://raw.githubusercontent.com/SummerWish/DummyCTFPlatform/master/screenshots/manage_announcements_2.png) | |
| Admin: Publish announcement using WYSIWYG editor | |

### Challenge Pool

| ![](https://raw.githubusercontent.com/SummerWish/DummyCTFPlatform/master/screenshots/manage_challenge_pool_1.png) | ![](https://raw.githubusercontent.com/SummerWish/DummyCTFPlatform/master/screenshots/manage_challenge_pool_2.png) |
| --- | --- |
| Admin: Challenge pool |  Admin: Edit a challenge and its flag |

### Contest

| ![](https://raw.githubusercontent.com/SummerWish/DummyCTFPlatform/master/screenshots/contests.png) | ![](https://raw.githubusercontent.com/SummerWish/DummyCTFPlatform/master/screenshots/manage_contests_1.png) |
| --- | --- |
| Contester: Support multiple contests | Admin: Manage contests in dashboard |
| ![](https://raw.githubusercontent.com/SummerWish/DummyCTFPlatform/master/screenshots/manage_contests_2.png) | ![](https://raw.githubusercontent.com/SummerWish/DummyCTFPlatform/master/screenshots/manage_contest_3.png) |
| Admin: Create a contest | Admin: Add challenge (from challenge pool) to a contest or edit |
| ![](https://raw.githubusercontent.com/SummerWish/DummyCTFPlatform/master/screenshots/manage_contest_1.png) | ![](https://raw.githubusercontent.com/SummerWish/DummyCTFPlatform/master/screenshots/manage_contest_2.png) |
| Admin: Manage challenges of a contest | Admin: View challenge submissions |
| ![](https://raw.githubusercontent.com/SummerWish/DummyCTFPlatform/master/screenshots/contest_1.png) | ![](https://raw.githubusercontent.com/SummerWish/DummyCTFPlatform/master/screenshots/contest_2.png) |
| Contester: View contest challenges | Contester: View challenge content |
| ![](https://raw.githubusercontent.com/SummerWish/DummyCTFPlatform/master/screenshots/scoreboard.png) | |
| Contester: Trending and scoreboard |

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

## How to

### Switch to debug mode

The default mode is production mode. You can create a file named `.debug` to switch to debug mode (restart application is required).

### Customize configurations

`config.yaml` is the base config file from the project. It is not recommended to edit it. Instead, please create a file named `config.debug.yaml` or `config.production.yaml`.

You can write `base`, `debug`, `production` section in any of the three config files. In production environment, it will use `base`+`production`, and in debug environment, it will use `base`+`debug`. (`+` means deep-merge)

In other words:

- production mode loads `base` from `config.yaml` + `base` from `config.debug.yaml` + `base` from `config.production.yaml` + `production` from `config.yaml` + `production` from `config.debug.yaml` + `production` from `config.production.yaml`

- debug mode loads `base` from `config.yaml` + `base` from `config.debug.yaml` + `base` from `config.production.yaml` + `debug` from `config.yaml` + `debug` from `config.debug.yaml` + `debug` from `config.production.yaml`


## TODO

- [ ] Customize profile fields
- [ ] Remove challenge
- [ ] Remove contest
- [ ] Disable a user
- [ ] Allow customizing event content
- [ ] Refresh scoreboard when user modified its nickname
- [ ] Provide a link to export contesters

## License

MIT
