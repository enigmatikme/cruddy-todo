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
    items[id] = todo;
    fs.writeFile(path, text, (err) => {
      if (err) {
        console.log('ERROR: ' + err);
      } else {
        callback(null, todo);
      }
    });
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      var item = { id: id, text: data.toString() }
      callback(null, item);
    }
  });
};

exports.readAll = (callback) => {
  var data = [];
  fs.readdir(exports.dataDir, (err, files) => {
    files.forEach((file) => {
      var fileName = file.slice(0, -4);
      var item = { id: fileName, text: fileName };
      data.push(item);
    });
    callback(null, data);
    return data;
  });
};

exports.update = (id, text, callback) => {
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), 'utf8', (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err, data) => {
        if (err) { 
          callback(err, null);
        } else {
          callback(null, data);
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  exports.readOne(id, (err, todo) => {
    if (err) {
      callback(err, null);
    } else {
      fs.unlink(path.join(exports.dataDir, `${id}.txt`), (err, data) => {
        if (err) {
          callback(err, null);
        } else {
          callback(null, data);
        }
      });
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
