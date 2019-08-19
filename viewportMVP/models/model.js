module.exports = (sequelize, DataTypes) => {
    return sequelize.define('model', {
        gltf_filename : {
            type:DataTypes.STRING(100),
            allowNull : false,
            unique : true,
        },
        backgroundImg_filename : {
            type:DataTypes.STRING(100),
            allowNull : false,
            unique : true,
        }
    }, {
        timestamps : true,
    });
};