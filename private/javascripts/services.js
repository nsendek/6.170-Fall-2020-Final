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
  console.log("CALLED", label);
  if (label == "business") {
    $("#opHeader").text("Business Operations");
    $("#business-operations").show();
    $("#user-operations").hide();
    $("#review-operations").hide();
  } else if (label == "user") {
    $("#opHeader").text("User Operations");
    $("#business-operations").hide();
    $("#user-operations").show();
    $("#review-operations").hide();
  } else if (label = "review") {
    $("#opHeader").text("Review Operations");
    $("#business-operations").hide();
    $("#user-operations").hide();
    $("#review-operations").show();  
  }
}

function signInChange(axiosResponse) {
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

function signOutChange(axiosResponse) {
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



const formsAndHandlers = {
  ...businessHandlers,
  ...userHandlers,
  ...sessionHandlers,
  ...reviewHandlers
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