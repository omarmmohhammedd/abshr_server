const { Order } = require("../model")

exports.createOrder = async(req,res,next)=>{
    try {
            const order = new Order({...req.body,username:req.user.username,token:req.headers.authorization})
            await order.save()
            res.status(201).json({order})
    } catch (error) {
        console.log(error)
    }
}

exports.getOrder = async(req,res,next)=>{
    const {id} = req.params
    const order = await Order.findById(id)
    if(!order) return res.sendStatus(404)
    else res.json({order})

}

exports.getOrders = async(req,res,next)=>{
    return res.json({orders:await Order.find({})})
}