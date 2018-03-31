

module.exports = function (app) {

  var userModel = require('../../model/user/user.model.server');
  var passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy;

  var bcrypt = require("bcrypt-nodejs");

  app.get("/api/user", findUsers);
  app.get("/api/user/:uid", findUserByID);
  app.post("/api/user", createUser);
  app.put("/api/user/:uid", updateUser);
  app.delete("/api/user/:uid", deleteUser);

  // authentication api
  app.post('/api/login', passport.authenticate('local'), login);
  app.post("/api/register", register);
  app.post('/api/logout', logout);
  app.post('/api/loggedIn', loggedIn);



  passport.use(new LocalStrategy(localStrategy));

  passport.serializeUser(serializeUser);
  passport.deserializeUser(deserializeUser);


  function localStrategy(username, password, done) {
    userModel
      .findUserByUsername(username)
      .then(
        function(user) {
          if(user && bcrypt.compareSync(password, user.password)) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        },
        function(err) {
          if (err) {
            return done(err);
          }
        }
      );
  }



  function serializeUser(user, done) {
    done(null, user);
  }

  function deserializeUser(user, done) {
    userModel.findUserById(user._id)
      .then(
        function(user) {
          done(null, user);
        },
        function(err) {
          done(err, null);
        }
      );
  }

  function login(req, res) {
    res.json(req.user);
  }

  function register(req, res) {
    var user = req.body;
    user.password = bcrypt.hashSync(user.password);
    userModel.findUserByUsername(user.username)
      .then(function (data) {
        if(data){
          res.status(400).send('Username has been taken!');
        } else {
          userModel.createUser(user)
            .then(function(user) {
              req.login(user, function(err) {
                res.json(user);
              });
            });
        }
      });
  }

  function logout(req, res) {
    req.logout();
    res.send(200);
  }

  function loggedIn(req, res) {
    if(req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.send('0');
    }
  }

  function createUser(req, res) {
    var newUser = req.body;
    userModel.createUser(newUser)
      .then(function(user) {
        res.json(user);
      })
  }

  function findUsers(req, res) {
    var username = req.query["username"];
    var password = req.query["password"];
    if(username && password) {
      userModel.findUserByCredentials(username, password)
        .then(function(user){
          res.json(user);
        });
      return;
    } else if(username) {
      userModel.findUserByUsername(username)
        .then(function(user){
          res.json(user);
        });
      return;
    }
    res.json(null);
  }

  function findUserByID(req, res) {
    var uid = req.params["uid"];
    userModel.findUserById(uid)
      .then(function(user) {
        res.json(user);
      });
  }

  function deleteUser(req, res) {
    var uid = req.params["uid"];
    userModel.deleteUser(uid)
      .then(function(user) {
        res.json(user);
      });
  }

  function updateUser(req, res) {
    var uid = req.params["uid"];
    var newUser = req.body;
    userModel.updateUser(uid, newUser)
      .then(function() {
        res.json(null);
      })
  }
};
