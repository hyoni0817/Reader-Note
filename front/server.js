const express = require('express');
const next = require('next');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dotenv = require('dotenv');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production'; //개발모드
const prod = process.env.NODE_ENV === 'production'; //배포모드


//express랑 next를 연결하는 방법
const app = next({ dev });
const handle = app.getRequestHandler(); //get요청 처리기
dotenv.config();

app.prepare().then(() => {
    const server = express();

    server.use(morgan('dev'));
    server.use('/', express.static(path.join(__dirname, 'public')));//백엔드 파일에서 정적 파일을 제공했던 것 처럼 작성하면 됨. 이 코드 부분이 서버쪽 주소다. 
    server.use(express.json());
    server.use(express.urlencoded({ extended: true}));
    server.use(cookieParser(process.env.COOKIE_SECRET)); 
    server.use(expressSession({
        resave: false,
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET,
        cookie: {
            httpOnly: true,
            secure: false,
        },
    }));
    
    server.get('/post/:id', (req, res) => {
        return app.render(req, res, '/post', { id: req.params.id });
    });

    server.get('/hashtag/:tag', (req, res) => {
        return app.render(req, res, '/hashtag', { tag: req.params.tag }); 
    });

    server.get('/user/:id', (req, res) => {
        return app.render(req, res, '/user', { id: req.params.id });
    });

    server.get('*', (req, res) => { 
        return handle(req, res); 
    });

    server.listen(prod ? process.env.PORT : 3060, () => {
        console.log(`server is running on ${process.env.PORT}`);
    });
})