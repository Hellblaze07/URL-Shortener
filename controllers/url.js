const {nanoid} = require('nanoid');
const ShortLinkModel=require('../models/url.js');
async function handleCreateShortLink(req,res)
{ 
  const reqBody=req.body;
  if(!reqBody.url)
    return res.status(400).json({error:'URL is requried'});
  const existingUrl = await ShortLinkModel.findOne({ redirectURL: reqBody.url });
  if (existingUrl) {
    return res.json({ id: existingUrl.shortID });
  }

  const generatedId=nanoid(8);
  await ShortLinkModel.create({shortID:generatedId,redirectURL:reqBody.url,visitHistory:[]});
  return res.json({id:generatedId});
}

async function handleGetAnalytics(req,res)
{
 const shortID=req.params.shortID;
 const urlData = await ShortLinkModel.findOne({shortID});
 return res.json({totalClicks:urlData.visitHistory.length,analystics:urlData.visitHistory});
} 
module.exports={handleCreateShortLink,handleGetAnalytics};
