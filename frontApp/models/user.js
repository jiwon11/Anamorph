module.exports = (sequelize,DataTypes) => (
    sequelize.define('user', {
        email : {
            type : DataTypes.STRING(40),
            allowNull : false ,
            unique : true,
        },
        username : {
            type : DataTypes.STRING(15),
            allowNull : false,
            unique : true,
        },
        password : {
            type : DataTypes.STRING(100),
            allowNull : true,
        },
        img : {
            type : DataTypes.STRING(200),
            allowNull : false,
        },
    }, {
            timestamps : true,
            paranoid : true,
            timezone: 'utc',
    })
);