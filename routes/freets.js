const router = require('express').Router();
const Freets = require('../models/Freets');
const Users = require('../models/Users');

const { signedIn, correctInput , isID , dataExists} = require('./validators');


/**
 * Get all Freets posted if ID is given return single Freet
 * @name GET/api/freets
 * @param {number} id - the id of the freet.
 * @return {Freet[]} - the created short
 */
router.get('/:id?', async (req, res) => {
    try {

    if (req.params.id) {
      if (!isID(res,req.params.id)) return;
      let freet = await Freets.get(req.params.id);
      if (freet) {
        res.status(200).send(freet);
      } else {
        res.status(404).send({error: "freet does not exist"});
      }
    } else {
      res.status(200).send(await Freets.getAll());
    }
      
    } catch (error) {
    res.status(503).json({ error: "could not get freets" }).end();
  }
 });

/**
 * Get all Freets from a specific user.  
 * @name GET/api/freets/user/:id
 * @param {number} id - the id of the user.
 * @return {Freet[]} - all Freets made by user
 * 
 * @throws {404} - if user does not exist
 * @throws {400} - user id is invalid, NaN, or undefined
 */
router.get('/user/:id?', async (req, res) => {
    if (!correctInput(req, res,[],['id'])
     || !isID(res,req.params.id)
     || !(await dataExists(res, req.params.id, Users))) return;

    try {
        let data = await Freets.getByUser(req.params.id);
        res.status(200).send( data );
    } catch (error) {
        res.status(503).json({ error: "could not get freets" }).end();
    }
 });

 /**
 * Create a Freet
 * @name POST/api/freets
 * @param {string} content - content of the Freet 
 * @return {Freet} - the created Freet
 * 
 * @throws {201} freet is created
 * @throws {401} - if user is not signed in
 * @throws {400} - if freet is too long or not given
 */
router.post('/', async (req, res) => {
    if (!signedIn(req, res) 
     || !correctInput(req, res, ['content'])) return;
    
    try {
        let freet = await Freets.create(req.session.user.id, req.body.content);
        if (freet) res.status(201).send( freet );
        else res.status(400).json({ error : "freet content too long" }).end();
    } catch (error) {
        res.status(503).json({ error: "could not create freet" }).end();
    }
});

 /**
 * Edit a Freet
 * @name PATCH/api/freets/:id
 * @param {number} :id - id of the freet
 * @body {string} content - new content of the Freet 
 * @return {Freet} the updated Freet
 * 
 * @throws {400} - freet id is invalid, NaN, or undefined
 * @throws {401} - if user is not signed in
 * @throws {403} - freet does not belong to user
 * @throws {404} - if freet does not exist
 */
router.patch('/:id?', async (req, res) => {
    if (!signedIn(req, res) 
     || !correctInput(req, res, ['content'], ['id'])
     || !isID(res,req.params.id)
     || !(await dataExists(res, req.params.id, Freets))) return;

    try {
        let owner = await Freets.authenticate(req.session.user.id, req.params.id);
        if (owner) {
            let updated = await Freets.update(req.params.id, req.body.content);
            res.status(200).send(updated);  
        } else {
            res.status(403).json({ error : "freet not associated with user" }).end();
        }
    } catch (error) {
        res.status(503).json({ error: "could not edit freet" }).end();
    }
});

/**
 * delete specified Freet 
 * @name DELETE/api/freets/:id
 * @param {number} :id - id of the freet
 * @return {Freet} the updated Freet
 * 
 * @throws {400} - freet id is invalid, NaN, or undefined
 * @throws {401} - if user is not signed in
 * @throws {403} - freet does not belong to the signed in user
 * @throws {404} - freet does not exist
 */
router.delete('/:id?', async (req, res, next) => {
    // its an empty response put in DELET/api/:id?/likes pass forward
    if (req.params.id == "likes") {next();  return;} 

    if (!signedIn(req, res) 
     || !correctInput(req, res, [], ['id'])
     || !isID(res,req.params.id)
     || !(await dataExists(res, req.params.id, Freets))) return;

    try {
        let owner = await Freets.authenticate(req.session.user.id, req.params.id)
        if (owner) {
            let deleted = await Freets.delete(req.params.id);
            res.status(200).send(deleted);
        } else {
            res.status(403).json({ error : "freet not associated with user" }).end();
        }
    } catch (error) {
        res.status(503).json({ error: "could not delete freet" }).end();
    }
});

// NEW A3 ROUTES ______________________________________________

/**
 * get likes of Freet
 * @name GET/api/freets/:id/likes
 * @param {number} :id - id of the freet
 * @returns {number} - total number of likes for the freet
 * @returns {User[]} - array of Users that liked the freet
 * 
 * @throws {400} - freet id is invalid, NaN, or undefined
 * @throws {404} - freet does not exist
 */
router.get('/:id?/likes', async (req, res) => {
    if (!correctInput(req, res, [], ['id'])
     || !isID(res,req.params.id)
     || !(await dataExists(res, req.params.id, Freets))) return;

    try {
        let users = await Freets.getLikes(req.params.id);
        res.status(200).send({ likes : users.length , users });
    } catch (error) {
        res.status(503).json({ error: "could not get likes" }).end();
    }
});

/**
 * LIKE a Freet
 * @name POST/api/freets/:id/likes
 * @param {number} :id - id of the freet
 * @returns {204} - confirms that freet is liked.
 * 
 * @throws {400} - freet id is invalid, NaN
 * @throws {401} - if user is not signed in
 * @throws {404} - freet does not exist
 * @throws {409} - freet is already liked
 */
router.post('/:id?/likes', async (req, res) => {
    if (!signedIn(req, res) 
     || !correctInput(req, res, [], ['id'])
     || !isID(res,req.params.id)
     || !(await dataExists(res, req.params.id, Freets))) return;

    try {
        let liked  = await Freets.like(req.session.user.id, req.params.id);
        if (liked) res.status(204).end();
        else res.status(409).send({ error : "freet already liked" });
    } catch (error) {
        res.status(503).json({ error: "could not like freet" }).end();
    }
});

/**
 * UNLIKE a Freet
 * @name DELETE/api/freets/:id/likes
 * @param {number} :id - id of the freet
 * @returns {204} - confirms that freet is unliked. 
 * 
 * @throws {400} - freet id is invalid, NaN, or undefined
 * @throws {401} - if user is not signed in
 * @throws {404} - freet does not exist
 * @throws {409} - freet is already unliked
 */
router.delete('/:id?/likes', async (req, res) => {
    if (!signedIn(req, res) 
     || !correctInput(req, res, [], ['id'])
     || !isID(res,req.params.id)
     || !(await dataExists(res, req.params.id, Freets))) return;

    try {
        let unliked = await Freets.unlike(req.session.user.id, req.params.id);
        if (unliked) res.status(204).end();
        else res.status(409).send({ error : "freet already unliked" });
    } catch (error) {
        res.status(503).json({ error: "could not unlike freet" }).end();
    }
});

/**
 * REFREET a Freet
 * @name POST/api/freets/:id/refreets
 * @param {number} :id - id of the freet
 * @body {string} content - (OPTIONAL) content of the Freet 
 * @return {Freet} - the created Freet
 * 
 * @throws {201} - refreet is created
 * @throws {400} - freet id is invalid, NaN, or undefined
 * @throws {401} - if user is not signed in
 * @throws {409} - freet already refreeted
 * @throws {404} - freet does not exist
 */
router.post('/:id?/refreets', async (req, res) => {
    if (!signedIn(req, res) 
     || !correctInput(req, res, [], ['id'])
     || !isID(res,req.params.id)
     || !(await dataExists(res, req.params.id, Freets))) return;

    try {
        let refreet = await Freets.create(req.session.user.id, req.body.content, Number(req.params.id));
        if (refreet) res.status(201).send(refreet);
        else res.status(409).json({ error: "freet already refreeted" }).end();
    } catch (error) {
        res.status(503).json({ error: "could not create refreet" }).end();
    }
});


// NEW A5 ROUTES ______________________________________________

/**
 * gets refreets of 
 * @name GET/api/freets/:id/refreets
 * @param {number} :id - id of the freet
 * @return {Freet[]} - the created Freet
 * 
 * @throws {400} - freet id is invalid, NaN, or undefined
 * @throws {401} - if user is not signed in
 * @throws {409} - freet already refreeted
 * @throws {404} - freet does not exist
 */
router.get('/:id?/refreets', async (req, res) => {
  if (!correctInput(req, res,[],['id'])
  || !isID(res,req.params.id)
  || !(await dataExists(res, req.params.id, Freets))) return;

 try {
     let freets = await Freets.getByParent(req.params.id);
     res.status(200).send( {refreets : freets.length, freets} );
 } catch (error) {
     res.status(503).json({ error: "could not get freets" }).end();
 }  
});

module.exports = router;