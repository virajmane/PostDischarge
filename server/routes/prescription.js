const express = require("express");
const router = express.Router();
const fetchUser = require("../middleware/fetchUser");
const Prescription = require("../models/Prescription");
const User = require("../models/User");
var mongoose = require('mongoose');


// ROUTE 1 : Add a new prescription : Login required
router.post("/addPrescription/:id", fetchUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { medicine, note } = req.body;
    const event = new Prescription({
      doctor: req.user.id,
      patient: req.params.id,
      note: note,
      medicines: medicine,
      doctorName: user.name,
      startDate: new Date().toDateString(),
      refill: false,
    });
    const savedEvent = await event.save();
    const events = await Prescription.find({$and:[{ patient: req.params.id },{ doctor: mongoose.Types.ObjectId(req.user.id) }]}).sort({
      startDate: -1,
    });
    res.json(events);
  } catch (error) {
    console.log(error.message);
    res.status(500).json("Oops internal server error occured");
  }
});

// ROUTE 2 : Fetch patient prescription : Login required
router.get("/fetchprescriptionpatient", fetchUser, async (req, res) => {
  try {
    const events = await Prescription.find({ patient: req.user.id }).sort({
      startDate: -1,
    });
    res.json(events);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Oops internal server error occured");
  }
});

// ROUTE 3 : Delete prescription from doctor site : Login required
router.delete("/deleteprescription/:id", fetchUser, async (req, res) => {
  try {
    //find the prescription to be deleted and then delete it
    let prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).send("Such Prescription not found");
    }
    //if selected prescription is the login users prescription
    if (prescription.doctor.toString() !== req.user.id) {
      return res.status(401).send("Permission not granted");
    }
    prescription = await Prescription.findByIdAndDelete(req.params.id);
    res.send("Success!! Prescription deleted succesfully");
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Oops internal server error occured");
  }
});

// ROUTE 4 : Fetch todays medicine for patient portal : Login required
router.get("/fetchtodayMeds", fetchUser, async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.user.id });
    prescriptions.map((prescription, index) =>
      prescription.medicines.map((med, index) => {
        if (med.eatenTime && med.eatenTime != new Date().toDateString()) {
          med.eatenTime = "";
          med.state = "info";
          prescription.save();
        }
      })
    );
    res.json(prescriptions);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Oops internal server error occured");
  }
});

// ROUTE 5 : update existing prescription state of a patient: Login required
router.put("/updatePrescription/:id1/:id2", fetchUser, async (req, res) => {
  try {
    const { state, eatenTime } = req.body;
    const prescriptionId = req.params.id1;
    const medId = req.params.id2;
    let prescription = await Prescription.findById(prescriptionId);
    if (!prescription) {
      return res.status(404).send("Such prescription not found");
    }
    if (prescription.patient.toString() !== req.user.id) {
      return res.status(401).send("Permission not granted");
    }
    for (let index = 0; index < prescription.medicines.length; index++) {
      const med = prescription.medicines[index];
      if (med._id == medId) {
        med.eatenTime = eatenTime;
        med.state = state;
        prescription.save();
        break;
      }
    }
    const retprescription = await Prescription.find({ patient: req.user.id });
    res.json(retprescription);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Oops internal server error occured");
  }
});

// ROUTE 6 : Refille prescription from patient site : Login required
router.put("/refillPrescription/:id", fetchUser, async (req, res) => {
  try {
    const { refill } = req.body;
    //find the prescription to be deleted and then delete it
    let prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).send("Such Prescription not found");
    }
    //if selected prescription is the loin users prescription
    if (prescription.patient.toString() !== req.user.id) {
      return res.status(401).send("Permission not granted");
    }
    prescription.refill = refill;
    prescription.save();
    const retprescription = await Prescription.find({ patient: req.user.id });
    res.json(retprescription);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Oops internal server error occured");
  }
});

// ROUTE 7 : Fetch patient prescription from doctor site : Login required
router.get("/fetchprescriptiondoctor/:id", fetchUser, async (req, res) => {
  try {
    //console.log(mongoose.Types.ObjectId(req.user.id) );
    const events = await Prescription.find({$and:[{ patient: req.params.id },{ doctor: req.user.id}]}).sort({
      startDate: -1,
    });
    res.json(events);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Oops internal server error occured");
  }
});

// ROUTE 8 : Fetch doctor refill  requests : Login required
router.get("/fetchRefillprescriptiondoctor", fetchUser, async (req, res) => {
  try {
    const events = await Prescription.find({$and:[{ refill: true },{ doctor: mongoose.Types.ObjectId(req.user.id) }]})
    res.json(events);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Oops internal server error occured");
  }
});

module.exports = router;
