//개별 포스트를 하나씩 보여줌(게시물 하나하나를 자세히 볼 수 있는 페이지)
import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { LOAD_POST_REQUEST } from '../reducers/post';

const Post =  ({ id }) => {
    const { singlePost } = useSelector(state => state.post);
    return (
        <>
            <Helmet 
                title={`${singlePost.User.nickname}님의 글`}//헤드 태그의 title
                description={singlePost.content}//게시글 내용이 descripttion
                meta={[{
                    name: 'description', content: singlePost.content,
                }, {
                    property: 'og:title', content: `${singlePost.User.nickname}님의 게시글`
                }, {
                    property: 'og:description', content: singlePost.content,
                }, {
                    property: 'og:image', content: singlePost.Images[0] && `http://localhost:3065/${singlePost.Images[0].src}`, 
                }, {
                    property: 'og:url', content: `http://localhost:3065/post/${id}`,
                }]}
                //메타태그는 여러 개 넣어줄 수 있기 때문에 배열을 사용해서 넣어줌 
                //검색엔진 봇은 어떤게 어떤건지 구별을 잘 못하기 때문에 이렇게 일일이 다 구별해줘야 한다.
            />
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