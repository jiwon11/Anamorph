const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};


const sequelize = new Sequelize(
  config.database, config.username,config.password, config,
  );

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = require('./user')(sequelize,Sequelize);
db.Page = require('./page')(sequelize,Sequelize);
db.Hashtag = require('./hashtag')(sequelize,Sequelize);
db.Comment = require('./comment')(sequelize,Sequelize);
db.User.hasMany(db.Page);    //user모델과 page모델 은 1:N 관계 => hasMany와 belongTo로 연결
db.Page.belongsTo(db.User);
db.User.hasMany(db.Comment, { foreignKey: 'commenter', sourceKey: 'id' });    
db.Comment.belongsTo(db.User, { foreignKey: 'commenter', sourceKey: 'id' });
db.Page.hasMany(db.Comment, { foreignKey: 'commentpage', sourceKey: 'id' });   
db.Comment.belongsTo(db.Page, { foreignKey: 'commentpage', sourceKey: 'id' });
db.Page.belongsToMany(db.Hashtag,{through : 'PageHashtag' });
db.Hashtag.belongsToMany(db.Page,{through : 'PageHashtag' });
db.User.belongsToMany(db.Hashtag,{through : 'UserHashtag' });
db.Hashtag.belongsToMany(db.User,{through : 'UserHashtag' });

db.User.belongsToMany(db.User, {
  foreignKey : 'followingId',
  as : 'Followers',
  through : 'Follow',
});
db.User.belongsToMany(db.User, {
  foreignKey : 'followerId',
  as : 'Followings',
  through : 'Follow',
});

module.exports = db;
