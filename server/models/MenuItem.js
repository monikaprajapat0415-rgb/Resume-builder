import mongoose from "mongoose";
import { MENU_LOCATIONS } from "../utils/menuDefaults.js";

const MenuItemSchema = new mongoose.Schema({
    // Set only on the built-in items (see utils/menuDefaults.js). Custom items have none.
    key: { type: String, unique: true, sparse: true },
    location: { type: String, enum: MENU_LOCATIONS, required: true },
    label: { type: String, required: true, trim: true, maxlength: 40 },
    url: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },   // false = hidden from visitors, kept for later
    newTab: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("MenuItem", MenuItemSchema);
