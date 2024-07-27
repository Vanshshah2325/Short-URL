const express = require("express");
const { route } = require("./url_routes");

const router = express.Router();

router.get("/", async(req , res) => {
    const allusers = await URL.find({});
    return res.render("home",{
        urls : allusers,
    });
})

module.exports = router;
