const express = require("express");
const mongoose = require("mongoose");
const booksRouter = require('./routes/books');
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', booksRouter);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    const port = process.env.PORT || 8000;
    const dbHost = process.env.DB_HOST || localhost;

    app.listen(port, () => {
      console.log(`http://${dbHost}:${port}`);
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
