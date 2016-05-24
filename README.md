# DummyCTFPlatform

A (nearly) full-featured CTF platform with a easy-to-use management UI.

## Features

- I18N

  Currently we only have [Chinese](https://github.com/SummerWish/DummyCTFPlatform/blob/master/ui/locales/zh.json). PRs are welcome!

- User register and login

  A user can take part in multiple CTF contests in the platform.

- Challenge pool

  You can store candidate challenges and only add what you want to a CTF contest.

- Multiple CTF contests

  Needn't to clear database to start a new game. You can start multiple CTF contests.

- CTF contest registration validation

  You can request an email validation if a user want to take part in the CTF contest. You can also implement your own validation method.

- Trending, Scoreboard

  Support real-time trending charts and scoreboards.

- Event timeline

  Let contesters know new challenges or announcements.

- Management UI

  You can do everything in the Web UI! Add challenges, add contests, change flags, view users, reset users' password, view submission histories, etc.

- Site Announcements

  Publish site announcements for visitors using a WYSIWYG editor.

- Modern and fancy UI

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

Currently there are no difference between debug mode and production mode :P

The default mode is production mode. You can create a file named `.debug` in the root of the project to switch to debug mode (restarting application is required).

### Customize configurations

`config.yaml` is the base config file from the project. It is not recommended to edit it. Instead, please create a file named `config.debug.yaml` or `config.production.yaml`.

You can write `base`, `debug`, `production` section in any of the three config files. In the production environment, it will use `base`+`production` and in the debug environment, it will use `base`+`debug`. (`+` means deep-merge)

In other words:

- the production mode loads `base` from `config.yaml` + `base` from `config.debug.yaml` + `base` from `config.production.yaml` + `production` from `config.yaml` + `production` from `config.debug.yaml` + `production` from `config.production.yaml`

- the debug mode loads `base` from `config.yaml` + `base` from `config.debug.yaml` + `base` from `config.production.yaml` + `debug` from `config.yaml` + `debug` from `config.debug.yaml` + `debug` from `config.production.yaml`


## TODO

- [ ] Customize profile fields
- [ ] Remove challenges
- [ ] Remove contests
- [ ] Deactivate / activate a user from UI
- [ ] Customize content of a pre-built event
- [ ] Refresh scoreboard when user modified its nickname or admin changed the score of a challenge
- [ ] Provide a button to export contesters

## License

MIT
