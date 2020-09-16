import React from 'react';
import PropTypes from 'prop-types';
import withRedux from 'next-redux-wrapper';
import withReduxSaga from 'next-redux-saga'; //next용 리덕스 사가, 이게 있어야 next서버에서 리덕스 사가를 돌릴 수 있어서 서버 렌더링을 할 수 있다.
import { Helmet } from  'react-helmet';
import { Container } from 'next/app';

import AppLayout from '../components/AppLayout';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux'; //Provider는 react 컴포넌트들의 중앙 통제실인 redux state를 제공해준다. 
import reducer from '../reducers';//rootReducer
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../sagas';
import { LOAD_USER_REQUEST } from '../reducers/user';
import axios from 'axios';

const ReaderNote = ({ Component, store, pageProps }) => { 
    return(
        <Container>
            <Provider store={store}>
                <Helmet
                    title="Reader Note"
                    htmlAttributes={{ lang: 'ko' }}
                    meta={[{
                        charset: 'UTF-8',
                    }, {
                        name: 'viewport', content: 'width=device-width, initial-scale=1.0, minimum-scale=1.0,maximum-scale=1.0,user-scalable=yes,viewport-fit=cover'
                    }, {
                        'http-equiv': 'X-UA-Compatible', content: 'IE=edge',
                    }, {
                        name: 'description', content: '책을 좋아하는 사람들 Reader Note',
                    }, {
                        name: 'og:title', content: 'Reder Note'
                    }, {
                        name: 'og:description', content: '책을 좋아하는 사람들 Reader Note',
                    }, {
                        property: 'og:type', content: 'website',
                    }]}
                    // 이게 app.js이기 때문에 여기에 넣는 Helmet은 모든 페이지에 공통된 head태그들을 넣은 것이다.
                    link={[{
                        //favicon
                    }, {
                        rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css'
                    }, {
                        rel: 'stylesheet', href: '//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css'
                    }, {
                        rel: 'stylesheet', href: '//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css'
                    }]} //태그 형식을 객체 형식으로 적어준다고 생각하면 된다.
                />
                <AppLayout>
                    <Component {...pageProps}/>
                </AppLayout>
            </Provider> 
        </Container>
    );
};

ReaderNote.propTypes = {
    Component: PropTypes.elementType.isRequired,
    store: PropTypes.object.isRequired,
    pageProps: PropTypes.object.isRequired,
}

ReaderNote.getInitialProps = async (context) => { 
    //getInitialProps가 서버일 때도 실행되고 프론트일 때도 실행되기 때문에 분기처리를 해줘야 함. 
    const { ctx, Component } = context;
    let pageProps = {};
    const state = ctx.store.getState(); //ctx안에 store가 있기 때문에 서버쪽 데이터를 불러 올 수 있는 것.
    const cookie = ctx.isServer ? ctx.req.headers.cookie : ''; //withCredential대신에 직접 쿠키를 넣어줌. 참고로 req는 서버 환경일때만 들어있어서 클라이언트 환경일 경우 에러가 발생함. 그래서 서버 환경인지 아닌지 구별가능.

    //서버이고 쿠키가 있을 때 수동으로 cookie 넣는 작업 실행.클라이언트이면 알아서 쿠키를 집어넣어 주니까 아래 코드 실행 안해줌.
    if (ctx.isServer && cookie) { //서버 일 때 실햏 
        axios.defaults.headers.Cookie = cookie; 
        //axios에 기본적으로 쿠키 데이터를 기본으로 심어주게 해줄 수 있다. 브라우저가 없기 때문에 서버쪽에서 쿠키를 백엔드 서버로 보내기위해서는 이렇게 직접 해줘야 함.
    }
    if (!state.user.me) {
        ctx.store.dispatch({
            type: LOAD_USER_REQUEST, //이와 같은 코드 처리로 유저 정보도 서버사이드 렌더링이 됨.
        });
    }
    if (Component.getInitialProps) {
       pageProps = await Component.getInitialProps(ctx); 
    }
    return { pageProps };
}

const configureStore = (initialState, options) => {
    const sagaMiddlewares = createSagaMiddleware(); //saga 미들웨어를 리덕스에 연결하기
    const middlewares = [sagaMiddlewares, (store) => (next) => (action) => { //custom 미들웨어이다. (커스텀 미들웨어는 삼단 curring 함수이다.)
        next(action);
    }]; // createSagaMiddleware()를 넣어주면 알아서 미들웨어 장착이 된다.
    const enhancer = process.env.NODE_ENV === 'production' ? compose(applyMiddleware(...middlewares)) : compose(applyMiddleware(...middlewares), !options.isServer && window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined' ?
        window.__REDUX_DEVTOOLS_EXTENSION__() : (f) => f,
    ); // 배포할 때는 __REDUX_DEVTOOLS_EXTENSION__를 빼준다. 그렇지 않으면 redux 데이터가 노출되는데 redux가 state의 중앙 통제실이기 때문에 그것의 흐름이 노출되면 보안에 위협이 되기 때문에 빼줘야 한다.
    const store = createStore(reducer, initialState, enhancer);
    store.sagaTask = sagaMiddlewares.run(rootSaga); //withReduxSaga가 store.sagaTask 이 부분을 내부에서 필요로 함. 그래서 이 부분이 있어야 next에서 리덕스 사가로 서버사이드 렌더링을 할 수 있다.
    return store;
};

export default withRedux(configureStore)(withReduxSaga(ReaderNote));