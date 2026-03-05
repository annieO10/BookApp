fetch("https://library-api-7br2.onrender.com/books")
  .then(res => res.json())
  .then(data => console.log(data));


const express = require("express");
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
    res.send("Library API running");
});