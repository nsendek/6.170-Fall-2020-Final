  /**
   * calls @name GET/api/business
   */
  function viewBusinesses() {
    axios.get('/api/business')
    .then(showResponse) 
    .catch(showResponse);
}

/**
 * calls @name POST/api/business
 */ 
function createBusiness(fields) {
  axios.post('/api/business', fields)
      .then(showResponse) 
      .catch(showResponse);
}

/**
 * calls @name DELETE/api/business
 */
function deleteBusiness(fields) {
  axios.delete(`/api/business`, fields)    
    .then(showResponse)
    .catch(showResponse); 
}

/**
 * calls @name PATCH/api/business with @param username
 */
function changeBusinessName(fields) { 
  axios.patch(`/api/business`, fields)
    .then(showResponse) 
    .catch(showResponse);
}

/**
 * calls @name PATCH/api/business rwith @param password
 */
function changeBusinessPassword(fields) {
  axios.patch(`/api/business`, fields)
    .then(showResponse) 
    .catch(showResponse); 
}

const businessHandlers = {
  'view-all-businesses': viewBusinesses,
  'create-business': createBusiness,
  'delete-business': deleteBusiness,
  'change-business-name': changeBusinessName,
  'change-business-password': changeBusinessPassword,
}