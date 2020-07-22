//백엔드의 중앙 통제실
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');

const passportConfig = require('./passport');
const db = require('./models'); //index는 생략 가능함.
const userAPIRouter = require('./routes/user');
const postAPIRouter = require('./routes/post');
const postsAPIRouter = require('./routes/posts');
const hashtagAPIRouter = require('./routes/hashtag');

dotenv.config(); //.env 파일을 불러온다
const app = express();
db.sequelize.sync();//알아서 테이블을 생성해준다. 
passportConfig();

app.use(morgan('dev')); //요청 들어오는 것에 대한 로그를 남기기 위해 사용

//req.body를 사용하기 위해 추가해야하는 아래 코드 2줄
app.use(express.json()); //json 형식의 본문 처리
app.use(express.urlencoded({ extended: true })); //form으로 넘어온 데이터 처리
app.use(cors({
    origin: 'http://localhost:3060', 
    credentials: true,
})); 
app.use(cookieParser(process.env.COOKIE_SECRET)); 
app.use(expressSession({ 
    resave: false, 
    saveUninitialized: false, 
    
    secret: process.env.COOKIE_SECRET, 
    cookie: {
        httpOnly: true, 
        secure: false, 
    }, 
    name: 'gkfkal'
}));
app.use(passport.initialize());
app.use(passport.session()); 

//API는 다른 서비스가 내 서비스의 기능을 실행할 수 있게 열어둔 창구
app.use('/api/user', userAPIRouter);
app.use('/api/post', postAPIRouter);
app.use('/api/posts', postsAPIRouter);
app.use('/api/hashtag', hashtagAPIRouter);

app.listen(3065, () => {
    console.log('server is running on localhost:3065');
});