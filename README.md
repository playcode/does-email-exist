# Does Email Exist

- Validates SMTP server is running.
- Validates MX records are present on DNS.
- Validates email looks like an email i.e. contains an "@" and a "." to the right of it.
- Validates common typos e.g. example@gmaill.com using [mailcheck](https://github.com/mailcheck/mailcheck).
- Validates email was not generated by disposable email service using [disposable-email-domains](https://github.com/ivolo/disposable-email-domains).
- Validates mailbox exists on SMTP server.

## About us
The #1 [Javascript Online](https://playcode.io/javascript-online) editor and compiler to write, compile and run JavaScript online. Perfect for learn and prototype javascript online. Easy to use.

## Getting Started

Compatible with node.js only. Not browser ready.

```
npm i does-email-exist --save
```

Usage

```typescript
import validate from 'does-email-exist'
const main = async () => {
  let res = await validate('example@gmail.com')
  // {
  //   "valid": false,
  //   "reason": "smtp",
  //   "validators": {
  //       "regex": {
  //         "valid": true
  //       },
  //       "typo": {
  //         "valid": true
  //       },
  //       "disposable": {
  //         "valid": true
  //       },
  //       "mx": {
  //         "valid": true
  //       },
  //       "smtp": {
  //         "valid": false,
  //         "reason": "553-mail rejected because your IP is in the PBL.",
  //         "code": 553
  //       }
  //   }
  // }

  // Can also be called with these default options
  await validate({
    email: 'name@example.org', // Recipient
    sender: 'name@example.org', // Your correct email address
    helloName: 'localhost',
    validateRegex: true,
    validateMx: true,
    validateTypo: false,
    validateDisposable: true,
    validateSMTP: true,
  })
}
```

[Based on deep-email-validator](https://github.com/mfbx9da4/deep-email-validator)

LICENSE: MIT.