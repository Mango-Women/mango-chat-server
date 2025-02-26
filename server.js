const WebSocket = require('ws');
const server = new WebSocket.Server({ port: process.env.PORT || 8080 });
const clients = new Map();
server.on('connection', (ws) => {
console.log('New client connected');
ws.on('message', (message) => {
const data = JSON.parse(message);
const senderId = data.from;
if (!clients.has(senderId)) {
clients.set(senderId, ws);
}
const targetId = senderId === 'mango1' ? 'mango2' : 'mango1';
const targetClient = clients.get(targetId);
if (targetClient && targetClient.readyState === WebSocket.OPEN) {
targetClient.send(JSON.stringify(data));
}
});
ws.on('close', () => {
for (const [id, client] of clients) {
if (client === ws) {
clients.delete(id);
break;
}
}
});
});
console.log('Signaling server running');