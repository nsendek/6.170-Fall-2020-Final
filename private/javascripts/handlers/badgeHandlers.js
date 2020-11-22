// OK
function getBadgeTemplates() {
  axios.get(`/api/badge`)
    .then(showResponse)
    .catch(showResponse);
}

// OK
function getBusinessesByBadge(fields) {
  axios.get(`/api/badge/filter`)
    .then(showResponse)
    .catch(showResponse);
}

// OK
function getBadgesOfBusiness(fields) {
  axios.get(`/api/business/${fields.id}/badges`)
    .then(showResponse)
    .catch(showResponse);
}

// OK
function addBadge(fields) {
  axios.post(`/api/badge`,fields)
    .then(showResponse)
    .catch(showResponse);
}

// OK
function removeBadge(fields) {
  axios.delete(`/api/badge/${fields.id}`,fields)
    .then(showResponse)
    .catch(showResponse);
}


function toggleAffirm(fields) {
  axios.post(`/api/badge/${fields.id}/affirm`)
    .then(showResponse)
    .catch(showResponse);

  axios.delete(`/api/badge/${fields.id}/affirm`)
    .then(showResponse)
    .catch(showResponse);
}

function toggleDeny(fields) {
  axios.post(`/api/badge/${fields.id}/deny`)
    .then(showResponse)
    .catch(showResponse);
 
  axios.delete(`/api/badge/${fields.id}/deny`)
    .then(showResponse)
    .catch(showResponse);
}

const badgeHandlers = {
  'get-templates': getBadgeTemplates,
  'get-businesses-badge': getBusinessesByBadge,
  'get-badges-business': getBadgesOfBusiness,
  'add-badge': addBadge,
  'remove-badge': removeBadge,
  'deny-badge' : toggleDeny,
  'affirm-badge' : toggleAffirm,
}