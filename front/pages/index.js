//메인 화면(타임라인 역할)
//원래는 next에서는 import React from 'react';를 해주지 않아도 됨. 알아서 처리해주기 때문에.
//그러나 {useState, useEffect} 같은 것을 사용해야 하기 때문에 아예 안 쓸 수는 없다.
import React from 'react';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { useSelector } from 'react-redux';
import { LOAD_MAIN_POSTS_REQUEST } from '../reducers/post';
//import { loginAction, logoutAction, LOG_IN, LOG_OUT } from '../reducers/user';

const Home = () => {
    const { me } = useSelector(state => state.user); 
    const { mainPosts } = useSelector(state => state.post);

    return (
        <>
            <div>
                {me && <PostForm />}
                {mainPosts.map((c) => {
                    return (
                        <PostCard key={c} post={c} />
                    )
                })}
            </div>
        </>
    )
};

Home.getInitialProps = async (context) => { 
    console.log(Object.keys(context)); 
    context.store.dispatch({
        type:LOAD_MAIN_POSTS_REQUEST,
    }) 
};

export default Home;