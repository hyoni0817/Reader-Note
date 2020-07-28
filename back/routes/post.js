const express = require('express');
const multer = require('multer'); //form-data는 bodypaser로 처리하기 힘들어서 multer를 사용
const path = require('path');

const db = require('../models');
const { isLoggedIn } = require('./middleware');

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

router.post('/', isLoggedIn, async (req, res, next) => { // POST /api/post
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

        const fullPost = await db.Post.findOne({ 
            where: { id: newPost.id },
            include: [{
                model: db.User, 
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

router.get('/:id/comments', async (req, res, next) => { //게시글의 댓글 가져오기
    try {
        const post = await db.Post.findOne({ where: { id: req.params.id } });
        if (!post) {
            return res.status(404).send('포스트가 존재하지 않습니다.'); 
        }
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

router.post('/:id/comment', isLoggedIn, async (req, res, next) => { //POST ex) /api/post/3/comment
    try {
        const post = await db.Post.findOne({ where: { id: req.params.id } });
        if (!post) {
            return res.status(404).send('포스트가 존재하지 않습니다.'); 
        }

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

module.exports = router;