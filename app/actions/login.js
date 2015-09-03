var jwt = require('jwt-simple');
var bcrypt = require('bcrypt');

module.exports = function(req, res, render) {

  if (req.body.grant_type !== 'password') {
    return render("Unsupported grant type");
  }

  // Check if a user with that username exists
  req.models.user.find({
    where: {
      username: req.body.username
    }
  })
    .then(function(user) {
      // The user exists! Fetch his/her hash:
      var hash = user.get({ role: 'admin' }).hash;

      // Compare that user's password (hash) with the sent password
      bcrypt.compare(req.body.password, hash, function(err, match) {
        if (err || !match) {
          return render([400, "Wrong password!"]);
        }

        // It matches! => generate a JWT token
        var claim = { userId: user.id };
        var secret = 's3cret_c0de'; // Use whatever you want here

        var token = jwt.encode(claim, secret);

        // Send response with token
        res.json({
          'access_token': token,
          'token_type': 'bearer'
        });
      });
    })
    .catch(function(err) {
      return render([400, "No user with this username was found!"]);
    });

};
