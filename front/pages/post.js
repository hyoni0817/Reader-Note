//개별 포스트를 하나씩 보여줌(게시물 하나하나를 자세히 볼 수 있는 페이지)
import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { LOAD_POST_REQUEST } from '../reducers/post';

const Post =  ({ id }) => {
    const { singlePost } = useSelector(state => state.post);
    return (
        <>
            <div>{singlePost.content}</div>
            <div>{singlePost.User.nickname}</div>
            <div>{singlePost.Images[0] && <img src={`http://localhost:3065/${singlePost.Images[0].src}`}/>}</div>
        </>
    )
}

Post.getInitialProps = async (context) => {
    //서버사이드 렌더링용 dispatch
    context.store.dispatch({
        type: LOAD_POST_REQUEST,
        data: context.query.id,
    });
    return { id: parseInt(context.query.id, 10)};
};

Post.propTypes = {
    id: PropTypes.number.isRequired,
};

export default Post;