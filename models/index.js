let fs = require('fs');
let path = require('path');
const Sequelize = require('sequelize');
let connection = require('../connection');

let db = {};

fs.readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf('.') !== 0 && (file !== 'index.js') && (file.slice(-3) === '.js'));
  })
  .forEach(file => {
    let model = require(path.join(__dirname, file))(connection, Sequelize.DataTypes);
    // let model = connection['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = connection;
db.Sequelize = Sequelize;

module.exports = db;