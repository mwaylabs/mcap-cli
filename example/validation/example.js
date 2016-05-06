
var ApplicationValidation = require('./');

var validation = new ApplicationValidation();

validation.run('./test/fixtures/validation_error', function(err) {
  if (err) {
    return console.log(err.details);
  }
  console.log('Project is valid!');
});
