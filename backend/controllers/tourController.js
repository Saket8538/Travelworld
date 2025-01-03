import Tour from '../models/Tour.js';

//create new tour
export const createTour = async (req, res) => {
    const newTour = new Tour(req.body);

    try {
        const savedTour = await newTour.save();

        res.status(200).json({
            success: true,
            message: 'Successfully created',
            data: savedTour,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to create tour. Please try again.' });
    }
};

//update tour
export const updateTour = async (req, res) => {
    const id = req.params.id;

    try {
        const updatedTour = await Tour.findByIdAndUpdate(id, {
            $set: req.body
        }, { new: true });

        res.status(200).json({
            success: true,
            message: 'Successfully updated',
            data: updatedTour,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to update tour. Please try again.',
        });
    }
};

//delete tour
export const deleteTour = async (req, res) => {
    const id = req.params.id;

    try {
        await Tour.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Successfully deleted',
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete tour. Please try again.',
        });
    }
};

//getSingle tour
export const getSingleTour = async (req, res) => {
    const id = req.params.id;

    try {
        const tour = await Tour.findById(id).populate('reviews');

        res.status(200).json({
            success: true,
            message: 'Successfully found tour',
            data: tour,
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: 'Tour not found',
        });
    }
};

//getAll tour
export const getAllTour = async (req, res) => {
    // for pagination
    const page = parseInt(req.query.page) || 0;

    try {
        const tours = await Tour.find({}).populate('reviews')
            .skip(page * 8).limit(8);

        res.status(200).json({
            success: true,
            count: tours.length,
            message: 'Successfully retrieved all tours',
            data: tours,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve tours. Please try again later.',
        });
    }
};

// get tour by search
export const getTourBySearch = async (req, res) => {
    console.log(req.query);
    // here 'i' means case insensitive
    const city = new RegExp(req.query.city, 'i');
    const distance = parseInt(req.query.distance);
    const maxGroupSize = parseInt(req.query.maxGroupSize);

    try {
        // gte means greater than equal
        const tours = await Tour.find({
            city,
            distance: { $gte: distance },
            maxGroupSize: { $gte: maxGroupSize }
        }).populate('reviews');

        if (tours.length > 0) {
            res.status(200).json({
                success: true,
                message: 'Successfully found tours',
                data: tours,
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'No results found',
                data: tours,
            });
        }
    } catch (err) {
        res.status(404).json({
            success: false,
            message: 'No data found',
        });
    }
};

//get featured tour
export const getFeaturedTour = async (req, res) => {
    try {
        const tours = await Tour.find({ featured: true }).populate('reviews').limit(8);

        res.status(200).json({
            success: true,
            message: 'Successfully found featured tours',
            data: tours,
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: 'No data found',
        });
    }
};

//get tour counts
export const getTourCount = async (req, res) => {
    try {
        const tourCount = await Tour.estimatedDocumentCount();

        res.status(200).json({ success: true, data: tourCount });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch tour count' });
    }
};