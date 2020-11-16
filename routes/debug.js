const router = require('express').Router();

const Users = require('../models/Users');
const Businesses = require('../models/Businesses');
const Reviews = require('../models/Reviews');
const Badges = require('../models/Badges');



// for testing only will run whatever lines of code you wanna test
router.get('/', async (req, res) => {

  // templates need label
  // let template = await Badges.addTemplate("killtacular", "goodbye");
  // let template2 = await Badges.addTemplate("", "goodbye");
  // let template3 = await Badges.addTemplate("nigga", "goodbye");
  // console.log(template);
  // console.log(template2);
  // console.log(template3)
  // console.log(await Badges.getTemplates());

  // can't create badge without business && userId
  // console.log(await Badges.create(1,'nigga')); // WORKS
  // console.log(await Badges.get("dasfa"))
  console.log(await Badges.delete(2));

  res.send("check server terminal");
});


module.exports = router;