import Clinic from '../models/GeoJSON'

/***********************/
/* Return the GeoJSON */
/**********************/

exports.index = (req, res) => {
    res.render('index')
}

exports.listJSON = (req, res) => { // to return JSON object
  Clinic.find({}, (err, clinics) => {
    if (err) {
      console.log(err);
    }
    //console.log(clinics)
    res.send(clinics)
    //res.json(clinics) // only for POST
  });
}


// let testclinic = new Clinic ({
//   type: 'Feature',
//   'geometry': {
//       type: 'Point',
//       'coordinates': [103.945916, 1.357416]
//   },
//   'properties' : {
//     'name': 'TEST',
//     'name_full': 'Test Polyclinic',
//     'time_created': new Date('2017-06-19 15:43:34.081701'),
//     'queue': '140',
//     'cluster': 'SHP',
//     'waitTime': '2 hours 20 mins'
//   }
// })
// console.log(testclinic);
//
// /* Save to db */
//
// testclinic.save((err) =>{
//   if(err) {
//     console.log(err.message);
//     return;
//   }
//   console.log('Testclinic saved');
// })
