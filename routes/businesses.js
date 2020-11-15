const router = require('express').Router();
const Businesses = require('../models/Businesses');

const { signedIn, correctInput , isID , dataExists } = require('./validators');

/**
 * create business and store name and password. 
 * @name POST/api/business
 * @return {Business} - the created business object (minus the password cuz duh)
 * 
 * @throws {201} - if business is created
 * @throws {400} - if business is already signed in 
 * @throws {409} - if name is taken
 */
router.post('/', async (req, res) => {
  if (req.session.business) {
    res.status(400).send({ error : `already signed in as "${req.session.business.name}"` });
  } else { 
    if (!correctInput(req, res,['name', 'address', 'password'])) return;

    try {
      let business = await Businesses.create(req.body.name, req.body.address, req.body.password);
      if (business) {
        req.session.business = business;
        res.status(201).send({ business, message : "business createn"});
      } else {
        res.status(409).json({ error: "address taken" }).end();
      }
    } catch (error) {
        res.status(503).json({ error: "could not create business" }).end();
    }
  }
}); 

/**
 * edit information about the business. 
 * this can be used to change name, password, but NOT BOTH. 
 * @name PATCH/api/business
 * @param {string} name - new name to change to
 * @param {string} password - new pssword to change to
 * @return {User} - the altered business object (minus paassword,even if password was changed)
 * 
 * @throws {200} - if business is altered
 * @throws {400} - no name or password are invalid
 * @throws {401} - if business is not signed in 
 * @throws {409} - if new name is taken
 */
router.patch('/', async (req, res) => { 
  if (!signedIn(req, res, false)) return;

  if (req.body.name && req.body.name.length) { // changing name
   
    try {
      let changed = await Businesses.changeName(req.session.business.id, req.body.name);
      if (changed) {
        res.status(200).send(changed);
        req.session.business = changed;
      }
    } catch (error) {
      res.status(503).json({ error: "could not change name" }).end();
    }

  } else if (req.body.password && req.body.password.length) { // changing password

    try {
      let changed = await Businesses.changePassword(req.session.business.id, req.body.password);
      if (changed) {
        res.status(200).send(changed);
        req.session.business = changed;
      } else {
        res.status(400).send({ error: 'invalid new password.' });
      }
    } catch (error) {
      res.status(503).json({ error: "could not change password" }).end();
    }

  } else {
    res.status(400).send({ error: 'no inputs given' });
  }
});

/**
 * delete business from database 
 * @name DELETE/api/business
 * @return {User} - the deleted User
 * 
 * @throws {200} - if business is deleted
 * @throws {401} - if business is not signed in 
 * @throws {404} - if business doesn't exist
 */
router.delete('/', async (req, res) => {
  if (!signedIn(req, res, false)
    || !(await dataExists(res, req.session.business.id, Businesses))) return;

  try {
    let deleted = await Businesses.delete(req.session.business.id);
    console.log(deleted);
    if (deleted) {
      req.session.business = null;
      res.status(200).send(deleted);
    }
    
  } catch (error) {
    res.status(503).json({ error: "could not delete business" }).end();
  }
});

/**
 * @name GET/api/business/id?
 * @returns {User[]} Array of all businesss 
 */
router.get('/:id?', async (req, res) => {
  try{
    if (req.params.id) {
      if (!isID(res,req.params.id)
      || !(await dataExists(res, req.session.business.id, Businesses))) return;

      let business = await Businesses.get(req.params.id);
      if (business) {
        res.status(200).send(business);
      } else {
        res.status(404).send({error: "business does not exist"});
      }
    } else {
      res.status(200).send(await Businesses.getAll());
    }

  } catch (error) {
    res.status(503).json({ error: "could not get businesses" }).end();
  }
});

module.exports = router;