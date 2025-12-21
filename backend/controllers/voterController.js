const User = require('../models/Voter');

// list voters (admin)
const listVoters = async (req, res) => {
    try {
        const list = await User.find({ role: 'voter' }).select('-password');
        res.json(list);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { listVoters };
