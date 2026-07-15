const Item = require("../models/Item");

exports.getHome = async (req, res) => {

    try {

        const totalItems = await Item.countDocuments();

        const lostItems = await Item.countDocuments({
            itemType: "Lost"
        });

        const foundItems = await Item.countDocuments({
            itemType: "Found"
        });

        const returnedItems = await Item.countDocuments({
            status: "Returned"
        });

        const recentItems = await Item.find()
            .sort({ createdAt: -1 })
            .limit(6);

        res.render("home", {
            totalItems,
            lostItems,
            foundItems,
            returnedItems,
            recentItems
        });

    } catch (err) {

        console.log(err);

        res.render("home", {
            totalItems: 0,
            lostItems: 0,
            foundItems: 0,
            returnedItems: 0,
            recentItems: []
        });

    }

};