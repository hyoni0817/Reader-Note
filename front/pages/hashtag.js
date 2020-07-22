import React, { useEffect } from 'react';
import propTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { LOAD_HASHTAG_POSTS_REQUEST } from '../reducers/post';
import PostCard from '../components/PostCard';
const Hashtag = ({ tag }) => {
    console.log(tag);
    const dispatch = useDispatch();
    const { mainPosts } = useSelector(state => state.user);
    useEffect(() => {
        dispatch({
            type: LOAD_HASHTAG_POSTS_REQUEST,
            data: tag,
        })
    }, []);
    return (
        <div>
            {mainPosts.map( c => {
                <PostCard key={+c.createdAt} post={c} />
            })}
        </div>
    );
};

Hashtag.propTypes = {
    tag: propTypes.string.isRequired,
}

Hashtag.getInitialProps = async (context) => { 
    
    console.log('hashtag getInitialProps', context.query.tag);
    return { tag: context.query.tag }; 
};

export default Hashtag;