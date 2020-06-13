//메인 화면(타임라인 역할)
//원래는 next에서는 import React from 'react';를 해주지 않아도 됨. 알아서 처리해주기 때문에.
//그러나 {useState, useEffect} 같은 것을 사용해야 하기 때문에 아예 안 쓸 수는 없다.
import React from 'react';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
//import Link from 'next/link';

const dummy = {
    isLoggedIn: true,
    imagePaths: [],
    mainPosts: [{
        User: {
            id: 1,
            nickname: '둘리', 
        },
        content: '첫 번째 게시물',
        img: 'https://cphoto.asiae.co.kr/listimglink/6/2013051007205672589_1.jpg',
    }],
}

const Home = () => {
    return (
        <>
            <div>
                {dummy.isLoggedIn && <PostForm />}
                {dummy.mainPosts.map((c) => {
                    return (
                        <PostCard key={c} post={c} />
                    )
                })}
            </div>
        </>
    )
};

export default Home;