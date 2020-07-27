const express = require('express');
const db = require('../models');

const router = express.Router();

router.post('/', async (req, res, next) => { // POST /api/post
    try {
        console.log("aa:", req.user.id, req.body);
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

router.post('/images', (req, res) => {

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

router.post('/:id/comment', async (req, res, next) => { //POST ex) /api/post/3/comment
    try {
        // 로그인한 사용자만 댓글 달기
        if(!req.user) { 
            res.status(401).send('로그인이 필요합니다.');
        }

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