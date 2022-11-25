const express = require("express");
const mongoose = require("mongoose");
const booksRouter = require('./routes/books');
require("dotenv").config();

const app = express();

app.use('/api', booksRouter);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    const port = process.env.PORT || 3000;

    app.listen(port, () => {
      console.log(`http://localhost:${port}`);
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
