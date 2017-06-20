import mongoose from 'mongoose';
//import GeoJSON from 'mongoose-geojson-schema';

const featureSchema = new mongoose.Schema({
  type: {type: String},
  'geometry' : {
      type: {type: String},
      'coordinates' : {
          'type' : [Number],
          'index' : '2dsphere',
          'required' : true
      }
  },
  'properties' : {
      'name' : String,
      'name_full': String,
      'time_created': Date,
      'queue' : String,
      'cluster' : String,
      'waitTime' : String
  }
});

/* First argument of .model is the singular name of the collection (Currentqueue) */
/* mongoose looks for the plural in the db (currentqueues) ************************/
/* .model creates a copy of Schema ************************************************/

const Clinic = mongoose.model('Clinic', featureSchema, 'clinics');

/* Export the model */
module.exports = Clinic;

/* Test schema */

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
