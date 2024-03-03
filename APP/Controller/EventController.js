import * as eventService from '../Service/eventService.js';
import { SequelizeInstance } from '../utility/DbHelper.js';
export async function getEvents(req, res) {
  try {
    const result = await eventService.getEvents();
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
  try {
    const dataObj = req.body;
    const result = await eventService.createEvent(dataObj);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
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
