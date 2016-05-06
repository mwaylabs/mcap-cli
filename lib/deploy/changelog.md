
## 0.3.5 - 2015-03-19
- streaming of deploy response

## 0.3.2 - 2014-11-21
- Improve error handling

## 0.3.0 - 2014-11-21
- Use [mcap-application-validation](https://github.com/mwaylabs/mcap-application-validation)
- Get `name` and `uuid` from `mcap.json`
- Refactor promises

## 0.2.0 - 2014-09-29
- Use git ignore style for '.mcapignore'

## 0.1.0 - 2014-09-24
- '.mcapignore' will be evaluated
- Improve error reporting

## 0.0.6 - 2014-09-04
- show error if login failed
- delete zip if the upload was unsuccessfull
- first check if current authentication and organization is working then create zip file

## 0.0.5 - 2014-09-01
- add an endpoint as option to the upload/deploy call

## 0.0.4 - 2014-08-29
- Set upload endpoint to /studio/upload

## 0.0.3 - 2014-08-21
- test the organisation default roles before upoad. A deploy should only be permitted if the orga has default roles.

## 0.0.2 - 2014-08-20
- add endpoint to return value
    - endpoint is based on the organization name of the given authentication

## 0.0.1 - 2014-08-18
- add deploy response

## 0.0.0 - 2014-07-28
- add deploy command
