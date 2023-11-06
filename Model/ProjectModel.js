const mongoose =require("mongoose");

const projectSchema =mongoose.Schema({
projectName: {
    type:String
},
client:{
type:[mongoose.Schema.Types.ObjectId],
ref:"Client",
default:[]
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
    type:Number
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
}
},{timestamp:true})

const Project = mongoose.model("Project",projectSchema)
module.exports={Project}
