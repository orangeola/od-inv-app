#! /usr/bin/env node

console.log('Creates categories and items')

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const async = require('async')
const Item = require('./models/item')
const Category = require('./models/category')

const mongoose = require('mongoose');
mongoose.set('strictQuery', false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

const items = []
const categories = []

function categoryCreate(name, description, cb) {
  const category = new Category({ name: name, description: description });
       
  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + category);
    categories.push(category)
    cb(null, category);
  }   );
}

function itemCreate(name, description, category, price, stock, cb) {
  const item = new Item({ name: name, description: description, category: category, price: price, stock: stock });
       
  item.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Item: ' + item);
    items.push(item)
    cb(null, item);
  }   );
}

function createCategories(cb) {
    async.series([
      function(callback) {
        categoryCreate('Chocolate', 'All your favourite bars and blocks, from white to milk to dark!', callback);
      },
      function(callback) {
        categoryCreate('Lollies', 'Hard and soft, sour and sweet. We have something for everyone!', callback);
      },
      function(callback) {
        categoryCreate('Ice-cream', 'Silky smooth ice cream with every flavour you could think of!', callback);
      },
    ],// optional callback
    cb);
}

function createItems(cb) {
  async.series([
    function(callback) {
      itemCreate('Carburi Milk Chocolate Block', 'A big block of our world famous milk chocolate.', categories[0], 5, 50, callback);
    },
    function(callback) {
      itemCreate('Lemon Tree Sour', 'You wanted more. So we gave you more. Introducing our most sour lolly yet, like sucking a real lemon.', categories[1], 2, 100, callback);
    },
    function(callback) {
      itemCreate('Rover Hills Mystery Neapolitan', 'Forget what you know about neapolitan ice-cream. Every tub contains three random flavours, from strawberry to snot flavour!', categories[2], 10, 25, callback);
    },
    function(callback) {
      itemCreate('Andromeda White Chocolate Bar', 'A tasty white chocolate bar from another galaxy.', categories[0], 3, 200, callback);
    },
  ],// optional callback
  cb);
}

async.series([
    createCategories,
    createItems
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('CATAgories: '+categories);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});



