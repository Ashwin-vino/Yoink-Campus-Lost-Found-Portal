const Item = require("../models/Item");

// ===========================
// Browse Page
// ===========================
exports.getBrowse = async (req, res) => {
    try {
        const search = req.query.search || "";
        const type = req.query.type || "";
        const category = req.query.category || "";
        let query = {};
        if (search) {
            query.itemName = { $regex: search, $options: "i" };
        }
        if (type) {
            query.itemType = type;
        }
        if (category) {
            query.category = category;
        }
        const items = await Item.find(query).sort({ createdAt: -1 });
        res.render("browse", { items, search, type, category });
    } catch (err) {
        console.log(err);
        res.send("Error");
    }
};

// ===========================
// Report Page
// ===========================
exports.getReport = (req, res) => {
    if (!req.user) {
        return res.redirect("/auth/google");
    }
    res.render("report");
};

// ===========================
// Save Report
// ===========================
exports.createReport = async (req, res) => {
    try {

        console.log("req.file:", req.file);
        console.log("req.body:", req.body);

        await Item.create({
            itemType: req.body.itemType,
            itemName: req.body.itemName,
            category: req.body.category,
            location: req.body.location,
            description: req.body.description,
            contact: req.body.contact,
            image: req.file ? req.file.path : "",
            user: req.user._id
        });

        res.redirect("/browse");

    } catch (err) {
        console.log(err);
        res.send("Error Saving Item");
    }
};

// ===========================
// My Reports
// ===========================
exports.getMyReports = async (req, res) => {
    try {
        if (!req.user) {
            return res.redirect("/auth/google");
        }
        const items = await Item.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.render("myReports", { items });
    } catch (err) {
        console.log(err);
        res.send("Error");
    }
};

// ===========================
// Edit Report Page
// ===========================
exports.getEditReport = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.send("Item not found");
        }
        if (item.user.toString() !== req.user._id.toString()) {
            return res.send("Unauthorized");
        }
        res.render("item", { item });
    } catch (err) {
        console.log(err);
        res.send("Error");
    }
};

// ===========================
// Update Report
// ===========================
exports.updateReport = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.send("Item not found");
        }
        if (item.user.toString() !== req.user._id.toString()) {
            return res.send("Unauthorized");
        }
        await Item.findByIdAndUpdate(req.params.id, {
            itemType: req.body.itemType,
            itemName: req.body.itemName,
            category: req.body.category,
            location: req.body.location,
            description: req.body.description,
            ...(req.file && { image: req.file.path })
        });
        res.redirect("/my-reports");
    } catch (err) {
        console.log(err);
        res.send("Error Updating");
    }
};

// ===========================
// Delete Report
// ===========================
exports.deleteReport = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.send("Item not found");
        }
        if (item.user.toString() !== req.user._id.toString()) {
            return res.send("Unauthorized");
        }
        await Item.findByIdAndDelete(req.params.id);
        res.redirect("/my-reports");
    } catch (err) {
        console.log(err);
        res.send("Error deleting report");
    }
};

// ===========================
// Toggle Status
// ===========================
exports.toggleStatus = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.send("Item not found");
        }
        if (item.user.toString() !== req.user._id.toString()) {
            return res.send("Unauthorized");
        }
        if (item.status === "Open") {
            item.status = "Claimed";
        } else if (item.status === "Claimed") {
            item.status = "Returned";
        } else {
            item.status = "Open";
        }
        await item.save();
        res.redirect("/my-reports");
    } catch (err) {
        console.log(err);
        res.send("Error Updating Status");
    }
};