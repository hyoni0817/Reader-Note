import React, { useEffect } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import LoginForm from './LoginForm';
import UserProfile from '../components/UserProfile';
import { Menu, Input, Row, Col } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { LOAD_USER_REQUEST } from '../reducers/user';

const AppLayout = ({children}) => {
    const { me } = useSelector(state => state.user);

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
                    { me 
                        ? <UserProfile />: <LoginForm />
                    }
                </Col> 
                <Col xs={24} md={12}>
                    {children}    
                </Col> 
                <Col xs={24} md={6}>
                    <a href="https://hyoni0817.github.io/My-portfolio/" rel="noreferrer" target="_blank">Made by hyoni</a>
                    {/* 외부 Url를 불러 올때는 next의 Link를 사용하지 않는다. */}
                </Col> 
            </Row>
        </div>
    )
}

AppLayout.propTypes = {
    children: PropTypes.node,
}
export default AppLayout;