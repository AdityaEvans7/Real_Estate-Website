import express from 'express';
import { bookVisit, cancelBookings, createUser, getAllBookings, getAllFavorites, toFav } from '../controllers/userController.js';
import jwtCheck from '../config/auth0Config.js';

const router = express.Router();

// Protect the register route with JWT authentication
router.post('/register', jwtCheck, createUser);
router.post("/bookVisit/:id", jwtCheck, bookVisit);
router.post("/allBookings", jwtCheck, getAllBookings);
router.post("/removeBooking/:id", jwtCheck, cancelBookings);
router.post("/toFav/:rid", jwtCheck, toFav);
router.post("/allFav/", jwtCheck, getAllFavorites);

export { router as userRoute };
