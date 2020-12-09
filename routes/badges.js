const router = require('express').Router();
const Badges = require('../models/Badges');
const Businesses = require('../models/Businesses');
const { signedIn, correctInput , isID , dataExists } = require('./validators');


/**
 * Get all available badges
 * @name GET/api/badge
 * @param businessID - the id of the business being queried
 * 
 * @throws {200} - If business does exist and badges retrieved successfully
 * @throws {404} - if business does not exist
 */
router.get('/', async (req, res) => {
    try{
      let badges = await Badges.getAll();
      if (badges) res.status(200).send(badges);
    }
    catch (error) {
        res.status(503).json({ error: "could not fetch badges"}).end();
    }
});

/**
 * Get all businesses associated with a badge
 * @name GET/api/badge/filter
 * @param badgeNames - the name of the badge being querired
 * @throws {200} - if the badge exists
 * @throws {404} - if the badge does not exist
 */
router.get('/filter', async (req, res) => {
  if (!correctInput(req, res, [],[],['badges'])) return; 
    try{
      let page = 1; 
      if (req.query.page) {
        page = req.query.page; 
      }
      let businessesWithBadge = await Badges.filterBusinessByBadges(req.query.badges, page)
      if (businessesWithBadge) {
        res.status(200).send(businessesWithBadge);
      } else {
        res.status(404).send({error: "could not get businesses"});
      }
    }
    catch (error) {
        res.status(503).json({ error: "could not fetch businesses with this badge"}).end();    
    }
});

 /**
 * Add a Badge to a Business
 * @name POST/api/badge
 * @return {Badge} - the created Badge Instance
 * 
 * @throws {201} Badge is added 
 * @throws {401} - if user is not signed in
 * @throws {400} - if review is too long or not given
 */
router.post('/', async (req, res) => {
  // console.log("body?:", req.body);
  if (!signedIn(req, res, false) 
   || !correctInput(req, res, ['label'])) return; 

  try {
    if (!(await dataExists(res, req.body.label, Badges))
      || !(await dataExists(res, req.session.business.id, Businesses))) return;

      let badge = await Badges.add(req.session.business.id, req.body.label);
      if (badge) res.status(201).send( badge );
      else res.status(400).send({ error : "business already has badge" });
      
  } catch (error) {
      res.status(503).send({ error: "could not add badge" });
  }
});

 /**
 * Remove a Badge from a Business
 * @name DELETE/api/badge/:id
 * @param {number} id - id of the badge
 * @return {Badge} - the removed Badge Instance
 * 
 * @throws {201} Badge is added 
 * @throws {401} - if user is not signed in
 * @throws {400} - if review is too long or not given
 */
router.delete('/:id?', async (req, res) => {
  if (!signedIn(req, res, false) 
  || !correctInput(req, res, [], ['id'])
  || !isID(res, req.params.id)) return; 

  try {
    let owner = await Badges.authenticate(req.session.business.id, req.params.id);
    
    if (owner) {
      let badge = await Badges.remove(req.params.id);
      if (badge) res.status(200).send( badge );
      else res.status(400).send({ error : "business does not have badge" });
    } else {
      res.status(400).send({ error : "business not associated with badge ID" });
    }
      
  } catch (error) {
      res.status(503).send({ error: "could not remove badge" });
  }
})

/** 
 * Get affirmation ratio of a badge
 * @name GET/api/badge/:badgeId/ratio
 * @param badgeId - the id of the badge
 */
router.get("/:badgeId/ratio", async (req, res) => {
  if (!correctInput(req, res, [], ['badgeId'])) return;
  try {

    res.status(200).send(await Badges.getStats(req.params.badgeId));
    
  } catch (error) {
    res.status(503).send({ error: "could not get badge affirmation ratio"});
  }
})

/**
 * Affirm a badge
 * @name POST/api/badge/affirm
 * @param badgeId - the id of the badge
 * @param userId - the id of the user
 */
router.post("/affirm", async (req, res) => {
  if (!signedIn(req, res) 
      || !correctInput(req, res, ['badgeId'])) return;
  // console.log("GOT HERE affirm")
  try {
    let affirm = Badges.affirm(req.session.user.id, req.body.badgeId);
    if (affirm) {
      res.status(200).send();
    }
  } catch (error) {
    res.status(503).send({ error: "could not affirm badge"});
  }
});

/**
 * Deny a badge
 * @name POST/api/badges/deny
 * @param badgeId - the id of the badge
 * @param userId - the id of the user
 */
router.post("/deny", async (req, res) => {
  if (!signedIn(req, res) 
      || !correctInput(req, res, ['badgeId'])) return;
  // console.log("GOT HERE deny")
  try {
    let deny = Badges.deny(req.session.user.id, req.body.badgeId);
    if (deny) {
      res.status(200).send();
    }
  } catch (error) {
    res.status(503).send({ error: "could not deny badge"});
  }
});

/**
 * Remove all affirms and denies for a business by a user
 * @name DELETE/api/badges/affirmations
 * @param businessId - the id of the business
 */
router.delete("/affirmations/:businessId?", async (req, res) => {
  try {
    let deleted = Badges.deleteAffirmations(req.session.user.id, req.params.businessId);
    if (deleted) {
      res.status(200).send();
    }
  } catch (error) {
    res.status(503).send({ error : error});
  }
}); 


 module.exports = router;