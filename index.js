const express = require('express');
const amqplib = require('amqplib');

const PORT = process.env.PORT || 8080;
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'apqp://guest:guest@localhost:5672';

const app = express();
const open = amqplib.connect(RABBITMQ_URL);

app.use(express.json());

app.post('/messages', async (req, res) => {
  const connection = await open;
  const channel = await connection.createChannel();
  const queue = channel.assertQueue('wave-messages');
  channel.sendToQueue('wave-messages', new Buffer(JSON.stringify(req.body)));
  console.log(req.body);
  res.send('ok');
});

app.listen(PORT, () => console.log(`listening to port ${PORT}`));
