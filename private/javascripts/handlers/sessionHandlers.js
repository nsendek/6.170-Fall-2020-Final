/**
 * calls @name POST/api/session
 */
function signIn(fields) {
  axios.post('/api/user/signin', fields)
  .then(showResponse)
  .catch(showResponse); 
}

/**
 * calls @name DELETE/api/session
 */
function signOut(fields) {
  axios.post('/api/user/signout', fields)
  .then(showResponse)
  .catch(showResponse); 
}

/**
 * calls @name GET/api/session
 */
function getSession() {
  axios.get('/api/session')
  .then(showResponse)
  .catch(showResponse);  
}

/**
 * calls @name POST/api/session
 */
function signInBusiness(fields) {
  axios.post('/api/business/signin', fields)
  .then(showResponse)
  .catch(showResponse); 
}

/**
 * calls @name DELETE/api/session/business
 */
function signOutBusiness(fields) {
  axios.post('/api/business/signout', fields)
  .then(showResponse)
  .catch(showResponse); 
}


const sessionHandlers = {
  'sign-in': signIn,
  'sign-out': signOut,
  'sign-in-business': signInBusiness,
  'sign-out-business': signOutBusiness,
  'get-session' : getSession
}