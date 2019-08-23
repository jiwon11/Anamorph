module.exports = (sequelize, DataTypes) => {
    return sequelize.define('post', {
        title : {
            type:DataTypes.STRING(100),
            allowNull : false,
            unique : false,
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
        },
        preview_img : {
            type:DataTypes.STRING(100),
            allowNull : false,
            unique : true,
        }
    }, {
        timestamps : true,
        timezone: 'utc',
    });
};