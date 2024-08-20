<div align="center">
<br/>

## adonis-secrets

### Safely store your AdonisJS environment variables in your repositories

<br/>
</div>

<div align="center">

[![PRs Welcome](https://img.shields.io/badge/PRs-Are%20welcome-brightgreen.svg?style=flat-square)](https://makeapullrequest.com) [![License](https://img.shields.io/github/license/syneki/notion-cms?label=License&style=flat-square)](LICENCE)

[![adonis-secrets](https://img.shields.io/npm/v/adonis-secrets?label=%40notion-render%2Fclient&style=flat-square)](https://www.npmjs.com/package/adonis-secrets)

[🔨 Install](#🔨-install) • [🚀 Get started](#🚀-get-started) • [🔧 Environments](#🔧-environments)

[Contribute](#contributing) • [License](#license)

</div>

# Introduction

This AdonisJS library allows you to safely store your environment variable files in your repository by bringing two commands `env:encrypt` and `env:decrypt`. It is heavily inspired by the popular framework [Laravel](https://laravel.com/).

# 🔨 Install

```shell
node ace add adonis-secrets
```

# 🚀 Get started

You can encrypt your local environment file (`.env`) by using the `env:encrypt` command.
It will create a new file `.env.encrypted`

```bash
node ace env:encrypt
```

And then decrypt it using `env:decrypt`.

```bash
APP_KEY=myappkey node ace env:decrypt
```

> Under the hood, your files are encrypted using the `APP_KEY` environment variable. When decrypting a file the variable might not be available (as it might be inside the encrypted file). When it is the case, you have to provide it manually.

# 🔧 Environments

You might want to store the environment variables of other environments. You can do this by simply using the `NODE_ENV` variable. This will encrypt/decrypt your `.env.[environment]` file.

```bash
NODE_ENV=staging node ace env:encrypt
NODE_ENV=staging node ace env:decrypt
```

When providing `development` or nothing it will default to the `.env` file.

> ⚠ For security reasons, make sure you a different key for each environment.
