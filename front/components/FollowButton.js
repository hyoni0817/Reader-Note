import React from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const FollowButton = ({post, onUnfollow, onFollow}) => {
    const { me } = useSelector(state => state.user);
    return !me || post.User.id === me.id //로그인 안했을 때, 자신의 게시글일 때 follow, unfollow 버튼 안뜸
        ? null
        : me.Followings && me.Followings.find(v => v.id === post.User.id) //내 팔로잉 목록에 작성자의 id가 존재한다면 팔로우 취소버튼 필요
            ? <Button onClick={onUnfollow(post.User.id)}>언팔로우</Button>
            : <Button onClick={onFollow(post.User.id)}>팔로우</Button>
}

FollowButton.propTypes = {
    post: PropTypes.object.isRequired,
    onUnfollow: PropTypes.func.isRequired,
    onFollow: PropTypes.func.isRequired,
}

export default FollowButton;