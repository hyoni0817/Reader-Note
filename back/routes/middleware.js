//로그인 여부 체크
exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticate()) {
        next(); 
    } else {
        res.status(401).send('로그인이 필요합니다.'); 
    }
};

//로그인 안한 사용자 체크(회원가입 및 로그인한 페이지에 이미 로그인한 사용자 접근 불가)
exports.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticate()) {
        next(); 
    } else {
        res.status(401).send('로그인이 필요합니다.'); 
    }
};