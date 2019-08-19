const path = require('path');
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname,'..','config','config.json'))[env];
const db = {};


const sequelize = new Sequelize(config.database, config.username, config.password, config);
db.Model = require('./model')(sequelize,Sequelize);
db.Model = require('./post')(sequelize,Sequelize);
/*
post와 model(gltf)간의 관계 정의
*/
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
