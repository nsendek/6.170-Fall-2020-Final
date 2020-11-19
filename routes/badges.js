const router = require('express').Router();
const Badges = require('../models/Badges');
const Businesses = require('../models/Businesses');
const { signedIn, correctInput , isID , dataExists } = require('./validators');


/**
 * Get all badges associated with a business
 * @name GET/api/badge/:businessId?
 * @param businessID - the id of the business being queried
 * 
 * @throws {200} - If business does exist and badges retrieved successfully
 * @throws {404} - if business does not exist
 */
router.get('/:businessId?', async (req, res) => {
    try{
        if (req.params.businessId) {
            if (!(dataExists(res, req.params.businessId, Businesses))) {
                return;
            }
            let badges = await Badges.getBusinessBadges(req.params.businessId);
            if (badges) {
                let labels = []
                badges.forEach((badgeObject)=> labels.push(badgeObject.label));
                res.status(200).send(labels);
            }
        } else {
            let badges = await Badges.getAllBadges();
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
 * @name GET/api/badge/filter/:badgeName
 * @param badgeNames - the name of the badge being querired
 * @throws {200} - if the badge exists
 * @throws {404} - if the badge does not exist
 */
router.get('/filter/:badgeName', async (req, res) => {
    try{
        if (req.params.badgeName) {
            let businessesWithBadge = await Badges.filterBusinessByBadge(req.params.badgeName)
            .catch((err) => {
                console.log("error @ filter route!", err);
            })
            if (businessesWithBadge) {
                res.status(200).send(businessesWithBadge);
            }
        }  
    }
    catch (error) {
        res.status(503).json({ error: "could not fetch businesses with this badge"}).end();    
    }
});




 module.exports = router;