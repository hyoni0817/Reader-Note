const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../models'); 

const router = express.Router();

router.get('/', (req, res) => { //app.use('/api/user', userAPIRouter)의 /api/user와 /가 합쳐져서 /api/user/로 된다. 

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
router.get('/:id', (req, res) => { //남의 정보 가져오는 것 ex)/api/user/3(아이디가 3인 유저 정보를 가져오겠다는 의미)

});
router.post('/logout', (req, res) => {

});
router.post('/login', (req, res) => {

});
router.get('/:id/follow', (req, res) => {

});
router.post('/:id/follow', (req, res) => {

});
router.delete('/:id/follow', (req, res) => {

});
router.delete('/:id/follower', (req, res) => {

});

//app.get(...) 과 같은 이부분은 router이고 (req, res) => {...}은 controller라고 한다. 
router.get('/:id/posts', (req, res) => {

});

module.exports = router;