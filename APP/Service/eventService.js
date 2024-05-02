import * as eventDAL from '../DAL/eventDAL.js';
import * as userDAL from '../DAL/userDAL.js';
import * as commonFunctions from '../common/CommonFunctions.js';
import * as firebaseHelper from '../utility/FirebaseHelper.js';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

export async function getEvents(title, date, page) {
  return await eventDAL.getEvents(title, date, page);
}

export async function getEvent(eventId) {
  return await eventDAL.getEvent(eventId);
}
export async function createEvent(dataObj) {
  const event_id = uuidv4();
  return await eventDAL.createEvent(event_id, dataObj);
}

export async function updateEvent(eventId, eventDetails) {
  const event = await getEvent(eventId);
  if (!event) throw new Error('Event Not Found !!!');
  return await eventDAL.updateEvent(eventId, eventDetails);
}

export async function deleteEvent(eventId) {
  const event = await getEvent(eventId);
  if (!event) throw new Error('Event not found !!!');
  return await eventDAL.deleteEvent(eventId);
}

export async function getNewEvents() {
  return await eventDAL.getNewEvents();
}

export async function getEventsByDate(date) {
  return await eventDAL.getEventsByDate(date);
}

export async function getEventsByName(dataObj) {
  return await eventDAL.getEventsByName(dataObj);
}

export async function getPopularEvents() {
  return await eventDAL.getPopularEvents();
}

export async function updateImage(fileData) {
  return await eventDAL.updateImage(fileData);
}

export async function getEventUrl(event_id) {
  const event = await getEvent(event_id);
  if (!event) throw new Error('Event not found !!!');
  else {
    return {
      url: `https://sharing-coffee-be-capstone-com.onrender.com/api/event/${event_id}`,
    };
  }
}

export async function getUserEvent(title, date, page) {
  return await eventDAL.getUserEvent(title, date, page);
}

export async function sendNotificationIfEventOccurToday() {
  const filePath = 'events.json';

  let events = [];
  let result;

  try {
    // Check if it's midnight and clear events.json if true
    const isMidnight = commonFunctions.isMidnightToFourAM();
    if (isMidnight) {
      console.log(`Clearing events.json`);
      fs.writeFileSync(filePath, '[]');
      console.log(`Events file ${filePath} cleared.`);
    } else {
      console.log('Not midnight yet!');
      const eventsData = fs.readFileSync(filePath, 'utf8');
      if (eventsData.trim()) {
        events = JSON.parse(eventsData);
      } else {
        console.log('Events file is empty.');
      }

      // Fetch events from database if file is empty or events array is empty
      if (events.length === 0) {
        console.log('Fetching events from database');
        // Simulating database fetch for demonstration
        // result = [
        //   {
        //     event_id: 1,
        //     time_of_event: '2024-04-06 17:15:00.000',
        //     title: 'TITLE',
        //     body: 'TESTBODy',
        //     user_token: [1, 2],
        //   },
        //   {
        //     event_id: 2,
        //     time_of_event: '2024-04-06 17:15:00.000',
        //     title: 'TITLE',
        //     body: 'TESTBODy',
        //     user_token: [1, 2],
        //   },
        //   {
        //     event_id: 3,
        //     time_of_event: '2024-04-06 17:15:00.000',
        //     title: 'TITLE',
        //     body: 'TESTBODy',
        //     user_token: [1, 2],
        //   },
        // ];
        result = await eventDAL.getEventOccurToday();
        if (result.length > 0) {
          console.log(`Fetched ${result.length} events from database`);
          fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
          events = result;
        }
      }
      console.log(`Events:`, events);
      // Process events
      for (const event of events) {
        console.log(`Processing event:`, event);
        const is30minTillTheEventOccur =
          commonFunctions.is30minTillTheEventOccur(event.time_of_event);
        console.log(`is30minTillTheEventOccur:`, is30minTillTheEventOccur);
        if (is30minTillTheEventOccur) {
          for (const token of event.user_token) {
            console.log(
              `Sending notification to token ${token} for event ${event.title} and event body ${event.body}`,
            );
            firebaseHelper.sendNotification(token, event.title, event.body);
          }
        }
      }
    }

    return events;
  } catch (error) {
    console.error('Error:', error);
  }
}

export async function joinEvent(event_id, userId) {
  const participation_id = uuidv4();
  const [event] = await eventDAL.getEvent(event_id);
  if (!event) throw new Error('Event not found !!!');
  const [userJoin] = await userDAL.getUserInfoById(userId);
  const [userHost] = await userDAL.getUserInfoById(event.organizer_id);
  const titleTo = `TÍNH NĂNG SỰ KIỆN`;
  const bodyTo = `Thông báo mới: Người dùng ${userJoin.user_name} đã tham gia vào một sự kiện của bạn. Số lượng người dùng đã được cập nhập 😘😘😘`;
  firebaseHelper.sendNotification(userHost.token_id, titleTo, bodyTo);
  return await eventDAL.joinEvent(participation_id, event_id, userId);
}

export async function leaveEvent(event_id, userId) {
  const event = await eventDAL.getEvent(event_id);
  if (!event) throw new Error('Event not found !!!');
  return await eventDAL.leaveEvent(event_id, userId);
}

export async function getEventParticipants(event_id) {
  return await eventDAL.getEventParticipants(event_id);
}
