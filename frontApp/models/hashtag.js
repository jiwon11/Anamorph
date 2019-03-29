module.exports = (sequelize, DataTypes) => (
    sequelize.define('hashtag', {
        title : {
            type : DataTypes.STRING(99),
            allowNull : true,
            unique : true,
        }, 
    }, {
        timestamps : true,
        paranoid : true,
        timezone: 'utc',
    })
);