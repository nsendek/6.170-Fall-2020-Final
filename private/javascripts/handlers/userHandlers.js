/**
 * calls @name GET/api/user
 */
function viewUsers() {
    axios.get('/api/user')
    .then(showResponse) 
    .catch(showResponse);
}

/**
 * calls @name POST/api/user
 */ 
function createUser(fields) {
  axios.post('/api/user', fields)
      .then(showResponse) 
      .catch(showResponse);
}

/**
 * calls @name PATCH/api/user with @param username
 */
function changeUsername(fields) { 
  axios.patch('/api/user', fields)
    .then(showResponse) 
    .catch(showResponse);
}

/**
 * calls @name PATCH/api/user rwith @param password
 */
function changePassword(fields) {
  axios.patch('/api/user', fields)
    .then(showResponse) 
    .catch(showResponse); 
}

/**
 * calls @name DELETE/api/user
 */
function deleteUser(fields) {
  axios.delete('/api/user', fields)    
    .then(showResponse)
    .catch(showResponse); 
}

const userHandlers = {
  'view-all-users': viewUsers,
  'create-user': createUser,
  'delete-user': deleteUser,
  'change-username': changeUsername,
  'change-password': changePassword,
}