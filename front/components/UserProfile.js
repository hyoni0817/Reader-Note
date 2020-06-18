import React, { useCallback } from 'react';
import { Card, Avatar, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { logoutAction } from '../reducers/user';

const UserProfile = () => {
    const { user } = useSelector(state => state.user);
    const dispatch = useDispatch();
    
    const onLogout = useCallback(() => {
        dispatch(logoutAction);
    }, []); //useCallback으로 감싸는 이유는 자식 컴포넌트에 함수가 props로 전달하기 때문이다. 
    return (
        <Card
            actions={[
                <div key="twit">쨱쨱<br />{user.Post.length}</div>,
                <div key="following">팔로잉<br />{user.Followings.length}</div>,
                <div key="follower">팔로워<br />{user.Followers.length}</div>
            ]}
        >
            <Card.Meta
                avatar={<Avatar>{user.nickname[0]}</Avatar>}
                title={user.nickname}
            />
            <Button onClick={onLogout}>로그아웃</Button>
        </Card>
    );
};

export default UserProfile;
