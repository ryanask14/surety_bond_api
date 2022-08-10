'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};
const databases = Object.keys(config.databases);
let sequelize = [];
for(let i = 0; i < databases.length; ++i) {
  
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }
    let database = databases[i];
    let dbPath = config.databases[database];
    sequelize[database] = new Sequelize( dbPath.database, dbPath.username, dbPath.password, dbPath );
}

fs
  .readdirSync(__dirname+'\\postgre')
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['Database1']['import'](path.join(__dirname+'/postgre', file));
    db[model.name] = model;
  });

  fs
  .readdirSync(__dirname+'\\sqlserver')
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['Database2']['import'](path.join(__dirname+'/sqlserver', file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize1 = sequelize['Database1'];
db.sequelize2 = sequelize['Database2'];
db.Sequelize = Sequelize;

module.exports = db;
