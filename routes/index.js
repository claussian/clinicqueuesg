import express from 'express';
import clinicsController from '../controller/clinics';


const router = express.Router();

/* GET index page */
router.get('/', clinicsController.index);

/* GET login page */
router.get('/login', clinicsController.login);

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
