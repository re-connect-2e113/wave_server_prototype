## 開発用メモ

- `npm run key-gen`
  PUSH通知に使うVAPIDで使うキーペアを作成します

### 起動時環境変数

- PORT
  ポート番号(WEBサーバー)
- RABBITMQ_URL
  RabbitMQのURL(ジョブキュー)
- VAPID_PUBLIC_KEY
  PUSHサーバー公開鍵、Waveクライアントでも使用
- VAPID_PRIVATE_KEY
  PUSHサーバー秘密鍵
- WAVE_ICON_URL
  Waveのアイコンとして使う画像のURLを指定(通知で表示)
