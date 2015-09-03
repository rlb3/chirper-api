var bcrypt = require('bcrypt');

module.exports = function(req, res, render) {

  if (!req.body.username || !req.body.password) {
    return render([412, "You need to specify a username and password!"]);
  }

  // Generate a salt (8 characters) and hash
  bcrypt.hash(req.body.password, 8, function(err, hash) {
    if (err) return render(err);

    // Create the new user
    var newUser = {
      username: req.body.username,
      hash: hash
    };

    // Add it to the database
    req.models.user.create(newUser)
      .then(function(user) {
        console.log("Created new user!");
        res.status(201).json({});
      })
      .catch(function(err) {
        render(err);
      });
  });

};
