const router = require('express').Router();
const Badges = require('../models/Badges');
const Businesses = require('../models/Businesses');
const { signedIn, correctInput , isID , dataExists } = require('./validators');





/**
 * Get all badges associated with a business
 * @name GET/api/badge/:businessId
 * @param businessID - the id of the business being queried
 * 
 * @throws {200} - If business does exist and badges retrieved successfully
 * @throws {404} - if business does not exist
 */
router.get('/:businessId', async (req, res) => {
    if (!(dataExists(res, req.params.businessId, Businesses))) {
        return;
    }
    let badges = await Badges.getBusinessBadges(req.params.businessId);
    if (badges) {
        let labels = []
        badges.forEach((badgeObject)=> labels.push(badgeObject.label));
        res.status(200).send(labels);
    }

});


 module.exports = router;