module.exports = (sequelize, DataTypes) => {
    return sequelize.define('model', {
        name : {
            type:DataTypes.STRING(20),
            allowNull : false,
            unique : true,
        },
    }, {
        timestamps : true,
    });
};