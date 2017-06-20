import express from 'express';
import clinicsController from '../controller/clinics';


const router = express.Router();

/* GET index page */
router.get('/', clinicsController.index);

/* GET clinics data */
router.get('/load', clinicsController.listJSON)

module.exports = router;

// router.get('/', (req, res, next) => {
//   res.render('index', {
//     title: 'Express'
//   });
// });

// export default router;
