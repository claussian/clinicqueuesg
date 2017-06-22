import Polyclinic from '../models/Polyclinic'
import Privateclinic from '../models/Privateclinic'
var cloudinary = require('cloudinary');

/*************************/
/* Render pages */
/*************************/

exports.index = (req, res) => {
    res.render('index');
}

exports.login = (req, res) => {
    res.render('login');
}

exports.signup = (req, res) => {
    res.render('signup');
}

exports.report = (req, res) => {
    res.render('report');
}

/********************************/
/* Return array of JSON objects */
/********************************/
/* Return all Polyclinics JSON  */
exports.listPoly = (req, res) => { // to return JSON object
  Polyclinic.find({}, (err, clinics) => {
    if (err) {
      console.log(err);
    }
    //console.log(clinics)
    res.send(clinics);
    //res.json(clinics) // only for POST
  });
}
/* Return all Private clinics JSON */
exports.listPrivate = (req, res) => {
  Privateclinic.find({}, (err, clinics) => {
    if (err) {
      console.log(err);
    }
    res.send(clinics);
  });
}

/* Return all Private clinic names JSON */
exports.listPolyNames = (req, res) => {
  Polyclinic.find({},'properties.name_full', (err, clinics) => {
    if (err) {
      console.log(err);
    }
    res.send(clinics);
  });
}

/* Return all Private clinic names JSON */
exports.listPrivateNames = (req, res) => {
  Privateclinic.find({},'properties.Name', (err, clinics) => {
    if (err) {
      console.log(err);
    }
    res.send(clinics);
  });
}

/**********************************/
/* Update photos in private clinic*/
/**********************************/

exports.updatePhoto = (req, res) => {
  cloudinary.uploader.upload(req.file.path, function (result) {
      Privateclinic.findOneAndUpdate({
        'properties.name': req.body
      }, {
        'properties.queueImg': result.secure_url,
        'properties.timestamp': new Date()
      }, (err) => {
        if (err) throw err
        res.redirect('/report');
      });
    });
  }
// cloudinary.uploader.upload("my_picture.jpg", function(result) {
//   console.log(result)
// });
