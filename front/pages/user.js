import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Card } from 'antd';
import { LOAD_USER_POSTS_REQUEST } from '../reducers/post';
import { LOAD_USER_REQUEST } from '../reducers/user';
import PostCard from '../components/PostCard';

const User = () => {
    const dispatch = useDispatch();
    const { mainPosts } = useSelector(state => state.post);
    const { userInfo } = useSelector(state => state.user);

    return (
        <div>
            {/* userInfo는 남의 정보 */}
            {userInfo
                ? <Card
                    actions={[
                        <div key="twit">쨱쨱<br />{userInfo.Posts}</div>,
                        <div key="following">팔로잉<br />{userInfo.Followings}</div>,
                        <div key="follower">팔로워<br />{userInfo.Followers}</div>
                    ]}
                >
                    <Card.Meta 
                        avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
                        title={userInfo.nickname}
                    />
                </Card>   
                : null} 
            {mainPosts.map( c => (
                <PostCard key={+c.createdAt} post={c} />
            ))}
        </div>
    );
};

User.getInitialProps = async (context) => { 
    const id = parseInt(context.query.id, 10);
    console.log('hashtag getInitialProps', id);
    context.store.dispatch({
        type: LOAD_USER_REQUEST,
        data: id,
    });
    context.store.dispatch({
        type: LOAD_USER_POSTS_REQUEST,
        data: id,
    });
    return { id };
};

export default User;