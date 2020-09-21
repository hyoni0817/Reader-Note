import React, { useCallback } from 'react';
import Link from 'next/link';
import { Card, Avatar, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { logoutRequestAction } from '../reducers/user';

const UserProfile = () => {
    const { me } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const onLogout = useCallback(() => {
        dispatch(logoutRequestAction);
    }, []); //useCallback으로 감싸는 이유는 자식 컴포넌트에 함수가 props로 전달하기 때문이다. 
    return (
        <Card
            actions={[
                <Link href="/profile" key="twit" prefetch><a><div>쨱쨱<br />{me.Posts.length}</div></a></Link>,
                <Link href="/profile" key="following" prefetch><a><div>팔로잉<br />{me.Followings.length}</div></a></Link>,
                <Link href="/profile" key="follower" prefetch><a><div>팔로워<br />{me.Followers.length}</div></a></Link>
            ]}
        >
            <Card.Meta
                avatar={<Avatar>{me.nickname[0]}</Avatar>}
                title={me.nickname}
            />
            <Button onClick={onLogout}>로그아웃</Button>
        </Card>
    );
};

export default UserProfile;
