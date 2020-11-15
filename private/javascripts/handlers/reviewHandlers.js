/**
 * calls @name GET/api/review
 */
function viewAllReviews(fields) {
  axios.get('/api/review', fields)  
    .then(showResponse) 
    .catch(showResponse); 
}

/**
 * calls @name GET/api/review/author/:id
 */
function viewReviewsByAuthor(fields) {
  axios.get(`/api/review/author/${fields.author}`)  
    .then(showResponse)
    .catch(showResponse);
}

/**
 * calls @name POST/api/review
 */
function createReview(fields) {
  axios.post(`/api/review`, fields)  
    .then(showResponse)
    .catch(showResponse);
}

/**
 * calls @name PATCH/api/review/:id
 */
function editReview(fields) {
  axios.patch(`/api/review/${fields.id}`, fields)
    .then(showResponse)
    .catch(showResponse);
}

/**
 * calls @name DELETE/api/review/:id
 */
function deleteReview(fields) {
  axios.delete(`/api/review/${fields.id}`)
    .then(showResponse)
    .catch(showResponse);
}

/**
 * calls @name POST/api/review/:id/likes OR @name DELETE/api/review/:id/likes
 */
function toggleLikes(fields) {
  if (fields.type === "like" ) 
    axios.post(`/api/review/${fields.id}/likes`)
      .then(showResponse)
      .catch(showResponse);
  
  if (fields.type === "unlike" ) 
    axios.delete(`/api/review/${fields.id}/likes`)
      .then(showResponse)
      .catch(showResponse);
}

/**
 * calls @name GET/api/review/:id/likes
 */
function getReviewLikes(fields) {
  axios.get(`/api/review/${fields.id}/likes`)
    .then(showResponse)
    .catch(showResponse);
}

const reviewHandlers = {
  'view-all-reviews': viewAllReviews,
  'view-reviews-by-author': viewReviewsByAuthor,
  'create-review': createReview,
  'edit-review': editReview,
  'delete-review': deleteReview,
  'toggle-likes': toggleLikes,
  'get-likes': getReviewLikes,
}