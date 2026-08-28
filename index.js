const express = require('express');

require("dotenv").config();
const shortLinkRoutes = require("./routes/url.js");
const ShortLinkModel = require('./models/url.js');
const serverApp = express();
const { establishDatabaseConnection } = require('./connect.js');
const PORT = 8001;

establishDatabaseConnection(process.env.MONGO_URL).then(() => console.log("Mongodb connected"));

serverApp.use(express.json());
serverApp.use(express.static('public'));

serverApp.use("/url", shortLinkRoutes);

serverApp.get('/:shortID', async (req, res) => {
    const shortID = req.params.shortID;
    const urlDocument = await ShortLinkModel.findOneAndUpdate(
        {
            shortID
        },
        { $push: { visitHistory: { timestamp: Date.now() } }, })
    
    if(!urlDocument) return res.status(404).json({error: "Short URL not found"});
    res.redirect(urlDocument.redirectURL);
})

serverApp.listen(PORT, () => console.log(`Server Started at ${PORT}`));
