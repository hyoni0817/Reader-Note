const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../models'); 
const passport = require('passport');
const { isLoggedIn } = require('./middleware');

//const passport = require('../passport');

const router = express.Router();

router.get('/', isLoggedIn, (req, res) => { //app.use('/api/user', userAPIRouter)의 /api/user와 /가 합쳐져서 /api/user/로 된다. 
    const user = Object.assign({}, req.user);
    delete user.password;
    return res.json(req.user);
});
router.post('/', async (req, res, next) => { // POST /api/user 회원가입
    try {
        const exUser = await db.User.findOne({ //기존에 가입한 유저가 있는지 찾음
            where: {
                userId: req.body.userId,
            }
        });
        if (exUser) {
            return res.status(403).send('이미 사용중인 아이디입니다.'); 
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12); //salt는 10~13 사이로(컴퓨터 성능에 맞게 조절)
        
        const newUser = await db.User.create({ //생성. 즉, db에 저장
            nickname: req.body.nickname,
            userId: req.body.userId,
            password: hashedPassword,
        });
        console.log(newUser);
        return res.status(200).json(newUser); 
    } catch (e) {
        console.error(e);
        return next(e); 
    }
});
router.get('/:id', async (req, res, next) => { //남의 정보 가져오는 것 ex)/api/user/3(아이디가 3인 유저 정보를 가져오겠다는 의미), id 공간에 동적으로 변할 수 있는 것을 넣어준다. 
    try {
        const user = await db.User.findOne({
            where: { id: parseInt(req.params.id, 10)},
            include: [{
                model: db.Post,
                as: 'Posts',
                attributes: ['id'],
            }, {
                model: db.User,
                as: 'Followings',
                attributes: ['id'],
            }, {
                model: db.User,
                as: 'Followers',
                attributes: ['id'],
            }],
            attributes: ['id', 'nickname'],
        });
        
        const jsonUser = user.toJSON(); 
        jsonUser.Posts = jsonUser.Posts ? jsonUser.Posts.length : 0;
        jsonUser.Followings = jsonUser.Followings ? jsonUser.Followings.length : 0;
        jsonUser.Followers = jsonUser.Followers ? jsonUser.Followers.length : 0;
        res.json(jsonUser);
    } catch (e) {
        console.error(e);
        next(e);
    }
});
router.post('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.send('logout 성공');
});

router.post('/login', (req, res, next) => { //POST /api/user/login
    passport.authenticate('local', (err, user, info) => { 
        if(err) {
            console.error(err);
            next(err); 
        }

        if(info) {
            return res.status(401).send(info.reason); 
        }
        return req.login(user, async (loginErr) => { 
            try {
                if(loginErr) {
                    return next(loginErr); 
                } 
                const fullUser = await db.User.findOne({
                    where: { id: user.id },
                    include: [{ 
                        model: db.Post,
                        as: 'Posts', 
                        attributes: ['id'], 
                    }, {
                        model: db.User,
                        as: 'Followings',
                        attributes: ['id'],
                    }, {
                        model: db.User,
                        as: 'Followers',
                        attributes: ['id'],
                    }],
                    attributes: ['id', 'nickname', 'userid'], 
                });
                console.log(fullUser);
                return res.json(fullUser); 
            } catch (e) {
                next(e);
            }
        }) 
    })(req, res, next);

});

router.get('/:id/followings', isLoggedIn, async (req, res, next) => { // /api/user/:id/followings 내가 팔로잉하고 있는 사람들
    try {
        const user = await db.User.findOne({
            where: { id: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0 }, //id가 0일 경우 현재 로그인한 사용자의 팔로우, 팔로워 가져오기로 함. 현재 로그인한 사용자의 정보는 req.user에 저장되어 있다.
        });
        const followings = await user.getFollowings({ //시퀄라이즈에 옵션을 줄 수 있다.
            attributes: ['id', 'nickname'], //비밀번호를 가져오지 않게 하기 위해서 속성을 따로 선택해서 가져온다.
            limit: parseInt(req.query.limit, 10),
            offset: parseInt(req.query.offset, 10),
        });
        res.json(followings);
    } catch (e) {
        console.error(e);
        next(e);
    }
});

router.get('/:id/followers', isLoggedIn, async (req, res, next) => { // /api/user/:id/followers 나를 팔로워하고 있는 사람들
    try {
        const user = await db.User.findOne({
            where: { id: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0}, //id가 남의 아이디면 그사람의 팔로잉 목록을 가져오고, 0이면 내 팔로워 목록을 가져온다. 
        }); 
        const followers = await user.getFollowers({ //시퀄라이즈에 옵션을 줄 수 있다.
            attributes: ['id', 'nickname'], //비밀번호를 가져오지 않게 하기 위해서 속성을 따로 선택해서 가져온다.
            limit: parseInt(req.query.limit, 10),
            offset: parseInt(req.query.offset, 10),
        });
        res.json(followers);
    } catch (e) {
        console.error(e);
        next(e);
    }
});

router.delete('/:id/follower', isLoggedIn, async (req, res, next) => {
    try {
        const me = await db.User.findOne({ //'나'가 아닌 대상 사용자를 찾음.
            where: { id: req.user.id },
        });
        await me.removeFollower(req.params.id); //'나'와 대상(req.params.id)의 경계를 끊는 것.
        res.send(req.params.id);
    } catch (e) {
        console.error(e);
        next(e);
    }
});

router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
    try {
        const me = await db.User.findOne({
            where: { id: req.user.id},
        });
        await me.addFollowing(req.params.id); 
        res.send(req.params.id);
    } catch (e) {
        console.error(e);
        next(e);
    }
});

router.delete('/:id/follow', isLoggedIn, async (req, res, next) => {
    try {
        const me = await db.User.findOne({
            where: { id: req.user.id },
        });
        await me.removeFollowing(req.params.id);
        res.send(req.params.id);
    } catch (e) {
        console.error(e);
        next(e);
    }
});

//app.get(...) 과 같은 이부분은 router이고 (req, res) => {...}은 controller라고 한다. 
router.get('/:id/posts', async (req, res) => {
    try {
        const posts = await db.Post.findAll({
            where: {
                UserId: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0, //작성자는 UserId 컬럼에 있다. 남의 아이디가 들어있으면 그 사람의 게시글을 가져오고, 만약에 id가 0이면 내 게시글을 가져옴.
                RetweetId: null, //리트윗한 게시글 빼고 내가쓴 게시글만 불러온다.
            },
            include: [{
                model: db.User,
                attributes: ['id', 'nickname'], //게시글 작성자를 불러올때는 항상 attributes로 가져온다(비밀번호를 제외시키고 가져와야하기 때문)
            }, {
                model: db.Image,
            }, {
                model: db.User, //게시글 좋아요 누른 사람들 목록 include 
                through: 'Like',
                as: 'Likers', 
                attributes: ['id'],
            }],
        });
        res.json(posts);
    } catch (e) {
        console.error(e);
        next(e);
    }
});

router.patch('/nickname', isLoggedIn, async (req, res, next) => {
    console.log(req.body.nickname);
    try {
        await db.User.update({
            nickname: req.body.nickname,
        }, {
            where: { id: req.user.id }
        });
        res.send(req.body.nickname);
    } catch (e) {
        console.error(e);
        next(e);   
    }
})

module.exports = router;