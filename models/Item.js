const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
{
    itemType: {
        type: String,
        enum: ["Lost", "Found"],
        required: true
    },

    itemName: {
        type: String,
        required: true,
        trim: true
    },

    category: {
        type: String,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    image: {
        type: String,
        default: ""
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    contact: {
        type: String,
        required: true,
        maxlength: 100
    },

    status: {
        type: String,
        enum: ["Open", "Claimed", "Returned"],
        default: "Open"
    },

},
{
    timestamps: true
});

module.exports = mongoose.model("Item", itemSchema);