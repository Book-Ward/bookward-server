const express = require("express");
const mongoose = require("mongoose");
const Book = require("./models/Book");
require("dotenv").config();

const app = express();

app.get('/books', async (req, res)=>{
    try{
        const data = await Book.find().limit(10);
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }});

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
