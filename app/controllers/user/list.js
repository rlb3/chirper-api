module.exports = function(req, res, render) {

  var findQuery;

  if (req.query.me && !req.user) {
    return render("You're not logged in!");
  }

  // Get the user from the token
  if (req.query.me) {
    findQuery = {
      where: { id: req.user }
    };
  }

  if (req.query.username) {
    findQuery = {
      where: { username: req.query.username }
    };
  }

  if (req.query.followee) {
    findQuery = {
      include: [
        { model: req.models.user, as: 'followees', where: { username: req.query.followee } }
      ]
    };
  }

  if (req.query.follower) {
    findQuery = {
      include: [
        { model: req.models.user, as: 'followers', where: { username: req.query.follower } }
      ]
    };
  }

  req.models.user
    .findAll(findQuery)
    .then(function(users) {
      render(users);
    })
    .catch(function(err) {
      render(err);
    });

};
