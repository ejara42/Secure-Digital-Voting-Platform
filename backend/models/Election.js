// models/Election.js
import mongoose from "mongoose";

const electionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    year: { type: Number, required: true },
    description: { type: String, required: true }
});

export default mongoose.model("Election", electionSchema);
