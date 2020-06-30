const express = require('express');

const db = require('./models'); //index는 생략 가능함.

const app = express();
db.sequelize.sync();//알아서 테이블을 생성해준다. 

//메인 페이지
app.get('/', (req, res) => {
    res.send('Hello, server');
});

app.get('/about', (req, res) => {
    res.send('Hello, about');
})

app.listen(3065, () => {
    console.log('server is running on localhost:3065');
});