//메인 화면(타임라인 역할)
//원래는 next에서는 import React from 'react';를 해주지 않아도 됨. 알아서 처리해주기 때문에.
//그러나 {useState, useEffect} 같은 것을 사용해야 하기 때문에 아예 안 쓸 수는 없다.
import React, { useEffect, useCallback, useRef } from 'react';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { useSelector, useDispatch } from 'react-redux';
import { LOAD_MAIN_POSTS_REQUEST } from '../reducers/post';
//import { loginAction, logoutAction, LOG_IN, LOG_OUT } from '../reducers/user';

const Home = () => {
    const { me } = useSelector(state => state.user); 
    const { mainPosts, hasMorePost } = useSelector(state => state.post);
    const dispatch = useDispatch();
    const countRef = useRef([]); //빈 배열에 요청을 보냈던 lastId를 기록할 것.

    const onScroll = useCallback(() => {
        console.log(window.scrollY, document.documentElement.clientHeight, document.documentElement.scrollHeight);
        //스크롤 할 때 필요한 것듯을 window와 document.에서 불러옴.
        //scrollY: 스크롤 내린 거리
        //clientHeight: 화면 높이
        //scrollHeight: 전체 화면 길이

        if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
            const lastId = mainPosts[mainPosts.length - 1].id;
            //lastId를 front에서도 기록을 해두면 같은 lastId로 요청 보내는 것을 막을 수 있다. 
            
            if (!countRef.current.includes(lastId)) { //front에서도 요청을 여러번 보내지 않도록(LOAD_MAIN_POSTS_REQUEST) 안전장치를 마련함.
                if (hasMorePost) { //더 불러올 게시글이 있을 대 요청, 더 불러올 게시글이 없다면 요청을 하지 않음.
                    dispatch({
                        type: LOAD_MAIN_POSTS_REQUEST,
                        lastId,
                    });
                }
                countRef.current.push(lastId); //한번 요청을 보낸 게(lastId) countRef에 담겨 있기 때문에 다음에 요청을 보낼 때 lastId가 서버로 또 안가게 해줌.
            }
        }
    }, [hasMorePost, mainPosts.length]);

    useEffect(() => {
        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
        }
    }, [hasMorePost, mainPosts.length]);

    return (
        <>
            <div>
                {me && <PostForm />}
                {mainPosts.map((c) => {
                    return (
                        <PostCard key={c.id} post={c} />
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