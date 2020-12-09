const router = require('express').Router();

/**
 * if page refreshes, confirm if still signed in on refresh
 * @name GET/api/session
 * @returns {User && Business}
 */
router.get('/', async (req, res) => {
  try {
    let business = req.session.business;
    let user = req.session.user;
    res.status(200).send({user, business});
  } catch (error) {
    res.status(503).send({ error: "could not check session" });
  }
});

module.exports = router;