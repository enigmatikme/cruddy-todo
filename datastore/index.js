const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    var todo = {id: id, text: text};
    var path = `${exports.dataDir}/${id}.txt`;
    items[id] = text;
    fs.writeFile(path, text, (err) => {
      if (err) {
        console.log('ERROR: ' + err);
      } else {
        callback(null, todo); // moved callback to this line from 14
      }
    });
  });
};

exports.readOne = (id, callback) => {
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, {id: id, text: item});
  // }

  fs.readFile(`{exports.dataDir}/${id}`, (err, fileData) => {
    if (err) {
      console.log("Error");
    } else {
      callback(null, fileData);
    }
  });


};

exports.readAll = (callback) => {
  var data = [];

  fs.readdir(exports.dataDir, (err, fileNames) => {
    fileNames.forEach((file) => {
      exports.readOne(file, (err, fileData) => {
        data.push(fileData);
      });
    });
  });

  callback(null, data);
};

exports.update = (id, text, callback) => {
  console.log('create called');
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, {id: id, text: text});
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if(!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
