import * as chatService from '../Service/chatService.js';
import * as webSocketService from '../Service/webSocketService.js';
import { SequelizeInstance } from '../utility/DbHelper.js';

export async function viewMessage(req, res) {
  try {
    const dataObj = req.body;
    const result = await chatService.viewMessage(dataObj);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

export async function sendMessage(messageData) {
  try {
    const savedMessage = await chatService.saveMessage(messageData);
    webSocketService.sendMessageOverWebSocket(savedMessage);
  } catch (error) {
    console.error('Error sending message:', error);
  }
}
