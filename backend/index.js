const express = require('express');
const app = express();
const port = 5000;
const router = require('./routes/index');
const errorHandler = require('./middleware/errorHandling');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.static('D:/ТОФИ/internet-broker/backend/static/'));
app.use('/api/', router);

app.use(errorHandler);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
