/**
 * calls @name POST/api/session
 */
function signIn(fields) {
  axios.post('/api/session', fields)
    .then(signInChange) 
    .catch(showResponse);
}

/**
 * calls @name DELETE/api/session
 */
function signOut(fields) {
  axios.delete('/api/session', fields)
    .then(signOutChange) 
    .catch(showResponse); 
}

/**
 * calls @name GET/api/session
 */
function getSession() {
  axios.get('/api/session')
    .then(signOutChange) 
    .catch(showResponse); 
}

/**
 * calls @name POST/api/session
 */
function signInBusiness(fields) {
  axios.post('/api/session/business', fields)
    .then(signInChange) 
    .catch(showResponse);
}

/**
 * calls @name DELETE/api/session/business
 */
function signOutBusiness(fields) {
  axios.delete('/api/session/business', fields)
    .then(signInChange) 
    .catch(showResponse);
}


const sessionHandlers = {
  'sign-in': signIn,
  'sign-out': signOut,
  'sign-in-business': signInBusiness,
  'sign-out-business': signOutBusiness,
  'get-session' : getSession
}