/**
 * calls @name POST/api/session
 */
function signIn(fields) {
  axios.post('/api/session/user', fields)
  .then(showResponse)
  .catch(showResponse); 
}

/**
 * calls @name DELETE/api/session
 */
function signOut(fields) {
  axios.delete('/api/session/user', fields)
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
  axios.post('/api/session/business', fields)
  .then(showResponse)
  .catch(showResponse); 
}

/**
 * calls @name DELETE/api/session/business
 */
function signOutBusiness(fields) {
  axios.delete('/api/session/business', fields)
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