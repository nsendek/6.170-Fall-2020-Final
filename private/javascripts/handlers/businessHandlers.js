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
 * calls @name PATCH/api/business/name with @param name
 */
function changeBusinessName(fields) { 
  axios.patch(`/api/business/name`, fields)
    .then(showResponse) 
    .catch(showResponse);
}

/**
 * calls @name PATCH/api/business/account with @param accountName
 */
function changeBusinessAccountName(fields) { 
  axios.patch(`/api/business/accountName`, fields)
    .then(showResponse) 
    .catch(showResponse);
}

/**
 * calls @name PATCH/api/business/password rwith @param password
 */
function changeBusinessPassword(fields) {
  axios.patch(`/api/business/password`, fields)
    .then(showResponse) 
    .catch(showResponse); 
}

function changeBusinessAddress(fields) {
  axios.patch(`/api/business/address`, fields)
    .then(showResponse) 
    .catch(showResponse); 
}

const businessHandlers = {
  'view-all-businesses': viewBusinesses,
  'create-business': createBusiness,
  'delete-business': deleteBusiness,
  'change-business-name': changeBusinessName,
  'change-business-password': changeBusinessPassword,
  'change-business-account': changeBusinessAccountName,
  'change-business-address': changeBusinessAddress,
}