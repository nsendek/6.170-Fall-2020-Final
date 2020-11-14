const Freets = require("../models/Freets");
const Users = require("../models/Users");
const Businesses = require("../models/Businesses");

/**
 * takes request and response variables and returns whether user is signed in.
 * it also throws the needed status code if not signed in. 
 * 
 * @throws {401} user is not signed in and not allowed to run certain function.
 * @returns {boolean} determining whether the user is signed in or not. 
 */
function signedIn(req, res, user = true) {
  if (user) { // user signin check
    if (!req.session.user) {
      res.status(401).send({ error: 'you are not signed in.' });
      return false;
    }
    return true;
  } else {
    if (!req.session.business) {
      res.status(401).send({ error: 'you are not signed in.' });
      return false;
    }
    return true;      
  }
}

/**
 * takes id and checks that it is a valid type of id. 
 * @param {number} id
 * @returns {boolean} whether id is a valid.
 * @throws {400} id is not a valid one (basically just needs to be a number)
 */
function isID(res, id) {
    if (isNaN(id)) {
        res.status(400).send({ error: 'invalid ID' });
    }
    return !isNaN(id);
}

/**
 * takes id and checks that it is a valid type of id. 
 * @param {number} id
 * @param {Freets | Users} Model is either the model for Freets or Users. both have an exists() method.
 * @param {Number | String} identifier - identies the object being searched, either a Number id or string username
 * @returns {Boolean} whether id is asociated with an existing Model object.
 * @throws {404} id is not asociated with an existing Model object.
 */
async function dataExists(res, identifier, Model) {
    if (!(await Model.exists(identifier)))  {
        if (Model == Freets) 
            res.status(404).send({ error : "freet does not exist" });
        else if (Model == Users) 
            res.status(404).send({ error : "user does not exist" });
        else if (Model == Businesses) 
            res.status(404).send({ error : "business does not exist" });

        return false;
    }
    return true;
}

/**
 * Takes the list of expected variables and checks to make sure the request has them. 
 * @param {idk} req request body 
 * @param {idk} res response body 
 * @param {string[]} body - the expected request body variables
 * @param {string[]} params - the expected request parameters variables
 * @param {string[]} query - the expected request query variables 
 * 
 * @throws {400} if there are missing required request variables
 */
function correctInput(req, res, body = [], params = [], query = [] ) {
    let correct = true;
    let returnString = "";

    body.forEach( variable => {
        if (!req.body[variable]) {
            correct = false;
            returnString += `body.${variable},`;
        }
    });
    params.forEach( variable => {
        if (!req.params[variable]) {
            correct = false;
            returnString += `params.${variable},`;
        }
    });
    query.forEach( variable => {
        if (!req.query[variable]) {
            correct = false;
            returnString += `query.${variable},`;
        }
    });

    if (!correct) res.status(400).send({ error : `missing request variables: ${returnString}` }); 

    return correct;
}
  
module.exports = {
    signedIn,
    correctInput,
    isID,
    dataExists
}