const express=require('express');
const { sendMessage, getMessages } = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');
const router=express.Router();

router.post('/send/:id',authMiddleware, checkRole(['patient','doctor']),sendMessage);
router.get('/:id',authMiddleware, checkRole(['patient','doctor']),getMessages);


module.exports=router;