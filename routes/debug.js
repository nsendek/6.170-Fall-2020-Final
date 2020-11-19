const router = require('express').Router();

const Users = require('../models/Users');
const Businesses = require('../models/Businesses');
const Reviews = require('../models/Reviews');
const {Badges , BadgeTemplates }  = require('../models/Badges');



// for testing only will run whatever lines of code you wanna test
router.get('/', async (req, res) => {

  res.send("check server terminal");
});

module.exports = router;