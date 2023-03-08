const Item = require("../models/item");

exports.item_list = function (req, res, next) {
  Item.find()
    .sort({ title: 1 })
    .exec(function (err, list_item) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render("item_list", { title: "Item List", item_list: list_item });
    });
};

exports.item_detail = (req, res) => {
  Item.findById(req.params.id)
    .populate("category")
    .exec(function (err, item_detail) {
      if (err) {
        return next(err)
      }
      //Success
      res.render("item_detail", {item: item_detail})
    })
};

exports.item_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Item create GET");
};

exports.item_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Item create POST");
};

exports.item_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Item delete GET");
};

exports.item_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Item delete POST");
};

exports.item_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Item update GET");
};

exports.item_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Item update POST");
};
