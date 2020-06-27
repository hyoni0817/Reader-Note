import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import withRedux from 'next-redux-wrapper';
import AppLayout from '../components/AppLayout';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux'; //Provider는 react 컴포넌트들의 중앙 통제실인 redux state를 제공해준다. 
import reducer from '../reducers';//rootReducer
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../sagas';

const ReaderNote = ({ Component, store }) => { //Component는 next에서 넣어주는 props다. 여기서 Component는 index, profile, signup 같은 것을 넣어준다.
    return(
        <Provider store={store}>
            <Head>
                <title>Reader Note</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css" />
            </Head>
            <AppLayout>
                <Component />
            </AppLayout>
        </Provider> 
    );
};

ReaderNote.propTypes = {
    Component: PropTypes.elementType,
    store: PropTypes.object,
}

const configureStore = (initialState, options) => {
    const sagaMiddlewares = createSagaMiddleware(); //saga 미들웨어를 리덕스에 연결하기
    const middlewares = [sagaMiddlewares]; // createSagaMiddleware()를 넣어주면 알아서 미들웨어 장착이 된다.
    const enhancer = process.env.NODE_ENV === 'production' ? compose(applyMiddleware(...middlewares)) : compose(applyMiddleware(...middlewares), !options.isServer && window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined' ?
        window.__REDUX_DEVTOOLS_EXTENSION__() : (f) => f,
    ); // 배포할 때는 __REDUX_DEVTOOLS_EXTENSION__를 빼준다. 그렇지 않으면 redux 데이터가 노출되는데 redux가 state의 중앙 통제실이기 때문에 그것의 흐름이 노출되면 보안에 위협이 되기 때문에 빼줘야 한다.
    const store = createStore(reducer, initialState, enhancer);
    sagaMiddlewares.run(rootSaga);
    return store;
};

export default withRedux(configureStore)(ReaderNote); 