const Item = require("../models/item");
const Category = require("../models/category");
const { body, validationResult } = require("express-validator");

const async = require("async");

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

exports.item_detail = (req, res, next) => {
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
  Category.find()
    .exec(function (err, categories) {
      if (err) {
        return next(err)
      }
      //Success
      res.render("item_form", { 
        title: "Create an Item", 
        categories: categories,
        current_category: "null" });
    })
};

exports.item_create_post = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.category === "undefined" ? [] : [req.body.category];
    }
    next();
  },

  // Validate and sanitize fields.
  body("name", "Item must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must not be empty.")
    .trim()
    .isInt({ min: 0.1 })
    .escape(),
  body("stock", "Stock must not be empty")
    .trim()
    .isInt({ min: 0 })
    .escape(),
  body("category.*").escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all authors and genres for form.
      Category.find()
        .exec(function (err, categories) {
      if (err) {
        return next(err)
      }

        for (const category of categories) {
          if (item.category.includes(category._id)) {
            checked = true;
          }
        }

        res.render("item_form", { 
          title: "Create an Item",
          current_category: req.body.category,
          item,
          errors: errors.array(),
          categories: categories
        });
      });
      return;
    }

    // Data from form is valid. Save book.
    item.save((err) => {
      if (err) {
        return next(err);
      }
      // Successful: redirect to new book record.
      res.redirect(item.url);
    });
  },
];


exports.item_delete_get = (req, res) => {
    Item.findById({_id: req.params.id})
    .exec(function (err, item) {
      if (err) {
        return next(err);
      }
      if (item == null) {
        res.redirect("/catalog/item");
      }
      //Successful, so render
      res.render("item_delete", { 
        title: "Delete an Item", 
        item: item });
    });
};

exports.item_delete_post = (req, res) => {
  Item.findById({_id: req.params.id})
    .exec(function (err, item) {
      if (err) {
        return next(err);
      }
      if (item == null) {
        res.redirect("/catalog/item");
      }
      // Delete object.
      Item.findByIdAndRemove(req.body.itemid, (err) => {
        if (err) {
          return next(err);
        }
        // Success
        res.redirect("/catalog/item");
      });
    });
};

exports.item_update_get = (req, res) => {
  async.parallel({
    item(callback){
      Item.findById({_id: req.params.id}).exec(callback);
    },
    categories(callback){
      Category.find().exec(callback);
    }
  },
    (err, results) => {
      res.render("item_form", { 
        title: "Create an Item",
        current_category: results.item.category[0],
        item: results.item,
        categories: results.categories
      });
    }
  );
};


exports.item_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Item update POST");
};





exports.item_update_post = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.category === "undefined" ? [] : [req.body.category];
    }
    next();
  },

  // Validate and sanitize fields.
  body("name", "Item must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must not be empty.")
    .trim()
    .isInt({ min: 0.1 })
    .escape(),
  body("stock", "Stock must not be empty")
    .trim()
    .isInt({ min: 0 })
    .escape(),
  body("category.*").escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
      _id: req.params.id
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all authors and genres for form.
      Category.find()
        .exec(function (err, categories) {
      if (err) {
        return next(err)
      }

        for (const category of categories) {
          if (item.category.includes(category._id)) {
            checked = true;
          }
        }

        res.render("item_form", { 
          title: "Create an Item",
          current_category: req.body.category,
          item,
          errors: errors.array(),
          categories: categories
        });
      });
      return;
    }

    // Data from form is valid.
      // Check if Genre with same name already exists.
    Item.findOne({ name: req.body.name }).exec((err, found_item) => {
      if (err) {
        return next(err);
      }

      if (found_item) {
        res.redirect(found_item.url);
      } else {
        // Data from form is valid. Update the record.
        Item.findByIdAndUpdate(req.params.id, item, {}, (err, theitem) => {
        if (err) {
          return next(err);
        }

        // Successful: redirect to book detail page.
        res.redirect(theitem.url);});
      }
    });
  },
];







