require('dotenv').config();
const express = require('express');
const amqplib = require('amqplib');

const PORT = process.env.PORT || 8080;
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'apqp://guest:guest@localhost:5672';

const app = express();
const open = amqplib.connect(RABBITMQ_URL);
// TODO: 本当はDBにでもしまってpushサーバー側で宛先に対応するの取り出すべき
// push設定の登録自体はアカウント単位でもっておく
// 今はメッセージ内容と一緒にメッセージブローカーへ投げてるｗ
// Push通知先情報
// endpoint: Push通知リクエスト先, authSecret: クライアントシークレット
// contentEncoding: 通知内容エンコード方式, publicKey: クライアント公開鍵
const pushRecipientConfigs = [];

app.use(express.json());

// CORS許可
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  next();
})

// プリフライトリクエスト用
app.options('*', (req, res) => {
  res.sendStatus(200);
});

app.post('/messages', async (req, res) => {
  const connection = await open;
  const channel = await connection.createChannel();

  if (req.body.recipient !== 'YOU') {
    const queue = await channel.assertQueue('wave-messages-to-her');
    channel.sendToQueue('wave-messages-to-her', new Buffer(JSON.stringify(req.body)));
  } else {
    const queue = await channel.assertQueue('wave-messages-to-you');
    // ここで受け手気にするのもおかしい話だけど今はここで情報持ってるので仕方なし
    // 受け手が先にPush登録している前提
    const payload = { ...req.body, ...pushRecipientConfigs[0] };
    channel.sendToQueue('wave-messages-to-you', new Buffer(JSON.stringify(payload)));
  }

  await channel.close();
  res.status(201).json(req.body);
});


// Push購読API
app.post('/push/register', async (req, res) => {
  // Push先を登録(識別とか一切していないおひとりさま用。大体がそうね)
  const { endpoint, authSecret, contentEncoding, publicKey } = req.body;
  pushRecipientConfigs.push({
    endpoint, authSecret, contentEncoding, publicKey
  });
  console.log(endpoint, authSecret, contentEncoding, publicKey);
  // FIXME:
  res.status(201).json({ endpoint, authSecret, contentEncoding, publicKey });
});

// Push解約API
app.delete('/push/unsubscribe', async (req, res) => {
  const recipientInfo = pushRecipientConfigs.pop();
  console.log(recipientInfo);
  res.sendStatus(204);
});

app.listen(PORT, () => console.log(`listening to port ${PORT}`));
