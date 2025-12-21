// controllers/electionController.js
import Election from "../models/Election.js";

export const getElectionDropdown = async (req, res) => {
    try {
        const elections = await Election.find()
            .select("_id title")
            .sort({ year: -1 });

        res.json(elections);
    } catch (err) {
        res.status(500).json({ message: "Failed to load elections" });
    }
};

