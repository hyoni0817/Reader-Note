import React from 'react';
import Head from 'next/head';
import AppLayout from '../components/AppLayout';

const ReaderNote = ({ Component }) => { //Component는 next에서 넣어주는 props다. 여기서 Component는 index, profile, signup 같은 것을 넣어준다.
    return(
        <>
            <Head>
                <title>Reader Note</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css" />
            </Head>
            <AppLayout>
                <Component />
            </AppLayout>
        </> 
    );
};

export default ReaderNote;