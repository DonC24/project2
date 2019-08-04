console.log('in scripts.js');

console.log("myVar " + myVar);
console.log("userId: " + userId);

var confirmBtn = document.getElementById("confirmBtn");
confirmBtn.style.display = "none";


let confirmEat = function(){
    confirmBtn.style.display="inline-block";
};

/*var doRequest = function(){

    console.log("userId in doRequest " + userId);

    // what to do when we recieve the request
    var responseHandler = function() {
        console.log("response text", this.responseText);
        console.log("status text", this.statusText);
        console.log("status code", this.status);
    };

    // make a new request
    var request = new XMLHttpRequest();

    // listen for the request response
    request.addEventListener("load", responseHandler);

    // ready the system by calling open, and specifying the url
    request.open("POST", "/meds/updates/" + userId + "?_method=PUT");

    // send the request
    request.send();
};*/

/*var confirmReq = function(){

    console.log("userId in confirm request " + userId);

    // what to do when we recieve the request
    var responseHandler = function() {
        console.log("response text", this.responseText);
        console.log("status text", this.statusText);
        console.log("status code", this.status);
    };

    // make a new request
    var request = new XMLHttpRequest();

    // listen for the request response
    request.addEventListener("load", responseHandler);

    // ready the system by calling open, and specifying the url
    request.open("POST", "/meds/" + userId + "/confirm");

    // send the request
    request.send();
};*/

window.onload = () => {

    Notification.requestPermission().then(function(result) {
      console.log(result);
    });

    console.log("userId in script.js: " + userId);


    let spawnNotification = function(title,theBody,shouldRequireInteraction) {
        var title = "MedTracker Notification";
        var options = {
            body: "Reminder to take your medication!",
            requireInteraction: true
        }
        var n = new Notification(title, options);
    }

    //confirmBtn.addEventListener('click', function(){doRequest();});
    if (myVar === 'new'){
        console.log("myVar is null");
    } else {
        setTimeout(spawnNotification, myVar);
        setTimeout(confirmEat, myVar);
    }

};