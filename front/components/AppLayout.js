import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import LoginForm from './LoginForm';

import { Menu, Input, Row, Col, Card, Avatar } from 'antd';

const dummy = {
    nickname: '피카츄',
    Post: [],
    Followings: [],
    Followers: [],
    isLoggedIn: false,
};

const AppLayout = ({children}) => {
    return (
        <div>
            <Menu mode="horizontal">
                <Menu.Item key="home"><Link href="/"><a>Reder Note</a></Link></Menu.Item>
                <Menu.Item key="profile"><Link href="/profile"><a>Profile</a></Link></Menu.Item>
                <Menu.Item key="search">
                    <Input.Search enterButton style={{verticalAlign: 'middle'}} />
                </Menu.Item>
            </Menu>
            <Row gutter={8}>
                <Col xs={24} md={6}>
                    { dummy.isLoggedIn ? <Card
                        actions={[
                            <div key="twit">쨱쨱<br />{dummy.Post.length}</div>,
                            <div key="following">팔로잉<br />{dummy.Followings.length}</div>,
                            <div key="follower">팔로워<br />{dummy.Followers.length}</div>
                        ]}
                    >
                        <Card.Meta
                            avatar={<Avatar>{dummy.nickname[0]}</Avatar>}
                            title={dummy.nickname}
                        />
                    </Card>
                        :
                        <LoginForm />
                    }
                </Col> 
                <Col xs={24} md={12}>
                    {children}    
                </Col> 
                <Col xs={24} md={6}>
                
                </Col> 
            </Row>
        </div>
    )
}

AppLayout.propTypes = {
    children: PropTypes.node,
}
export default AppLayout;