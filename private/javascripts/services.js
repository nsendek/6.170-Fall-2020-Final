// Show an object on the screen.
function showObject(obj) {
  const pre = document.getElementById('response');
  const preParent = pre.parentElement;
  pre.innerText = JSON.stringify(obj, null, 4);
  preParent.classList.add('flashing');
  setTimeout(() => preParent.classList.remove('flashing'), 300);
}

// Axios responses have a lot of data. This shows only the most relevant data.
function showResponse(axiosResponse) {
  const fullResponse = axiosResponse.response === undefined
    ? axiosResponse
    : axiosResponse.response;
  const abridgedResponse = {
    data: fullResponse.data,
    status: fullResponse.status,
    statusText: fullResponse.statusText,
  };
  showObject(abridgedResponse);
}

function updateOperations(label) {
  if (label == "business") 
    $("#opHeader").text("Business Operations");
  else if (label == "user")
    $("#opHeader").text("User Operations");
  else if (label == "review")
    $("#opHeader").text("Review Operations");
  else if (label == "badge")
    $("#opHeader").text("Badge Operations");
  

  $('.operations').each(function( i, val ) {
    if ($( this ).attr( "id" ) == label) {
      $( this ).show()
    } else {
      $( this ).hide()
    }
  });
}

const formsAndHandlers = {
  ...businessHandlers,
  ...userHandlers,
  ...sessionHandlers,
  ...reviewHandlers,
  ...badgeHandlers
}

// attach handlers to forms
function init() {
  Object.entries(formsAndHandlers).forEach(([formID, handler]) => {
    const form = document.getElementById(formID);
    if (form)
      form.onsubmit = (e) => {
        e.preventDefault();
        const data = {};
        (new FormData(form)).forEach((value, key) => {
          data[key] = value;
        });
        handler(data);
        return false; // don't reload page
      };
  });
}

window.onload = init; // attach handlers once DOM is ready