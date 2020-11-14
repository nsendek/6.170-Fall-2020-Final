const router = require('express').Router();
const Users = require('../models/Users');

const { signedIn, correctInput , isID , dataExists } = require('./validators');

/**
 * create user and store username and password. 
 * @name POST/api/user
 * @return {User} - the created user object (minus the password cuz duh)
 * 
 * @throws {201} - if user is created
 * @throws {400} - if user is already signed in 
 * @throws {409} - if username is taken
 */
router.post('/', async (req, res) => {
  if (req.session.user) {
    res.status(400).send({ error : `already signed in as ${req.session.user.username}` });
  } else {
    if (!correctInput(req, res,['username', 'password'])) return;

    try {
      let user = await Users.create(req.body.username, req.body.password);
      if (user) { // username password pair is already valid so store in session
        req.session.user = user;
        res.status(201).send({ user, message : "user created and signed in"});
      } else {
        res.status(409).send({ error: 'username taken' });
      }
    } catch (error) {
        res.status(503).json({ error: "could not create user" }).end();
    }
  }
});

/**
 * edit information about the user. 
 * this can be used to change username, password, but NOT BOTH. 
 * @name PATCH/api/user
 * @param {string} username - new username to change to
 * @param {string} password - new pssword to change to
 * @return {User} - the altered user object (minus paassword,even if password was changed)
 * 
 * @throws {200} - if user is altered
 * @throws {400} - no username or password are invalid
 * @throws {401} - if user is not signed in 
 * @throws {409} - if new username is taken
 */
router.patch('/', async (req, res) => { 
  if (!signedIn(req, res)) return;
  
  if (req.body.username && req.body.username.length) { // changing username

    try {
      let changed = await Users.changeName(req.session.user.id, req.body.username);
      if (changed) {
        req.session.user = changed;
        res.status(200).send(changed);
      } else {
        res.status(409).send({ error: 'username taken' });
      }
    } catch (error) {
      res.status(503).json({ error: "could not change username" }).end();
    } 

  } else if (req.body.password && req.body.password.length) { // changing password

    try {
      let changed = await Users.changePassword(req.session.user.id, req.body.password);
      if (changed) res.status(200).json(changed).end();
      else res.status(400).send({ error: 'invalid new password.' });
    } catch (error) {
      res.status(503).json({ error: "could not change password" }).end();
    }

  } else {
    res.status(400).send({ error: 'no inputs given' });
  }
});

/**
 * delete user from database 
 * @name DELETE/api/user
 * @return {User} - the deleted User
 * 
 * @throws {200} - if user is deleted
 * @throws {401} - if user is not signed in 
 * @throws {404} - if user doesn't exist
 */
router.delete('/', async (req, res) => {
  if (!signedIn(req, res)
    || !(await dataExists(res, req.session.user.id, Users))) return;

  try {
    let deleted = await Users.delete(req.session.user.id);
    console.log(deleted)
    if (deleted) {
      req.session.user = null; // remove user from session
      res.status(200).send(deleted);
    }
  } catch (error) {
    res.status(503).json({ error: "could not delete user" }).end();
  }
});


/**
 * @name GET/api/user/id?
 * @returns {User[]} Array of all users 
 */
router.get('/:id?', async (req, res) => {
  try{
    if (req.params.id) {
      if (!isID(res,req.params.id)) return;
      let user = await Users.get(req.params.id);
      if (user) {
        res.status(200).send(user);
      } else {
        res.status(404).send({error: "user does not exist"});
      }
      
    } else {
      res.status(200).send(await Users.getAll());
    }

  } catch (error) {
    res.status(503).json({ error: "could not get users" }).end();
  }
});

module.exports = router;