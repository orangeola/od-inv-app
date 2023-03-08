const Category = require("../models/category");
const Item = require("../models/item");

const async = require("async");

exports.index = (req, res) => {
  async.parallel(
    {
      item_count(callback) {
        Item.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
      },
      category_count(callback) {
        Category.countDocuments({}, callback);
      },
    },
    (err, results) => {
      res.render("index", {
        title: "Sugar & Sweet Co. Home",
        error: err,
        data: results,
      });
    }
  );
};

exports.category_list = function (req, res, next) {
  Category.find()
    .sort({ name: 1 })
    .exec(function (err, list_category) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render("category_list", { title: "Category List", category_list: list_category });
    });
};

exports.category_detail = (req, res) => {
  async.parallel(
    {
      category(callback) {
        Category.findById(req.params.id).exec(callback);
      },
      
      category_items(callback) {
        Item.find({ category: req.params.id }).exec(callback);
      }
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.category == null) {
        const err = new Error("Category not found");
        err.status = 404;
        return next(err);
      }
      //Success
      res.render("category_detail", {
        category_detail: results.category,
        category_items: results.category_items
      });
    }
  )
};

exports.category_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Category create GET");
};

exports.category_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Category create POST");
};

exports.category_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Category delete GET");
};

exports.category_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Category delete POST");
};

exports.category_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Category update GET");
};

exports.category_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Category update POST");
};