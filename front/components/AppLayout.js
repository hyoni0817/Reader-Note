import React from 'react';
import Link from 'next/link';
import { Menu, Input, Button } from 'antd';

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
            <Link href="/signup"><a><Button>회원 가입</Button></a></Link>
            {children}
        </div>
    )
}

export default AppLayout;