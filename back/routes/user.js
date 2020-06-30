const express = require('express');
const router = express.Router();

router.get('/', (req, res) => { //app.use('/api/user', userAPIRouter)의 /api/user와 /가 합쳐져서 /api/user/로 된다. 

});
router.post('/', (req, res) => {

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