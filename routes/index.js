import express from 'express';
import clinicsController from '../controller/clinics';
import userController from '../controller/user';
var passport = require('passport');

const router = express.Router();

/* GET index page */
router.get('/', clinicsController.index);

/* GET login page */
router.get('/login', clinicsController.login);

/* GET signup page */
router.get('/signup', clinicsController.signup);

/* GET report page */
router.get('/report', clinicsController.report);

/* POST signup page */
router.post('/signup', passport.authenticate('local-signup', {
  successRedirect : '/report',
  failureRedirect : '/signup',
  failureFlash: true
}));

/* POST login */
router.post('/login', passport.authenticate('local-login', {
  successRedirect : '/report',
  failureRedirect : '/login',
  failureFlash: true
}));

/* GET polyclinics JSON */
router.get('/load', clinicsController.listPoly);

/* GET private clinics JSON */
router.get('/loadPrivate', clinicsController.listPrivate);

/* GET polyclinic names JSON */
router.get('/loadPolyNames', clinicsController.listPolyNames);

/* GET private clinic names JSON */
router.get('/loadPrivateNames', clinicsController.listPrivateNames);

module.exports = router;

// router.get('/', (req, res, next) => {
//   res.render('index', {
//     title: 'Express'
//   });
// });

// export default router;
