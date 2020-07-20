const express = require('express');
const next = require('next');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dotenv = require('dotenv');

const dev = process.env.NODE_ENV !== 'production'; //개발모드
const prod = process.env.NODE_ENV === 'production'; //배포모드


//express랑 next를 연결하는 방법
const app = next({ dev });
const handle = app.getRequestHandler(); //get요청 처리기
dotenv.config();

app.prepare().then(() => {
    const server = express();

    server.use(morgan('dev'));
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

    server.get('*', (req, res) => { 
        return handle(req, res); 
    });

    server.listen(3060, () => {
        console.log('next+express running on port 3060');
    });
})