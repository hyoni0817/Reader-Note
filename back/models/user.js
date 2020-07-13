module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        nickname: {
            type: DataTypes.STRING(20), //20글자 이하
            allowNull: false, //false는 필수, true는 선택
        },
        userId: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true, //고유한 값
        },
        password: {
            type: DataTypes.STRING(100), //100글자 이하
            allowNull: false,
        },
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        //charset, collate 두 개를 설정해줘야 한글이 저장됨
    });

    //모델간 관계 설정
    User.associate = (db) => {
        db.User.hasMany(db.Post, {as: 'Posts'}); 
        db.User.hasMany(db.Comment);
        db.User.belongsToMany(db.Post, {through: 'Like', as: 'Liked'});
        db.User.belongsToMany(db.User, {through:'Follow', as: 'Followers'});
        db.User.belongsToMany(db.User, {through:'Follow', as: 'Followings'});
    };

    return User;
};