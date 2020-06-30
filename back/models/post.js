module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', { 
        content: {
            type: DataTypes.TEXT, 
            allowNull: false,
        },
    }, {
        charset: 'utf8mb4', 
        collate: 'utf8mb4_general_ci',
        //tableName: 'posts', //직접 테이블 명을 입력할 수도 있다. 
    });
    Post.associate = (db) => {
        db.Post.belongsTo(db.User); 
        db.Post.hasMany(db.Comment); 
        db.Post.hasMany(db.Image); 
        db.Post.belongsTo(db.Post, {as: 'Retweet'});
        db.Post.belongsToMany(db.Hashtag, {through: 'PostHashtag'});
        db.Post.belongsToMany(db.User, {through: 'Like', as: 'Likers'});
    };
    return Post;
}