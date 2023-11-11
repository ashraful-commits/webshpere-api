const mongoose =require("mongoose");

const sellerSchema =mongoose.Schema({
 name:{
    type:String,
    trim:true
 },
 role:{
type:String,
default:"user",
trim:true
 },
 email:{
    type:String,
    trim:true
 },
 password:{
    type:String,
    trim:true
 },
 pricing:{
    type:String,
    trim:true
 },
 avatar:{
    type:String,
    trim:true
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
    type:String,
    trim:true
 },
 totalWithdrawn:{
    type:Number,
    default:0
 },
 emailSignature:{
    type:String
 },
 website:{
    type:String,
    trim:true
 },
 projects:{
    type:[mongoose.Schema.Types.ObjectId],
    default:[],
    ref:"Client"

 },
 payment:{
type:Array,
default:[]
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