const express = require("express");
const path = require('path');

const staticroute = require("./routes/staticrouter");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url_routes");
const URL = require("./models/url_models");



const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://localhost:27017/short-url").then(() =>
  console.log("Mongodb connected")
);

app.use(express.json());
app.use(express.urlencoded({extended : false})); // when we use the <form> data then this line encoded that data to use in node.js

app.set("view engine", "ejs");              // connect with EJS
app.set('views', path.resolve('./views'));  // connect with home.ejs which is in views

app.use("/url", urlRoute);

app.get("/url/home", async (req, res) => {
  const allusers = await URL.find({});
  return res.render("home" , {
    urls : allusers ,
  }); 
});


app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    },
    { new: true }
  );

  if (!entry) {
    return res.status(404).send("URL not found");
  }

  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
