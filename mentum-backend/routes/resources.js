const express = require('express');
const multer = require('multer');
const Resource = require('../models/Resource');
const authMiddleware = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');
const router = express.Router();

router.post('/', authMiddleware, (req, res, next) => {
    uploadMiddleware.single('file')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            console.error('Multer Error:', err.message);
            return res.status(400).json({ message: 'File upload error', error: err.message });
        } else if (err) {
            console.error('Error:', err.message);
            return res.status(400).json({ message: err.message });
        }
        next();
    });
}, async (req, res) => {
    try {

        const { title, description, fileUrl } = req.body;

        if (!title || !description) {
            console.error('Validation Error: Missing title or description');
            return res.status(400).json({ message: 'Title and description are required' });
        }

        let resourceFileUrl = null;
        if (req.file) {
            resourceFileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        } else if (fileUrl) {
            resourceFileUrl = fileUrl;
        } else {
            console.error('Validation Error: No file or URL provided');
            return res.status(400).json({ message: 'Either a file or a file URL is required' });
        }

        const newResource = new Resource({
            title,
            description,
            uploadedBy: req.user._id,
            fileUrl: resourceFileUrl,
        });

        await newResource.save();
        res.status(201).json({ message: 'Resource added successfully', resource: newResource });
    } catch (error) {
        console.error('Error Adding Resource:', error);
        res.status(500).json({ message: 'Error adding resource', error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        const query = search ? {
            $or: [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ],
        } : {};

        const resources = await Resource.find(query)
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .populate('uploadedBy', 'name email');

        const total = await Resource.countDocuments(query);

        res.status(200).json({ total, resources, page, pages: Math.ceil(total / limit) });
    } catch (error) {
        console.error('Error Fetching Resources:', error);
        res.status(500).json({ message: 'Error fetching resources', error: error.message });
    }
});

router.get('/my', authMiddleware, async (req, res) => {
    try {
        const userId = req.user._id;
        const userResources = await Resource.find({ uploadedBy: userId })
            .populate('uploadedBy', 'name email'); 
        res.status(200).json({ resources: userResources });
    } catch (error) {
        console.error('Error fetching user resources:', error);
        res.status(500).json({ message: 'Error fetching resources', error: error.message });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const resourceId = req.params.id;
        const userId = req.user._id;

        const resource = await Resource.findById(resourceId);

        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        if (resource.uploadedBy.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'You are not authorized to delete this resource' });
        }

        await Resource.findByIdAndDelete(resourceId);

        res.status(200).json({ message: 'Resource deleted successfully' });
    } catch (error) {
        console.error('Error deleting resource:', error);
        res.status(500).json({ message: 'Error deleting resource', error: error.message });
    }
});

module.exports = router;
