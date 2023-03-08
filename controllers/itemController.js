const Item = require("../models/item");

exports.item_list = (req, res) => {
  res.send("NOT IMPLEMENTED: Item list");
};

exports.item_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: Item detail: ${req.params.id}`);
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
