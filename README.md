## 開発用メモ

- `npm run key-gen`
  PUSH通知に使うVAPIDで使うキーペアを作成します

### 起動時環境変数

`.env.sample`を`.env`という名前でコピーして内容を書き換えると環境変数が読み込まれます。

- PORT
  ポート番号(WEBサーバー)
- RABBITMQ_URL
  RabbitMQのURL(ジョブキュー)
- ISSUER
  PUSHするアプリのインスタンス所有者(あなた)の情報
  メールアドレス`mailto:メールアドレス`かあなたのアプリ全体に責任を持つドメイン
- VAPID_PUBLIC_KEY
  PUSHサーバー公開鍵、Waveクライアントでも使用
- VAPID_PRIVATE_KEY
  PUSHサーバー秘密鍵
- WAVE_ICON_URL
  Waveのアイコンとして使う画像のURLを指定(通知で表示)
