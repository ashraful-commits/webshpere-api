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
    projects:{
    type:[mongoose.Schema.Types.ObjectId],
    default:[],
    ref:"Project"
    },
    status:{
        type:Boolean,
        default:false
    },
    active:{
        type:Boolean,
        default:false
    },
    companyName:{
        type:String
    }
},{timestamp:true})

const Client = mongoose.model("Client",clientSchema)
module.exports={
    Client
}