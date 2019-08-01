console.log('in scripts.js');

console.log("myVar " + myVar);
console.log("userId: " + userId);

let confirmEat = function(){
    var outputs = document.querySelectorAll('.output');
    console.log("userId in confirmEat " + userId);
    console.log("outputs");
    console.log(outputs);
    //append button to output
    var confirmBtn = document.createElement('button');
    confirmBtn.innerHTML = "Confirm Medication has been taken";
    outputs[0].appendChild(confirmBtn);

    confirmBtn.addEventListener('click', doRequest());

};

var doRequest = function(){

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
    request.open("POST", "http://localhost:3000/meds/" + userId + "?_method=PUT");

    // send the request
    request.send();
};

window.onload = () => {

    Notification.requestPermission().then(function(result) {
      console.log(result);
    });

    console.log("userId in script.js: " + userId);


    let spawnNotification = function(title,theBody,shouldRequireInteraction) {
        var options = {
            title: "MedTrack Notification",
            body: "Reminder to take your medication!",
            requireInteraction: true
        }
        var n = new Notification(title, options);
    }



    setTimeout(spawnNotification, myVar);
    setTimeout(confirmEat, myVar);

/*    notification.onclick = function(event){
        alert('WOW CLICKED');
        var studentId = input.value;

        doRequest( studentId );
    };
*/




/*    self.registration.showNotification("Take your medicine!", {
        actions: [
            {
                action: 'confirm',
                title: 'Taken medicine'
            },
            {
                action: 'Snooze',
                title: 'Snooze'
            }
        ]
    });

    self.addEventListener('notificationclick', function(event) {
        event.notification.close();
        if (event.action === 'Taken') {
            // Archive action was clicked
            console.log('medicine was taken');
            //archiveEmail();
        } else {
            // Main body of notification was clicked
            //clients.openWindow('/inbox');
            console.log('snooze. need to resend notification');
        }
    }, false);*/

    //const myVar; // 1 day in milliseconds
    /*const notificationTimer = localStorage.getItem('notificationTimer');
    if(notificationTimer){
        const sendNotification = (Date.now() - (new Date(notificationTimer)).getTime()) > myVar;
        if(sendNotification){
            const notification = new Notification('Displaying reminder to take your meds');
        }
    }*/

};





/*var button = document.querySelector('#hello');

button.addEventListener('click', function(event){
  alert('WOW CLICKED');
  var input = document.querySelector('#studentId');
  var studentId = input.value;

  doRequest( studentId );
});

var doRequest = function(studentId){

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
  // request.open("GET", "https://swapi.co/api/people/1");
  request.open("GET", "http://localhost:3000/students/"+studentId);

  // send the request
  request.send();


};*/