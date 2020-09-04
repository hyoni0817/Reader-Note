const express = require('express');

const router = express.Router();
const db = require('../models');

router.get('/', async (req, res, next) => { //GET /api/posts 
    try {   
        let where = {};
        if (parseInt(req.query.lastId, 10)) { //lastId가 있는 경우
            where = { //lastId보다 작은 값을 가진 id들을 가져와야함.
                id: {
                    [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10), //lt는 less than 이라는 뜻. 해당 코드줄의 뜻은 parseInt(req.query.lastId, 10) 보다 작은 것을 갖고 온다는 것. 
                }
            }
        } 
        // lastId가 0인 경우 처음부터 갖고 와야하기 때문에 조건문이 필요 없다. 
       const posts = await db.Post.findAll({
            where,
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
            }, {
                model: db.Post,
                as: 'Retweet',
                include: [{
                    model: db.User,
                    attributes: ['id', 'nickname'],
                }, {
                    model: db.Image,
                }]
            }],
            order: [['createdAt', 'DESC']], 
            limit: parseInt(req.query.limit, 10),
       })
       res.json(posts);
    } catch (e) {
        console.error(e);
        next(e);
    }
});

module.exports = router;