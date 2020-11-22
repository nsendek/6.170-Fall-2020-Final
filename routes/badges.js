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
        if (req.params.businessId) {
            //moved this to GET/api/business/:id/badges
            
            // if (!(dataExists(res, req.params.businessId, Businesses))) {
            //     return;
            // }
            // let badges = await Badges.getBusinessBadges(req.params.businessId);
            // if (badges) {
            //     let labels = []
            //     badges.forEach((badgeObject)=> labels.push(badgeObject.label));
            //     res.status(200).send(labels);
            // }
        } else {
            let badges = await Badges.getAll();
            if (badges) {
                res.status(200).send(badges);
            }
        }
    }
    catch (error) {
        res.status(503).json({ error: "could not fetch badges for this business"}).end();
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
      let businessesWithBadge = await Badges.filterBusinessByBadges(req.query.badges)
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
  if (!signedIn(req, res, false) 
   || !correctInput(req, res, ['template'])) return; 

  try {
    if (!(await dataExists(res, req.body.template, Badges))
      || !(await dataExists(res, req.session.business.id, Businesses))) return;

      let badge = await Badges.add(req.session.business.id, req.body.template);
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
  || !correctInput(req, res, [], ['id'])) return; 

  try {
    if (!(await dataExists(res, req.session.business.id, Businesses))) return;

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

 module.exports = router;