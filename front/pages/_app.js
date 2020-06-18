import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import withRedux from 'next-redux-wrapper';
import AppLayout from '../components/AppLayout';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux'; //Provider는 react 컴포넌트들의 중앙 통제실인 redux state를 제공해준다. 
import reducer from '../reducers';//rootReducer

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
export default withRedux((initialState, options) => {
    const middlewares = []; 
    const enhancer = compose(applyMiddleware(...middlewares), !options.isServer && window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined' ?
        window.__REDUX_DEVTOOLS_EXTENSION__() : (f) => f,
    );
    const store = createStore(reducer, initialState, enhancer);
    return store;
})(ReaderNote); 