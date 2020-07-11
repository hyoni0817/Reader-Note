//로그인 전략(passport는 전략이라는 시스템을 사용)
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const db = require('../models');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'userId', 
        passwordField: 'password',
        //위 둘의 userId 와 password는 req.body에 넣어주는 것
    }, async (userId, password, done) => { 
        //이 안에 로그인 전략 수립
        //어떤 사람을 로그인 시킬지를 적어줌.
        try {
            const user = await db.User.findOne({ raw: true, where: { userId }}) //userId가 있는 사람을 찾아본다.(기존 사용자인지 체크) 
            //만약 존재하지 않다면
            if (!user) {
                return done(null, false, { reason: '존재하지 않는 사용자입니다!' });
            }
            //사용자가 존재한다면
            const result = await bcrypt.compare(password, user.password); 
            if (result) {
                return done(null, user); 
            }
            //실패한 경우
            return done(null, false, { reason: '비밀번호가 틀립니다.' });
        } catch(e) {
            console.error(e);
            return done(e); 
        }
    })) 
};
