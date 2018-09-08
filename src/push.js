const amqplib = require('amqplib');
const webPush = require('web-push');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'apqp://guest:guest@localhost:5672';
const ISSUER = process.env.ISSUER;
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBKEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const WAVE_ICON_URL = process.env.WAVE_ICON_URL;

const open = amqplib.connect(RABBITMQ_URL);

webPush.setVapidDetails(ISSUER, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

open.then(async (connection) => {
  const channel = await connection.createChannel();
  const qAssert = await channel.assertQueue('wave-messages');

  // メッセージがブローカーから渡されるたび実行
  channel.consume(qAssert.queue, (message) => {
    // メッセージの取り出し
    const json = message.content.toString();
    const data = JSON.parse(json);

    console.log(JSON.stringify(data, null, 2));

    // 通知の送信
    webPush.sendNotification({
      endpoint: data.endpoint,
      keys: {
        auth: data.authSecret,
        p256dh: data.publicKey,
      },
    }, JSON.stringify({
      title: 'YOU\'VE GOT A MESSAGE!',
      body: data.text,
      icon: WAVE_ICON_URL,
    }), {
      contentEncoding: data.contentEncoding,
    })
    .then(() => {
      // おわったょ
      channel.ack(message);
    })
    .catch((reason) => console.error(reason));
  }, {
    noAck: false,
  });
});
