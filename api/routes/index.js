var express = require("express");
var router = express.Router();
//const FlightsDetailsDatabaseSchema = require('../models/flights-details-database.js');

const ObjectID = require("mongodb").ObjectID;

router.get('/origins', (req,res,next) => {
  req.collectionFlightDetailsDatabase
    .find({})
    .map(origin => origin.fromCity)
    .toArray()
    .then((results) => res.json(results))
    .catch((err) => res.send(err));
});

router.get('/destinations', (req,res,next) => {
  req.collectionFlightDetailsDatabase
    .find({})
    .map(destination => destination.toCity)
    .toArray()
    .then((results) => res.json(results))
    .catch((err) => res.send(err));
});

router.get("/bookings/:username", (req, res, next) => {
  const {username} = req.params;
  req.collection
    .find({ticketOwner: username})
    .toArray()
    .then((results) => res.json(results))
    .catch((error) => res.send(error));
});

router.get("/users/:name", (req, res, next) => {
  const {name} = req.params;
  
  req.collectionUsers
    .find({name: name})
    .map(x => x.password)
    .toArray()
    .then((results) => {res.json(results); })
    .catch((error) => res.send(error));
});


router.post("/booking", (req, res, next) => {

  const { origin, flightDate, destination, adults, kids, babies, luggageCarryOn,  laggageCarryOnTrolley, ticketOwner} = req.body;
  if (!origin || !flightDate || !destination || !adults) {
    return res.status(400).json({
      message: "You must provide all fight options",
    });
  }
  const payload = { 
    origin:req.body.origin, 
    flightDate:req.body.flightDate, 
    destination:req.body.destination, 
    adults:req.body.adults, 
    kids:req.body.kids, 
    babies:req.body.babies,
    luggageCarryOn: req.body.luggageCarryOn,
    laggageCarryOnTrolley: req.body.laggageCarryOnTrolley,
    ticketOwner:req.body.ticketOwner
  };
  req.collection.insertOne(payload)
    .then((result) => res.json(result.ops[0]))
    .catch((error) => res.send(error));
});

router.post("/create-user", (req, res, next) => {
 
  const { name, surname, password} = req.body;
  if (!name || !surname || !password) {
    return res.status(400).json({
      message: "You must provide all data",
    });
  }
  const payload = { name: name, surname: surname, password: password };
  req.collectionUsers.insertOne(payload)
    .then((result) => res.json(result.ops[0]))
    .catch((error) => res.send(error));
});

router.delete('/booking/:id', (req, res, next) => {
  const {id} = req.params;
  const _id = ObjectID(id);

  req.collection.deleteOne({_id})
    .then(result => res.json(result))
    .catch(error => res.send(error));
});


module.exports = router;
