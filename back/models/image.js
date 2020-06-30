const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define('Image', {
        src: { // s3 저장 (이미지 경로)
            type: DataTypes.STRING(200),
            allowNull: false,
        },
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });
    Image.associate = (db) => {
        db.Image.belongsTo(db.Post);
    };
    return Image;
}