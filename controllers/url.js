const crypto = require('crypto');
const ShortLinkModel=require('../models/url.js');

function generateShortId(length = 8) {
  return crypto.randomBytes(length).toString('base64url').slice(0, length);
}

async function handleCreateShortLink(req,res)
{ 
  const reqBody=req.body;
  if(!reqBody.url)
    return res.status(400).json({error:'URL is requried'});
  const existingUrl = await ShortLinkModel.findOne({ redirectURL: reqBody.url });
  if (existingUrl) {
    return res.json({ id: existingUrl.shortID });
  }

  const generatedId=generateShortId(8);
  await ShortLinkModel.create({shortID:generatedId,redirectURL:reqBody.url,visitHistory:[]});
  return res.json({id:generatedId});
}

async function handleGetAnalytics(req,res)
{
 const shortID=req.params.shortID;
 const urlData = await ShortLinkModel.findOne({shortID});
 if(!urlData) return res.status(404).json({error: "Short URL not found"});
 return res.json({totalClicks:urlData.visitHistory.length,analystics:urlData.visitHistory});
} 
module.exports={handleCreateShortLink,handleGetAnalytics};
