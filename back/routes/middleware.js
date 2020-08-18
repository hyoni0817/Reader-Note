//로그인 여부 체크
exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        next(); 
    } else {
        res.status(401).send('로그인이 필요합니다.'); 
    }
};

//로그인 안한 사용자 체크(회원가입 및 로그인한 페이지에 이미 로그인한 사용자 접근 불가)
exports.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        next(); 
    } else {
        res.status(401).send('로그인이 필요합니다.'); 
    }
};

//포스트 존재 여부 확인하기
exports.isPostExist = async (req, res, next) => {
    const db = require('../models');
    const post = await db.Post.findOne({ where: {id: req.params.id}});

    if (post) {
        res.locals.post = post; //다음 미들웨어로 변수 전달
        console.log("middleware res.locals:", res.locals);

        next();
    } else {
        return res.status(404).send('포스트가 존재하지 않습니다.');
    }
}