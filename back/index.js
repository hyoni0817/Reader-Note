const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const db = require('./models'); //index는 생략 가능함.
const userAPIRouter = require('./routes/user');
const postAPIRouter = require('./routes/post');
const postsAPIRouter = require('./routes/posts');

const app = express();
db.sequelize.sync();//알아서 테이블을 생성해준다. 

app.use(morgan('dev')); //요청 들어오는 것에 대한 로그를 남기기 위해 사용

//req.body를 사용하기 위해 추가해야하는 아래 코드 2줄
app.use(express.json()); //json 형식의 본문 처리
app.use(express.urlencoded({ extended: true })); //form으로 넘어온 데이터 처리
app.use(cors()); 

//API는 다른 서비스가 내 서비스의 기능을 실행할 수 있게 열어둔 창구
app.use('/api/user', userAPIRouter);
app.use('/api/post', postAPIRouter);
app.use('/api/posts', postsAPIRouter);

app.listen(3065, () => {
    console.log('server is running on localhost:3065');
});