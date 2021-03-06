const router = require('express').Router();
const Businesses = require('../models/Businesses');
const Reviews = require('../models/Reviews');
const Users = require('../models/Users');

const { signedIn, correctInput , isID , dataExists} = require('./validators');


/**
 * Get all Review posted if ID is given return single Review
 * @name GET/api/review
 * @param {number} id - the id of the review.
 * @return {Review[]} - the created short
 */
router.get('/:id?', async (req, res) => {
  
    try {

    if (req.params.id) {
      if (!isID(res,req.params.id)) return;
      let review = await Reviews.get(req.params.id);
      if (review) {
        res.status(200).send(review);
      } else {
        res.status(404).send({error: "review does not exist"});
      }
    } else {
      res.status(200).send(await Reviews.getAll());
    }
      
    } catch (error) {
    res.status(503).json({ error: "could not get reviews" }).end();
  }
 });

/**
 * Get all Reviews from a specific user.  
 * @name GET/api/review/author/:id
 * @param {number} id - the id of the user.
 * @return {Review[]} - all Reviews made by user
 * 
 * @throws {404} - if user does not exist
 * @throws {400} - user id is invalid, NaN, or undefined
 */
router.get('/author/:id?', async (req, res) => {
    if (!correctInput(req, res,[],['id'])
     || !isID(res,req.params.id)
     || !(await dataExists(res, req.params.id, Users))) return;

    try {
        let data = await Reviews.getByUser(req.params.id);
        res.status(200).send( data );
    } catch (error) {
        res.status(503).json({ error: "could not get reviews" }).end();
    }
 });

 /**
  * Get Review from a specific user for a specific business
  * @name GET/api/review/:businessID/author
  * @param {number} businessID - the id of the business
  * @return {Review[]} - review made by user for business
  * 
  * @throws {404} - if user or business does not exist
  * @throws {400} - user id or business id is invalid, NaN, or undefined
  */
 router.get('/:businessID/author', async (req, res) => {
    // TODO this is not the best formatting
    try {
        let data = await Reviews.getByUserAndBusiness(req.session.user.id, req.params.businessID); 
        res.status(200).send( data );
    }
    catch (error) {
        res.status(503).json({ error: "could not get reviews" }).end();
    }
 })

 /**
 * Create a Review
 * @name POST/api/reviews
 * @param {string} content - content of the Review 
 * @return {Review} - the created Review
 * 
 * @throws {201} review is created
 * @throws {401} - if user is not signed in
 * @throws {400} - if review is too long or not given
 */
router.post('/', async (req, res) => {
    if (!signedIn(req, res) 
     || !correctInput(req, res, ['businessId','rating','content'])
     || !(await dataExists(res, req.body.businessId, Businesses))) return;

    if (req.body.rating > 5 || req.body.rating < 1) {
      res.status(400).send({ error : "rating must be within 1-5" });
      return;
    }

    try {
        let review = await Reviews.create(
            req.session.user.id, 
            req.body.businessId,
            req.body.rating,
            req.body.content
          );
        if (review) res.status(201).send({message : "review submitted"});
        else res.status(409).send({ error : "a review already exists" });

    } catch (error) {
        res.status(503).send({ error: "could not create review" });
    }
});

 /**
 * Edit a Review
 * @name PATCH/api/review/:id
 * @param {number} :id - id of the review
 * @body {string} content - new content of the Review 
 * @return {Review} the updated Review
 * 
 * @throws {400} - review id is invalid, NaN, or undefined
 * @throws {401} - if user is not signed in
 * @throws {403} - review does not belong to user
 * @throws {404} - if review does not exist
 */
router.patch('/:id?', async (req, res) => {
    if (!signedIn(req, res) 
     || !correctInput(req, res, ['rating', 'content'])
     || !isID(res,req.params.id)
     || !(await dataExists(res, req.params.id, Reviews))) return;

    try {
        let owner = await Reviews.authenticate(req.session.user.id, req.params.id);
        if (owner) {
            let updated = await Reviews.update(req.params.id, req.body.rating, req.body.content);
            res.status(200).send(updated);  
        } else {
            res.status(403).json({ error : "review not associated with user" }).end();
        }
    } catch (error) {
        res.status(503).json({ error: "could not edit review" }).end();
    }
});

/**
 * delete specified Review 
 * @name DELETE/api/reviews/:id
 * @param {number} :id - id of the review
 * @return {Review} the updated Review
 * 
 * @throws {400} - review id is invalid, NaN, or undefined
 * @throws {401} - if user is not signed in
 * @throws {403} - review does not belong to the signed in user
 * @throws {404} - review does not exist
 */
router.delete('/:id?', async (req, res, next) => {
    // its an empty response put in DELET/api/:id?/likes pass forward
    if (req.params.id == "likes") {next();  return;} 

    if (!signedIn(req, res) 
     || !correctInput(req, res, [], ['id'])
     || !isID(res,req.params.id)
     || !(await dataExists(res, req.params.id, Reviews))) return;

    try {
        let owner = await Reviews.authenticate(req.session.user.id, req.params.id)
        if (owner) {
            let deleted = await Reviews.delete(req.params.id);
            res.status(200).send(deleted);
        } else {
            res.status(403).json({ error : "review not associated with user" }).end();
        }
    } catch (error) {
        res.status(503).json({ error: "could not delete review" }).end();
    }
});

// NEW A3 ROUTES ______________________________________________

/**
 * get likes of Review
 * @name GET/api/reviews/:id/likes
 * @param {number} :id - id of the review
 * @returns {number} - total number of likes for the review
 * @returns {User[]} - array of Users that liked the review
 * 
 * @throws {400} - review id is invalid, NaN, or undefined
 * @throws {404} - review does not exist
 */
router.get('/:id/likes', async (req, res) => {
    if (!correctInput(req, res, [], ['id'])
     || !isID(res,req.params.id)
     || !(await dataExists(res, req.params.id, Reviews))) return;

    try {
        let users = await Reviews.getLikes(req.params.id);
        res.status(200).send({ likes : users.length , users });
    } catch (error) {
        res.status(503).json({ error: "could not get likes" }).end();
    }
});

/**
 * LIKE a Review
 * @name POST/api/reviews/:id/likes
 * @param {number} :id - id of the review
 * @returns {204} - confirms that review is liked.
 * 
 * @throws {400} - review id is invalid, NaN
 * @throws {401} - if user is not signed in
 * @throws {404} - review does not exist
 * @throws {409} - review is already liked
 */
router.post('/:id/likes', async (req, res) => {
    if (!signedIn(req, res) 
     || !correctInput(req, res, [], ['id'])
     || !isID(res,req.params.id)
     || !(await dataExists(res, req.params.id, Reviews))) return;

    try {
        let liked  = await Reviews.like(req.session.user.id, req.params.id);
        if (liked) res.status(204).end();
        else res.status(409).send({ error : "review already liked" });
    } catch (error) {
        res.status(503).json({ error: "could not like review" }).end();
    }
});

/**
 * UNLIKE a Review
 * @name DELETE/api/reviews/:id/likes
 * @param {number} :id - id of the review
 * @returns {204} - confirms that review is unliked. 
 * 
 * @throws {400} - review id is invalid, NaN, or undefined
 * @throws {401} - if user is not signed in
 * @throws {404} - review does not exist
 * @throws {409} - review is already unliked
 */
router.delete('/:id/likes', async (req, res) => {
    if (!signedIn(req, res) 
     || !correctInput(req, res, [], ['id'])
     || !isID(res,req.params.id)
     || !(await dataExists(res, req.params.id, Reviews))) return;

    try {
        let unliked = await Reviews.unlike(req.session.user.id, req.params.id);
        if (unliked) res.status(204).end();
        else res.status(409).send({ error : "review already unliked" });
    } catch (error) {
        res.status(503).json({ error: "could not unlike review" }).end();
    }
});

module.exports = router;