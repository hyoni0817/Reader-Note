import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import withRedux from 'next-redux-wrapper';
import withReduxSaga from 'next-redux-saga'; //next용 리덕스 사가, 이게 있어야 next서버에서 리덕스 사가를 돌릴 수 있어서 서버 렌더링을 할 수 있다.
import AppLayout from '../components/AppLayout';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux'; //Provider는 react 컴포넌트들의 중앙 통제실인 redux state를 제공해준다. 
import reducer from '../reducers';//rootReducer
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../sagas';

const ReaderNote = ({ Component, store, pageProps }) => { 
    return(
        <Provider store={store}>
            <Head>
                <title>Reader Note</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css" />
                <link rel="stylesheet" type="text/css" charSet="UTF-8" href="//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css"/>
                <link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css"/>
            </Head>
            <AppLayout>
                <Component {...pageProps}/>
            </AppLayout>
        </Provider> 
    );
};

ReaderNote.propTypes = {
    Component: PropTypes.elementType.isRequired,
    store: PropTypes.object.isRequired,
    pageProps: PropTypes.object.isRequired,
}

ReaderNote.getInitialProps = async (context) => { 
    console.log(context);
    const { ctx, Component } = context;
    let pageProps = {};
    if (Component.getInitialProps) {
       pageProps = await Component.getInitialProps(ctx); 
    }
    return { pageProps };
}

const configureStore = (initialState, options) => {
    const sagaMiddlewares = createSagaMiddleware(); //saga 미들웨어를 리덕스에 연결하기
    const middlewares = [sagaMiddlewares]; // createSagaMiddleware()를 넣어주면 알아서 미들웨어 장착이 된다.
    const enhancer = process.env.NODE_ENV === 'production' ? compose(applyMiddleware(...middlewares)) : compose(applyMiddleware(...middlewares), !options.isServer && window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined' ?
        window.__REDUX_DEVTOOLS_EXTENSION__() : (f) => f,
    ); // 배포할 때는 __REDUX_DEVTOOLS_EXTENSION__를 빼준다. 그렇지 않으면 redux 데이터가 노출되는데 redux가 state의 중앙 통제실이기 때문에 그것의 흐름이 노출되면 보안에 위협이 되기 때문에 빼줘야 한다.
    const store = createStore(reducer, initialState, enhancer);
    store.sagaTask = sagaMiddlewares.run(rootSaga); //withReduxSaga가 store.sagaTask 이 부분을 내부에서 필요로 함. 그래서 이 부분이 있어야 next에서 리덕스 사가로 서버사이드 렌더링을 할 수 있다.
    return store;
};

export default withRedux(configureStore)(withReduxSaga(ReaderNote));