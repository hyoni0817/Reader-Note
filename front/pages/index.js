//메인 화면(타임라인 역할)
//원래는 next에서는 import React from 'react';를 해주지 않아도 됨. 알아서 처리해주기 때문에.
//그러나 {useState, useEffect} 같은 것을 사용해야 하기 때문에 아예 안 쓸 수는 없다.
import React, { useEffect } from 'react';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { useSelector, useDispatch } from 'react-redux';
import { LOAD_MAIN_POSTS_REQUEST } from '../reducers/post';
//import { loginAction, logoutAction, LOG_IN, LOG_OUT } from '../reducers/user';

const Home = () => {
    const { me } = useSelector(state => state.user); 
    const { mainPosts } = useSelector(state => state.post);
    const dispatch = useDispatch();

    const onScroll = () => {
        console.log(window.scrollY, document.documentElement.clientHeight, document.documentElement.scrollHeight);
        //스크롤 할 때 필요한 것듯을 window와 document.에서 불러옴.
        //scrollY: 스크롤 내린 거리
        //clientHeight: 화면 높이
        //scrollHeight: 전체 화면 길이
        if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
            dispatch({
                type: LOAD_MAIN_POSTS_REQUEST,
                lastId: mainPosts[mainPosts.length -1].id,
            })
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
        }
    }, [mainPosts.length]);

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