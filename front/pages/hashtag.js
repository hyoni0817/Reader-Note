import React, { useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { LOAD_HASHTAG_POSTS_REQUEST } from '../reducers/post';
import PostCard from '../containers/PostCard';

const Hashtag = ({ tag }) => {
    const dispatch = useDispatch();
    const { mainPosts, hasMorePost } = useSelector(state => state.post);
    const countRef = useRef([]);

    const onScroll = useCallback(() => {
        console.log(window.scrollY, document.documentElement.clientHeight, document.documentElement.scrollHeight - 300)
        //스크롤 할 때 필요한 것듯을 window와 document.에서 불러옴.
        //scrollY: 스크롤 내린 거리
        //clientHeight: 화면 높이
        //scrollHeight: 전체 화면 길이
        if (window.scrollY) {
            if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
                const lastId = mainPosts[mainPosts.length - 1] && mainPosts[mainPosts.length -1].id;
                if (!countRef.current.includes(lastId)) {
                    if (hasMorePost) { //더 불러올 게시글이 있을 대 요청, 더 불러올 게시글이 없다면 요청을 하지 않음.
                        dispatch({
                            type: LOAD_HASHTAG_POSTS_REQUEST,
                            lastId,
                            data: tag,
                        })
                    }
                    countRef.current.push(lastId);
                }
            }
        }
    }, [hasMorePost, mainPosts.length, tag]);

    useEffect(() => {
        window.addEventListener('scroll', onScroll);
        return () => {
            countRef.current = [];
            window.removeEventListener('scroll', onScroll);
        }
    }, [mainPosts.length, hasMorePost, tag]);

    return (
        <div>
            {mainPosts.map(c => (
                <PostCard key={c.id} post={c} />
            ))}
        </div>
    );
};

Hashtag.propTypes = {	
    tag: PropTypes.string.isRequired,	
};

Hashtag.getInitialProps = async (context) => { 
    const tag = context.query.tag;
    console.log('hashtag getInitialProps', tag);
    context.store.dispatch({
        type: LOAD_HASHTAG_POSTS_REQUEST,
        data: tag,
    })
    return { tag }; 
};

export default Hashtag;