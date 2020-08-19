Fitbit API Wrapper
==================

A wrapper for fitbit API to be used with any node.js application

## Usage

The API wrapper is located in helpers directory. The test node app is generated from express-generator and not modified.

Refer to https://dev.fitbit.com/build/reference/web-api/

Send URL params of Fitbit's API as a JSON to the wrapper call. 
Hyphenated params are to be in camel case.

Place clientId and clientSecret as a JSON in `keys/fitbit.js` in the root folder.

```
module.exports = {
    clientId: 'ABCDEF',
    clientSecret: '7398239eh23bkj23u2i3nkjnjn2k3n2'
};
```