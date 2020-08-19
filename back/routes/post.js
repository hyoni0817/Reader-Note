const express = require('express');
const multer = require('multer'); //form-data는 bodypaser로 처리하기 힘들어서 multer를 사용
const path = require('path');

const db = require('../models');
const { isLoggedIn, isPostExist } = require('./middleware');

const router = express.Router();

const upload = multer({
    //파일 업로드에 대한 설정(꼭 이미지가 아니더라도 파일이나 동영상에도 이와 같은 설정이 사용됨)
    storage: multer.diskStorage({
        
        destination(req, file, done) {
            //파일 저장 위치
            done(null, 'uploads'); 
        },
        filename(req, file, done){
            //파일명 만들기

            //확장자 추출하기
            const ext = path.extname(file.originalname); 

            //확장자를 제외한 이름 추출
            const basename = path.basename(file.originalname, ext); 
            
            done(null, basename + new Date().valueOf() + ext); 
        },
    }),
    //파일 사이즈 제한
    limits: { fileSize: 20 * 1024 * 1024 }
});

router.post('/', isLoggedIn, upload.none(), async (req, res, next) => { // POST /api/post, 게시글 등록시 이미지는 없고 이미지 주소만 있는데 이 주소들은 텍스트이기 때문에 이미지 자체가 사용되지 않아서 upload 미들웨어는 none이 사용됨.
    try {

        const hashtags = req.body.content.match(/#[^\s]+/g); 
        const newPost = await db.Post.create({
            content: req.body.content, 
            UserId: req.user.id, 
        })
        if (hashtags) {
            const result = await Promise.all(hashtags.map(tag => db.Hashtag.findOrCreate({ 
                where: { name: tag.slice(1).toLowerCase() } 
            }))); 
            console.log(result);
            await newPost.addHashtags(result.map( r => r[0] )); 
        }
        if (req.body.image) { // 이미지 주소를 여러개 올리면 image: [주소1, 주소2] 형태
            if(Array.isArray(req.body.image)) { 
                const images = await Promise.all(req.body.image.map((image) => { 
                    return db.Image.create({ src : image }); //이미지 생성
                }));
                await newPost.addImages(images); 
            } else { //이미지를 하나만 올리면 image: 주소1 형태
                const image = await db.Image.create({ src: req.body.image});
                await newPost.addImage(image); 
            }
        }
        const fullPost = await db.Post.findOne({ 
            where: { id: newPost.id },
            include: [{
                model: db.User, 
            }, {
                model: db.Image,
            }]
        }) 
        res.json(fullPost);
    } catch (e) {
        console.error(e);
        next(e);
    }
});

router.post('/images', upload.array('image'), (req, res) => { 
    res.json(req.files.map(v => v.filename)); 
});

router.get('/:id/comments', isPostExist, async (req, res, next) => { //게시글의 댓글 가져오기
    try {
        const comments = await db.Comment.findAll({
            where: {
                PostId: req.params.id,
            },
            order: [['createdAt', 'ASC']], 
            include: [{
                model: db.User,
                attributes: ['id', 'nickname'],
            }],
        });
        res.json(comments);
    } catch (e) {
        console.log(e);
        next(e);
    }
});

router.post('/:id/comment', isLoggedIn, isPostExist, async (req, res, next) => { //POST ex) /api/post/3/comment
    try {
        const post = res.locals.post;
        const newComment = await db.Comment.create({
            PostId: post.id,
            UserId: req.user.id,
            content: req.body.content,
        });
        await post.addComment(newComment.id); 
        const comment = await db.Comment.findOne({ 
            where: {
                id: newComment.id,
            }, 
            include: [{
                model: db.User,
                attribute: ['id', 'nickname'],
            }], 
        });
        return res.json(comment);
    } catch (e) {
        console.error(e);
        return next(e);
    }
});

router.post('/:id/like', isLoggedIn, isPostExist, async(req, res, next) => {
    try {
        const post = res.locals.post;
        await post.addLiker(req.user.id); //시퀄라이즈의 associate를 보고 add, get, set를 시퀄라이즈가 알아서 추가해줌.
        res.json({ userId: req.user.id});
    } catch (e) {
        console.error(e);
        next(e);
    }
});

router.delete('/:id/like', isLoggedIn, isPostExist, async (req, res, next) => {
    try {
        const post = res.locals.post;
        await post.removeLiker(req.user.id);
        res.json({ userId: req.user.id});
    } catch (e) {
        console.error(e);
        next(e);
    }
});

router.post('/:id/retweet', isLoggedIn, isPostExist, async (req, res, next) => {
    try {
        const post = await db.Post.findOne({
            where: { id: req.params.id },
            include: [{
                model: db.Post,
                as: 'Retweet',
            }],
        });
        if (req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id)) {
            //(post.Retweet && post.Retweet.UserId === req.user.id) 추가 이유
            //남이 이미 리트윗한 것에 대한 것도 검사를 해줘야 내 게시글을 다시 리트윗하지않게 됨.
            return res.status(403).send('자신의 글은 리트윗할 수 없습니다.');
        }
        
        //post.Id는 원본 게시글을 리트윗하는 경우이고 post.RetweetId는 리트윗된 게시글을 리트윗하는 경우이다.
        const retweetTargetId = post.RetweetId || post.id; 
        const exPost = await db.Post.findOne({
            where: {
                UserId: req.user.id,
                RetweetId: retweetTargetId,
            } //자기가 이미 리트윗을 했는지 체크
        })

        if (exPost) {
            return res.status(403).send('이미 리트윗했습니다.');
        }
        const retweet = await db.Post.create({
            UserId: req.user.id,
            RetweetId: retweetTargetId,
            content: 'retweet',//Post DB를 생성할 때 contents가 allowNull이 false(null 허용 안함)라서 'retweet'같은 글을 넣어주긴 해야한다.
        });

        //리트윗한 게시글에 내 게시글말고 남의 게시글도 함께 가져와줘야 한다. 
        const retweetWithPrevPost = await db.Post.findOne({
            where: { id: retweet.id },
            include: [{
                //작성자 정보
                model: db.User, 
                attributes: ['id', 'nickname'], 
            }, {
                //리트윗한 게시글 include
                model: db.Post,
                as: 'Retweet',
                include: [{
                    model: db.User, //리트윗한 글의 작성자
                    attributes: ['id', 'nickname'],
                }, {
                    model: db.Image, //리트윗한 글의 이미지
                }],
            }],
        });
        res.json(retweetWithPrevPost);
    } catch (e) {
        console.error(e);
        next(e);
    }
});

module.exports = router;