module.exports = (sequelize, DataTypes) => (
    sequelize.define('page', {
        title : {
            type : DataTypes.STRING(140),
            allowNull : false,
        },
        content : {
            type : DataTypes.STRING(140),
            allowNull : false,
        },
        img : {
            type : DataTypes.STRING(200),
            allowNull : true,
        },
    }, {
        timestamps : true,
        paranoid : true,
        timezone: 'utc',
    })
);