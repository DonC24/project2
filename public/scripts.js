console.log('in scripts.js');

console.log(myVar);

window.onload = () => {

    Notification.requestPermission().then(function(result) {
      console.log(result);
    });

    //const myVar; // 1 day in milliseconds
    const notificationTimer = localStorage.getItem('notificationTimer');
    if(notificationTimer){
        const sendNotification = (Date.now() - (new Date(notificationTimer)).getTime()) > myVar;
        if(sendNotification){
            const notification = new Notification('Displaying reminder to take your meds');
        }
    }

};