module.exports = (sequelize,DataTypes) => (
    sequelize.define('like', {
        likeCount : {
        type : DataTypes.INTEGER,
        defaultValue : 0,
        } 
    }, {
        timestamps : true,
        paranoid : true,
        timezone: 'utc',
    })
);