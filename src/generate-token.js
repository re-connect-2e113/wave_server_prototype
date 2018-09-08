const webPush = require('web-push');

const { publicKey, privateKey } = webPush.generateVAPIDKeys();

console.log('これらの鍵をPushサーバー起動時に環境変数に設定してください。');
console.log(`公開鍵(VAPID_PUBLIC_KEY): ${publicKey}`);
console.log(`秘密鍵(VAPID_PRIVATE_KEY): ${privateKey}`);
