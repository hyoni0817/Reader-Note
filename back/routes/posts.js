const express = require('express');

const router = express.Router();
const db = require('../models');

router.get('/', async (req, res, next) => { //GET /api/posts 
    try {   
       const posts = await db.Post.findAll({
            include: [{
                model: db.User,
                attributes: ['id', 'nickname'], //게시글 작성자 include
            }, {
                model: db.Image,
            }, {
                model: db.User, //게시글 좋아요 누른 사람들 목록 include 
                through: 'Like',
                as: 'Likers', 
                attributes: ['id'],
            }],
            order: [['createdAt', 'DESC']], 
       })
       res.json(posts);
    } catch (e) {
        console.error(e);
        next(e);
    }
});

module.exports = router;