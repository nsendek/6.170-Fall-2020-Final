const router = require('express').Router();
const Businesses = require('../models/Businesses');
const Users = require('../models/Users');

const { signedIn, correctInput , dataExists} = require('./validators');


/**
 * if page refreshes, confirm if still signed in on refresh
 * @name GET/api/session
 */
router.get('/', async (req, res) => {
  try {
    let business = req.session.business;
    let user = req.session.user;
    res.status(200).send({user, business});
  } catch (error) {
    res.status(503).json({ error: "could not check session" }).end();
  }
});


/**
 * sign in and save user to session
 * @name POST/api/session
 * @throws {200} - if user is signed in
 * 
 * @throws {400} - if user is already signed in
 * @throws {401} - if username or password do not authenticate a user
 */
router.post('/', async (req, res) => {
  if (req.session.user) {
    res.status(400).send({ error: `already signed in as ${req.session.user.username}` });
  } else {
    try {
      if (!correctInput(req, res,['username','password']) ) return;
      
      let user = await Users.authenticate(req.body.username, req.body.password);
      if (user)  {
        req.session.user = user;
        res.status(200).send({ user, message : "signed in to personal account"});
      } else {
        res.status(401).send({ error: 'invalid username or password' });
      }
    } catch (error) {
      res.status(503).json({ error: "could not sign in" }).end();
    }
  }
});

/**
 * sign out and remove username from session.
 * @name DELETE/api/session
 * @throws {200} - if user is signed out
 * 
 * @throws {401} - if user is not signed in 
 */
router.delete('/', async (req, res) => {
  if (!signedIn(req, res)) return;

  try {
    req.session.user = null;
    res.status(200).send({ message: `signed out of personal account` });

  } catch (error) {
    res.status(503).json({ error: "could not sign out" }).end();
  }
});

/**
 * sign in and save business to session
 * @name POST/api/session/business
 * @throws {200} - if business is signed in
 * 
 * @throws {400} - if business is already signed in
 * @throws {401} - if business or password do not authenticate a business
 */
router.post('/business', async (req, res) => {
  if (req.session.business) {
    res.status(400).send({ error: `already signed in as ${req.session.business.name}` });
  } else {
    try {
      if (!correctInput(req, res,['id', 'password']) 
      || !(await dataExists(res, req.body.id, Businesses))) return;
      
      let business = await Businesses.authenticate(req.body.id, req.body.password);
      if (business)  {
        req.session.business = business;
        res.status(200).send({ business, message : "signed in to business account"});
      } else {
        res.status(401).send({ error: 'invalid password' });
      }
    } catch (error) {
      res.status(503).json({ error: "could not sign in" }).end();
    }
  }
});

/**
 * sign out and remove business from session.
 * @name DELETE/api/session/business
 * @throws {200} - if business is signed out
 * 
 * @throws {401} - if business is not signed in 
 */
router.delete('/business', async (req, res) => {
  if (!signedIn(req, res, false)) return;
  try {
    req.session.business = null;
    res.status(200).send({ message: `signed out of business account` });

  } catch (error) {
    res.status(503).json({ error: "could not sign out" }).end();
  }
});

module.exports = router;