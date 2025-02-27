const WebSocket = require('ws');
const server = new WebSocket.Server({ port: process.env.PORT, host: '0.0.0.0' });
const clients = new Map();

server.on('connection', (ws) => {
  console.log('New client connected');
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received from', data.from, ':', data);
      const senderId = data.from;
      if (!clients.has(senderId)) {
        clients.set(senderId, ws);
        console.log(`Registered ${senderId}`);
      }
      const targetId = senderId === 'mango1' ? 'mango2' : 'mango1';
      const targetClient = clients.get(targetId);
      if (targetClient && targetClient.readyState === WebSocket.OPEN) {
        console.log(`Forwarding to ${targetId}`);
        targetClient.send(JSON.stringify(data));
      } else {
        console.log(`Target ${targetId} not connected yet`);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });
  ws.on('close', () => {
    for (const [id, client] of clients) {
      if (client === ws) {
        clients.delete(id);
        console.log(`${id} disconnected`);
        break;
      }
    }
  });
});

console.log('Signaling server running on port', process.env.PORT);
