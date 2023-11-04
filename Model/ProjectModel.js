const mongoose =require("mongoose");

const projectSchema =mongoose.Schema({
projectName: {
    type:String
},
client:{
type:[mongoose.Schema.Types.ObjectId]
},
projectType: {
    type:String
},
budget: {
    type:Number
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
    type:[mongoose.Schema.Types.ObjectId]
},
team:{
    type:[mongoose.Schema.Types.ObjectId]
},
feedBack:{
    type:[mongoose.Schema.Types.ObjectId]
},
commissionRate:{
    type:Number
}, 
projectStatus:{
    type:String
},
status:{
    type:Boolean,
    default:false
}
},{timestamp:true})

const Project = mongoose.model("project",projectSchema)
module.exports=Project
