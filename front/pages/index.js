//메인 화면
//원래는 next에서는 import React from 'react';를 해주지 않아도 됨. 알아서 처리해주기 때문에.
//그러나 {useState, useEffect} 같은 것을 사용해야 하기 때문에 아예 안 쓸 수는 없다.
import React from 'react';
//import Link from 'next/link';
import Head from 'next/head';
import AppLayout from '../components/AppLayout';

const Home = () => {
    return (
        <>
            <Head>
                <title>Reader Note</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css" />
            </Head>
            <AppLayout>
                <div>Hello, Next!</div>
            </AppLayout>
        </>
    )
};

export default Home;