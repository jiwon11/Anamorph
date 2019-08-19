module.exports = (sequelize, DataTypes) => {
    return sequelize.define('model', {
        title : {
            type:DataTypes.STRING(100),
            allowNull : false,
            unique : true,
        },
        description : {
            type:DataTypes.STRING(300),
            allowNull : false,
            unique : true,
        },
        gltf_file : {
            type:DataTypes.STRING(100),
            allowNull : false,
            unique : true,
        }
    }, {
        timestamps : true,
    });
};