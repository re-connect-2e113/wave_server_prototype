const express = require('express');

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());

app.post('/messages', (req, res) => {
  console.log(req.body);
  res.send('ok');
});

app.listen(PORT, () => console.log(`listening to port ${PORT}`));
