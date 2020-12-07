const router = require('express').Router();
const Businesses = require('../models/Businesses');
// const Reviews = require('../models/Reviews');
// const Users = require('../models/Users');

const { correctInput } = require('./validators');

/**
 * @typedef SearchResult
 * @prop {Reviews[]} reviews - list of freets whose content match search 
 * @prop {Businesses[]} user - list of users whose username or bio match search 
 * @prop {User[]} user - list of users whose username or bio match search 
 */

/**
 * Get all Users and Freets by search query
 * @name GET/api/search
 * @return {SearchResult} 
 */
router.get('/', async (req, res) => {
  if (!correctInput(req, res, [], [], ['search'])) return;

  try {
    let businesses = await Businesses.search(req.query.search);

    res.status(200).send( {businesses});
    
  } catch (error) {
    res.status(503).json({ error: "could not search" }).end();
  }
 });
 
module.exports = router;