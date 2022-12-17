require("dotenv").config();

const express = require('express');
const app = express();
const port = 5000;
const valueChecker = require('./middleware/valueMiddleware');
const router = require('./routes/index');
const errorHandler = require('./middleware/errorHandling');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.static(process.env.STATIC_FILES_PATH));
app.use('/api/', valueChecker, router);

app.use(errorHandler);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
