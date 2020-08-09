const express = require('express');
const db = require('../models');

const router = express.Router();

router.get('/:tag', async (req, res, next) => {
    try {
        const posts = await db.Post.findAll({
            include: [{
                model: db.Hashtag,
                where: { name: decodeURIComponent(req.params.tag) }, 
            }, {
                model: db.User,
                attributes: ['id', 'nickname'],
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

module.exports = router;