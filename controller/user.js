const passport = require('passport');
const User = require('../models/User');

/**
 * GET /login
 * Login page.
 */
exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('/login', {
    title: 'Login'
  });
};

/**
 * POST /login
 * Sign in using email and password.
 */
 // Login
//  exports.postLogin = (req, res) => {
//    var userLoginStrategy = passport.authenticate('local-login', {
//    successRedirect : '/report',
//    failureRedirect : '/login',
//    failureFlash: true
//  });
//  return userLoginStrategy(req,res);
// };
/**
 * GET /logout
 * Log out.
 */
exports.logout = (req, res) => {
  req.logout();
  res.redirect('/');
};

/**
 * GET /signup
 * Signup page.
 */
exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('/signup', {
  });
};

/**
 * POST /signup
 * Create a new local account.
 */
// exports.postSignup = (req, res) => {
//   var userSignupStrategy = passport.authenticate('local-signup', {
//     successRedirect : '/report',
//     failureRedirect : '/signup',
//     failureFlash: true
//   });
//   return userSignupStrategy(req, res);
// };
