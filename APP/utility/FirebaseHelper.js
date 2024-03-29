import { getMessaging } from 'firebase-admin/messaging';

// Function to send a notification
export async function sendNotification(token, title, body) {
    try {
        const message = {
            notification: {
                title: title,
                body: body
            },
            token: token
        };

        // Send a message to the device corresponding to the provided
        // registration token.
        getMessaging().send(message)
            .then((response) => {
                // Response is a message ID string.
                console.log('Successfully sent message:', response);
            })
            .catch((error) => {
                console.log('Error sending message:', error);
            });
        return response;
    } catch (error) {
        console.error('Error sending notification:', error);
        throw error;
    }


}

