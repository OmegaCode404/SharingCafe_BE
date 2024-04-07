import { getMessaging } from 'firebase-admin/messaging';

// Function to send a notification
export async function sendNotification(token, title, body) {
  try {
    const message = {
      notification: {
        title: title,
        body: body,
      },
      token: token,
    };

    // Send a message to the device corresponding to the provided registration token.
    const response = await getMessaging().send(message);

    // Response is a message ID string.
    console.log('Successfully sent message:', response);

    return response;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}
export async function sendNotificationToMultipleDevices(tokens, title, body) {
  try {
    const messages = tokens.map((token) => ({
      notification: {
        title: title,
        body: body,
      },
      token: token,
    }));

    const responses = await getMessaging().sendAll(messages);

    responses.forEach((response, idx) => {
      if (response.success) {
        console.log(`Message ${idx + 1} sent successfully.`);
      } else {
        console.error(`Error sending message ${idx + 1}:`, response.error);
      }
    });

    return responses;
  } catch (error) {
    console.error('Error sending multicast message:', error);
    throw error;
  }
}
