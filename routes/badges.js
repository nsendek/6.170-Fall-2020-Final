const router = require('express').Router();
const Businesses = require('../models/Businesses');
const { Badges , BadgeTemplates }  = require('../models/Badges');
const { signedIn, correctInput , isID , dataExists } = require('./validators');


 /**
 * Create a Review
 * @name POST/api/badge
 * @param {string} content - content of the Review 
 * @return {Badge} - the created Review
 * 
 * @throws {201} review is created
 * @throws {401} - if user is not signed in
 * @throws {400} - if review is too long or not given
 */
router.post('/', async (req, res) => {
  if (!signedIn(req, res, false) 
   || !correctInput(req, res, ['businessId','template'])) return; 

  try {
    if (!(await dataExists(res, req.body.template, BadgeTemplates))
      || !(await dataExists(res, req.body.businessId, Businesses))) return;

      let badge = await Badges.create(req.body.businessId, req.body.template);
      if (badge) res.status(201).send( badge );
      else res.status(400).send({ error : "business already has badge" });
      
  } catch (error) {
      res.status(503).send({ error: "could not create review" });
  }
});

router.get('/templates', async (req, res) => {
  try {
      let templates = await BadgeTemplates.getAll();
      if (templates) res.status(201).send( templates );
      else res.status(400).send({ error : "no templates found" });
      
  } catch (error) {
      res.status(503).send({ error: "could not find templates" });
  }
});


module.exports = router;