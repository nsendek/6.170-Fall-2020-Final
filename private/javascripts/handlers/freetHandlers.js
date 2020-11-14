
/**
 * calls @name GET/api/freets
 */
function viewAllFreets(fields) {
    axios.get('/api/freets', fields)  
      .then(showResponse) 
      .catch(showResponse); 
  }
  
  /**
   * calls @name GET/api/freets/user/:id
   */
  function viewFreetsByAuthor(fields) {
    axios.get(`/api/freets/user/${fields.author}`)  
      .then(showResponse)
      .catch(showResponse);
  }
  
  /**
   * calls @name POST/api/freets
   */
  function createFreet(fields) {
    axios.post(`/api/freets`, fields)  
      .then(showResponse)
      .catch(showResponse);
  }
  
  /**
   * calls @name PATCH/api/freets/:id
   */
  function editFreet(fields) {
    axios.patch(`/api/freets/${fields.id}`, fields)  
      .then(showResponse)
      .catch(showResponse);
  }
  
  /**
   * calls @name DELETE/api/freets/:id
   */
  function deleteFreet(fields) {
    axios.delete(`/api/freets/${fields.id}`)  
      .then(showResponse)
      .catch(showResponse);
  }

  /**
   * calls @name POST/api/freets/:id/likes OR @name DELETE/api/freets/:id/likes
   */
  function toggleLikes(fields) {
    if (fields.type === "like" ) 
      axios.post(`/api/freets/${fields.id}/likes`)
        .then(showResponse)
        .catch(showResponse);
    
    if (fields.type === "unlike" ) 
      axios.delete(`/api/freets/${fields.id}/likes`)
        .then(showResponse)
        .catch(showResponse);
  }
  
  /**
   * calls @name GET/api/freets/:id/likes
   */
  function getFreetLikes(fields) {
    axios.get(`/api/freets/${fields.id}/likes`)
      .then(showResponse)
      .catch(showResponse);
  }
  
  /**
   * calls @name POST/api/freets/:id/refreets
   */
  function refreetFreet(fields) {
    axios.post(`/api/freets/${fields.id}/refreets`, fields)
      .then(showResponse)
      .catch(showResponse);
  }


const freetHandlers = {
    'view-all-freets': viewAllFreets,
    'view-freets-by-author': viewFreetsByAuthor,
    'create-freet': createFreet,
    'edit-freet': editFreet,
    'delete-freet': deleteFreet,

    'toggle-likes': toggleLikes,
    'get-likes': getFreetLikes,
    'refreet': refreetFreet,
}