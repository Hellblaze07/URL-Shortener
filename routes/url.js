const express=require('express');

const {handleCreateShortLink,handleGetAnalytics} = require('../controllers/url.js')
const urlRouteHandler=express.Router();

urlRouteHandler.post("/",handleCreateShortLink);

urlRouteHandler.get("/analytics/:shortID",handleGetAnalytics)
module.exports=urlRouteHandler;
