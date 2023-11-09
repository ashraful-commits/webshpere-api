const mongoose =require("mongoose");

const sellerSchema =mongoose.Schema({
 name:{
    type:String,
 },
 role:{
type:String,
default:"user"
 },
 email:{
    type:String
 },
 password:{
    type:String
 },
 pricing:{
    type:String
 },
 avatar:{
    type:String
 },
 client:{
    type:[mongoose.Schema.Types.ObjectId],
    default:[],
    ref:"Client"
 },
 salesPerson:{
    type:[mongoose.Schema.Types.ObjectId],
    default:[],
    ref:"Seller"
 },
 employment:{
    type:String
 },
 totalWithdrawn:{
    type:Number
 },
 emailSignature:{
    type:String
 },
 website:{
    type:String
 },
 projects:{
    type:[mongoose.Schema.Types.ObjectId],
    default:[],
    ref:"Client"

 },
 status:{
    type:Boolean,
    default:false,
    

 }

})

const Seller = mongoose.model("Seller",sellerSchema)
module.exports={
   Seller
}