//메인 화면(타임라인 역할)
//원래는 next에서는 import React from 'react';를 해주지 않아도 됨. 알아서 처리해주기 때문에.
//그러나 {useState, useEffect} 같은 것을 사용해야 하기 때문에 아예 안 쓸 수는 없다.
import React from 'react';
import { Form, Input, Button, Card, Icon, Avatar } from 'antd';
//import Link from 'next/link';

const dummy = {
    isLoggedIn: true,
    imagePaths: [],
    mainPosts: [{
        User: {
            id: 1,
            nickname: '둘리', 
        },
        content: '첫 번째 게시물',
        img: 'https://cphoto.asiae.co.kr/listimglink/6/2013051007205672589_1.jpg',
    }],
}

const Home = () => {
    return (
        <>
            <div>
                {dummy.isLoggedIn && <Form style={{ marginBottom: '20px' }} encType="mutipart/form-data">
                    <Input.TextArea maxLength={140} placeholder="어떤 신기한 일이 있었나요?" />
                    <div>
                        <input type="file" multiple hidden />
                        <Button>이미지 업로드</Button>
                        <Button type="primary" style={{ float: 'right' }} htmlType="submit">쨱쨱</Button>
                    </div>
                    <div>
                        {/* 이미지 미리보기 */}
                        {dummy.imagePaths.map((v, i) => {
                            return (
                                <div key={v} style={{ display: 'inline-block' }}>
                                    <img src={'http://localhost:3065/' + v} style={{ width: '200px'}} alt={v} />
                                    <div>
                                        <Button>제거</Button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </Form>}
                {dummy.mainPosts.map((c) => {
                    return (
                        <Card
                            key={+c.createAt}
                            cover={c.img && <img alt="example" src={c.img} />}
                            actions={[
                                <Icon type="retweet" key="retweet" />,
                                <Icon type="heart" key="heart" />,
                                <Icon type="message" key="message" />,
                                <Icon type="ellipsis" key="ellipsis" />,
                            ]}
                            extra={<Button>팔로우</Button>}
                        >
                            <Card.Meta
                                avatar={<Avatar>{c.User.nickname[0]}</Avatar>}
                                title={c.User.nickname}
                                description={c.content}
                            />
                        </Card>
                    )
                })}
            </div>
        </>
    )
};

export default Home;