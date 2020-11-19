function getBadgeTemplates() {
  axios.get(`/api/badge/templates`)
    .then(showResponse)
    .catch(showResponse);
}

function getBusinessesByBadge(fields) {
  axios.get(`/api/business/badge/${fields.template}`)
    .then(showResponse)
    .catch(showResponse);
}

function getBadgesOfBusiness(fields) {
  axios.get(`/api/business/${fields.id}/badge`)
    .then(showResponse)
    .catch(showResponse);
}

function addBadge(fields) {
  axios.post(`/api/badge`,fields)
    .then(showResponse)
    .catch(showResponse);
}

function removeBadge(fields) {
  axios.delete(`/api/badge/${fields.id}`,fields)
    .then(showResponse)
    .catch(showResponse);
}

function denyBadge(fields) {
    axios.post(`/api/badge/${fields.id}/deny`)
      .then(showResponse)
      .catch(showResponse);
}

function affirmBadge(fields) {
  axios.post(`/api/badge/${fields.id}/affirm`)
    .then(showResponse)
    .catch(showResponse);
}

const badgeHandlers = {
  'get-templates': getBadgeTemplates,
  'get-businesses-badge': getBusinessesByBadge,
  'get-badges-business': getBadgesOfBusiness,
  'add-badge': addBadge,
  'remove-badge': removeBadge,
  'deny-badge' : denyBadge,
  'affirm-badge' : affirmBadge,
}