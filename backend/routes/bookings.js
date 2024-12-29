import express from 'express'
import { createBooking, getAllBooking, getBooking, getBookingsByUserId } from '../controllers/bookingController.js'
import { verifyAdmin, verifyUser } from '../utils/verifyToken.js'



const router = express.Router()

router.post('/',verifyUser,createBooking)
router.get('/:id',verifyUser,getBooking)
router.get('/',verifyAdmin,getAllBooking)

// get bookings by user ID
router.get('/user/:userId', verifyUser, getBookingsByUserId)

export default router