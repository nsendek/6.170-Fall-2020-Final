const router = require('express').Router();
const Businesses = require('../models/Businesses');
const Badges = require('../models/Badges');

const { signedIn, correctInput , isID , dataExists } = require('./validators');
const Reviews = require('../models/Reviews');

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
    if (!correctInput(req, res,['name', 'accountName', 'password'])) return;

    try {
      let business = await Businesses.create(req.body.name, req.body.accountName, req.body.password);
      if (business) {
        req.session.business = business;
        res.status(201).send({ business, message : "business created"});
      } else {
        res.status(409).json({ error: "account name taken" }).end();
      }
    } catch (error) {
        res.status(503).json({ error: "could not create business" }).end();
    }
  }
}); 

/**
 * edit information about the business. 
 * this can be used to change name, password, but NOT BOTH. 
 * @name PATCH/api/business/:property
 * 
 * @return {Business} - the altered business object (minus paassword,even if password was changed)
 * 
 * @throws {200} - if business is altered
 * @throws {400} - no name or password are invalid
 * @throws {401} - if business is not signed in 
 * @throws {409} - if new accountName is taken
 */
router.patch('/:property?', async (req, res) => { 
  if ( !signedIn(req, res) // need to be signed in to business
    || !correctInput(req, res,[],['property'])
    || !correctInput(req, res,[req.params.property])
  ) return;
    let patchMethod;
    switch (req.params.property){
      case 'accountName':
        patchMethod = Businesses.updateAccountName;
        break;
      case 'name':
        patchMethod = Businesses.updateName;
        break;
      case 'address':
        patchMethod = Businesses.updateAddress;
        break;
      case 'password':
        patchMethod = Businesses.updatePassword;
        break;
    }

    try {
      let updatedBusiness = await patchMethod(req.session.business.id, req.body[req.params.property]);
      if (updatedBusiness) {
        res.status(200).send(updatedBusiness);
        req.session.business = updatedBusiness;

      } else {
        switch(req.params.property) {
          case "accountName":
            res.status(409).send({ error: 'account name taken' });
            break;
          case "address":
            res.status(404).send({ error: 'address and geocode not found' });
            break;
          default:
            throw "oops";
        }
      }
    } catch (err) {
      res.status(503).send({ error : `could not update business` });
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
  if (!signedIn(req, res)
    || !(await dataExists(res, req.session.business.id, Businesses))) return;

  try {
    let deleted = await Businesses.delete(req.session.business.id);
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
      if (!correctInput(req, res,[],['id'])
      || !isID(res,req.params.id)
      || !(await dataExists(res, req.params.id, Businesses))) return;

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
    res.status(503).send({ error: "could not get businesses" });
  }
});

/**
 * @name GET/api/business/account/:accountName
 * @returns {Business} - Business associated with accountName
 */
router.get('/account/:accountName', async (req, res) => {
  try {
    if (req.params.accountName && Businesses.exists(req.params.accountName)) {
      let businessID = await Businesses.getIDFromAccount(req.params.accountName);
      if (businessID) {
        res.status(200).send(businessID);
      }
    } 
    else {
      res.status(404).send({error: "There are no businesses associated with this account"});
    }
  } catch (error) {
    res.status(503).send({ error: "could not get businesses associated with this account" });
  }
});

// BADGE & REVIEW RELATED ROUTES -----------------------------------------------

/**
 * get badges that belong to a specified business
 * @name GET/api/business/:id/badges
 * @returns {User[]} Array of all businesss 
 */
router.get('/:id/badges', async (req, res) => {
  if (!correctInput(req, res,[],['id'])
  || !isID(res,req.params.id)
  || !(await dataExists(res, req.params.id, Businesses))) return;
  try {
    let badges = await Badges.getBusinessBadges(req.params.id)
    res.status(200).send(badges);
  } catch (error) {
    res.status(503).send({ error: "could not get badges" });
  }
});

/**
 * get badges that belong to a specified business
 * @name GET/api/business/:id/badges
 * @returns {User[]} Array of all businesss 
 */
router.get('/:id/reviews', async (req, res) => {
  if (!correctInput(req, res,[],['id'])
  || !isID(res,req.params.id)
  || !(await dataExists(res, req.params.id, Businesses))) return;
  try {
    let badges = await Reviews.getByBusiness(req.params.id)
    res.status(200).send(badges);
  } catch (error) {
    res.status(503).send({ error: "could not get badges" });
  }
});

module.exports = router;