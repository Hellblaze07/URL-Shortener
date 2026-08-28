const mongoose=require('mongoose');

const shortLinkSchema= new mongoose.Schema({shortID:{type:String,required:true,unique:true},
    redirectURL:{type: String,required: true},
    visitHistory:[{timestamp:{type:Number}}]},
    {timestamps:true}
);

const ShortLinkModel=mongoose.model('url',shortLinkSchema);

module.exports=ShortLinkModel;
