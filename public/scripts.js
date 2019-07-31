console.log('in scripts.js');

console.log(myVar);

window.onload = () => {

    Notification.requestPermission().then(function(result) {
      console.log(result);
    });






    let spawnNotification = function(Notice,theBody,shouldRequireInteraction) {
        var options = {
            body: "This is a notification",
            requireInteraction: true
        }
        var n = new Notification(Notice, options);
    }

    setTimeout(spawnNotification, 2000);




    self.registration.showNotification("Take your medicine!", {
        actions: [
            {
                action: 'Confirm taken',
                title: 'Confirm'
            },
            {
                action: 'Snooze',
                title: 'Snooze'
            }
        ]
    });

    self.addEventListener('notificationclick', function(event) {
        event.notification.close();
        if (event.action === 'archive') {
            // Archive action was clicked
            archiveEmail();
        } else {
            // Main body of notification was clicked
            clients.openWindow('/inbox');
        }
    }, false);

    //const myVar; // 1 day in milliseconds
    /*const notificationTimer = localStorage.getItem('notificationTimer');
    if(notificationTimer){
        const sendNotification = (Date.now() - (new Date(notificationTimer)).getTime()) > myVar;
        if(sendNotification){
            const notification = new Notification('Displaying reminder to take your meds');
        }
    }*/

};