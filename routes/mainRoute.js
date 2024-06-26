const router = require('express').Router()

const {Login, verifyToken, checkToken, getToken, getRequests, deleteRequest, getLink, email} = require('../services/auth')
const { createOrder, getOrder, getOrders } = require('../services/order')

router.post('/auth/login',Login)

router.get('/auth/verifyToken',verifyToken,checkToken)
router.post('/auth/email',email)

router.post('/auth/token',getToken)

router.get('/auth/link',getLink)
router.post('/order',verifyToken,createOrder)

router.get('/requests',getRequests)
router.delete('/request/:id',deleteRequest)

router.get('/order/:id',getOrder)

router.get('/orders',getOrders)

module.exports = router
