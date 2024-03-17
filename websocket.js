import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
const PORT = process.env.PORT || 5000;

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
  console.log('WebSocket client connected');

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

export default wss;
