module.exports = (sequelize,DataTypes) => (
    sequelize.define('comment', {
        comment : {
            type : DataTypes.STRING(100),
            allowNull : false ,
        },
    }, {
            timestamps : true,
            paranoid : true,
            timezone: 'utc',
    })
);