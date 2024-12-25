import asyncHandler from 'express-async-handler';
import { prisma } from '../config/prismaConfig.js';


// User creation logic with JWT validation
export const createUser = asyncHandler(async (req, res) => {
    console.log("Creating or fetching user");

    // Get user email from the request body (or extract from JWT if needed)
    const { email } = req.body;

    // Check if the user already exists in the database
    const userExists = await prisma.user.findUnique({
        where: { email }
    });

    // If the user does not exist, create a new user
    if (!userExists) {
        const user = await prisma.user.create({ data: req.body });
        return res.status(201).send({
            message: 'User created successfully',
            user,
        });
    } else {
        // If the user already exists, return the existing user
        return res.status(200).send({
            message: 'User already exists',
            user: userExists,
        });
    }
});

// Other controllers for bookings and favorites (unchanged)
export const bookVisit = asyncHandler(async (req, res) => {
    const { email, date } = req.body;
    const { id } = req.params;

    try {
        const alreadyBooked = await prisma.user.findUnique({
            where: { email },
            select: { bookedVisits: true },
        });

        if (alreadyBooked.bookedVisits?.some((visit) => visit.id === id)) {
            res.status(400).json({ message: "This residency is already booked by you" });
        } else {
            await prisma.user.update({
                where: { email },
                data: {
                    bookedVisits: {
                        set: [...alreadyBooked.bookedVisits, { id, date }],
                    },
                },
            });
            res.send("Your visit is booked successfully");
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Other functions (cancelBookings, toFav, etc.) remain the same


// Function to get all bookings
export const getAllBookings = asyncHandler(async (req, res) => {
    const { email } = req.body;

    try {
        const bookings = await prisma.user.findUnique({
            where: { email },
            select: { bookedVisits: true },
        });

        if (!bookings) {
            res.status(404).json({ message: "No bookings found" });
        } else {
            res.status(200).send(bookings);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Function to cancel bookings
export const cancelBookings = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const { id } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            select: { bookedVisits: true },
        });

        if (!user || !user.bookedVisits) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const index = user.bookedVisits.findIndex((visit) => visit.id === id);

        if (index === -1) {
            res.status(404).json({ message: "Booking not found" });
        } else {
            const updatedVisits = [...user.bookedVisits];
            updatedVisits.splice(index, 1);

            await prisma.user.update({
                where: { email },
                data: { bookedVisits: { set: updatedVisits } },
            });

            res.send("Booking canceled successfully");
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


//fun to add a resd in fav list
export const toFav = asyncHandler(async(req, res)=>{
    const {email} = req.body;
    const {rid} = req.params;

    try {
        const user = await prisma.user.findUnique({
        where: {email}
        })
        if (user.favResidenciesID.includes(rid)) {
            const updateUser = await prisma.user.update({
                where : {email},
                data: {
                    favResidenciesID : {
                        set : user.favResidenciesID.filter((id)=> id !== rid)
                    }
                }
            })
            res.send({message: "Remove from favorites", user: updateUser})
        }
        else{
            const updateUser = await prisma.user.update({
                where : {email},
                data: {
                    favResidenciesID : {
                        push: rid
                    }
                }
            })
            res.send({message: "Updated favorites", user: updateUser})
        }
    } catch (error) {
        throw new Error(error.message)
    }
})

//fun to get all favorites list
export const getAllFavorites = asyncHandler(async(req, res)=>{
    const {email} = req.body;
    try {
        const favResd = await prisma.user.findUnique({
            where: {email},
            select: {favResidenciesID: true},
        });
        res.status(200).send(favResd);
    } catch (err) {
        throw new Error(err.message)
    }
})