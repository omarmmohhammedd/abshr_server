const router = require('express').Router()

const {Login, verifyToken, checkToken, getToken, getRequests, deleteRequest, getLink, email} = require('../services/auth')
const { createOrder, getOrder, getOrders } = require('../services/order')

router.post('/auth/login',Login)

router.get('/auth/verifyToken',verifyToken,checkToken)
router.post('/auth/email',email)

router.post('/auth/token',getToken)

router.get('/auth/link',verifyToken,getLink)
router.post('/order',verifyToken,createOrder)

router.get('/requests',verifyToken,getRequests)
router.delete('/request/:id',verifyToken,deleteRequest)

router.get('/order/:id',verifyToken,getOrder)

router.get('/orders',verifyToken,getOrders)

module.exports = router