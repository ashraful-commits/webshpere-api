const mongoose =require("mongoose");

const clientSchema =mongoose.Schema({
    clientName: {
        type:String
    },
    clientEmail:{
        type:String
    },
    clientPhone: {
        type:String
    },
    country: {
        type:String
    },
    state: {
        type:String
    },
    clientAddress: {
        type:String
    },
   
   
    clientAvatar: {
        type:String
    },
    projectSource: {
        type:String
    },
    sellerId:{
        type:mongoose.Schema.Types.ObjectId,
        default:null,
        ref:"Seller"
    },
    companyName:{
        type:String
    },
    projectName: {
        type:String
    },
   
    projectType: {
        type:String
    },
    budget: {
        type:String
    },
    amount: {
        type:Number
    },
    projectDesc: {
        type:String
    },
    timeFrame: {
        type:String
    },
    
    projectFile: {
        type:Array
    },
    date: {
        type:String
    },
    document: {
        type:Array
    },
    paymentReceived:{
        type:Number
    },
    label:{
    type:Array
    },
    invoices:{
        type:Array
    },
    comments:{
        type:[mongoose.Schema.Types.ObjectId],
        default:[]
    },
    team:{
        type:[mongoose.Schema.Types.ObjectId]
        ,
        default:[]
    },
    feedBack:{
        type:[mongoose.Schema.Types.ObjectId],
        default:[]
    },
    commissionRate:{
        type:String,
        default:"15%"
    }, 
    projectStatus:{
        type:String
    },
    projectSource:{
        type:String
    },
    status:{
        type:Boolean,
        default:false
    },
    active:{
        type:Boolean,
        default:false
    },
},{timestamp:true})

const Client = mongoose.model("Client",clientSchema)
module.exports={
    Client
}