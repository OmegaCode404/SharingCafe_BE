import * as eventService from '../Service/eventService.js';
import { SequelizeInstance } from '../utility/DbHelper.js';
import { v2 as cloudinary } from 'cloudinary';
export async function getEvents(req, res) {
  try {
    const title = req.query.title;
    const date = req.query.date;
    const page = req.query.page;
    const result = await eventService.getEvents(title, date, page);
    res.status(200).send(result);
    // response code ???
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

export async function getEvent(req, res) {
  try {
    const eventId = req.params.eventId;
    const result = await eventService.getEvent(eventId);
    res.status(200).send(result);
    // response code ???
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

export async function createEvent(req, res) {
  const t = await SequelizeInstance.transaction();
  try {
    const dataObj = req.body;
    const result = await eventService.createEvent(dataObj);
    res.status(200).send(result);
    t.commit();
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
    t.rollback();
  }
}

export async function updateEvent(req, res) {
  const t = await SequelizeInstance.transaction();
    try{
        const eventId = req.params.eventId;
        const eventDetails = req.body;
        const event = await eventService.updateEvent(
            eventId,
            eventDetails
        );
        res.status(200).send(event);
        await t.commit();
    } catch (error){
        await t.rollback();
        console.log(error);
        res.status(404).send(error);
    }
}

export async function deleteEvent(req, res) {
  const t = await SequelizeInstance.transaction();
  try {
    const eventId = req.params.eventId;
    const event = await eventService.deleteEvent(eventId);
    res.status(200).send({ event });
    await t.commit();
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(404).send(error);
  }
}

export async function getNewEvents(req, res) {
  try {
    const result = await eventService.getNewEvents();
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

export async function getEventsByDate(req, res) {
  try {
    const date = req.body;
    const result = await eventService.getEventsByDate(date);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

export async function getEventsByName(req, res) {
  try {
    // const title = req.params.title;
    // const date = req.params.date;
    const dataObj = req.body;
    const result = await eventService.getEventsByName(dataObj);
    res.status(200).send(result);
    // response code ???
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

export async function getPopularEvents(req, res) {
  try {
    const result = await eventService.getPopularEvents();
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

export async function updateImage(req, res) {
  const t = await SequelizeInstance.transaction();
  try {
    const fileData = req.file;
    console.log(fileData);
    if (fileData === undefined) {
      cloudinary.uploader.destroy(fileData.filename)
      return res.status(400).send({ error: error.message });
    }
    const user = await eventService.updateImage(fileData);
    res.status(200).send(user);
    await t.commit();
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(404).send(error);
  }
}

export async function getEventUrl(req, res) {
  try {
    const event_id = req.query.event_id;
    const result = await eventService.getEventUrl(event_id);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

export async function getUserEvent(req, res) {
  try {
    const title = req.query.title;
    const date = req.query.date;
    const page = req.query.page;
    const result = await eventService.getUserEvent(title, date, page);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

export async function joinEvent(req, res) {
  const t = await SequelizeInstance.transaction();
  try {
    const event_id = req.query.event_id;
    const userId = req.loginUser.user_id;
    const result = await eventService.joinEvent(event_id, userId);
    res.status(200).send(result);
    t.commit();
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
    t.rollback();
  }
}

export async function leaveEvent(req, res) {
  const t = await SequelizeInstance.transaction();
  try {
    const event_id = req.query.event_id;
    const userId = req.loginUser.user_id;
    const result = await eventService.leaveEvent(event_id, userId);
    res.status(200).send(result);
    t.commit();
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
    t.rollback();
  }
}

export async function getEventParticipants(req, res) {
  try {
    const event_id = req.query.event_id;
    const result = await eventService.getEventParticipants(event_id);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}