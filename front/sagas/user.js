//user 리듀서만 담당
import { all, takeLatest, put, call, fork, take, takeEvery, delay } from 'redux-saga/effects'
import axios from 'axios'; //서버에 요청을 보내주는 모듈
import { LOG_IN_SUCCESS, LOG_IN_FAILURE, LOG_IN_REQUEST, SIGN_UP_REQUEST, SIGN_UP_SUCCESS, SIGN_UP_FAILURE, LOG_OUT_SUCCESS, LOG_OUT_FAILURE, LOG_OUT_REQUEST, LOAD_USER_SUCCESS, LOAD_USER_FAILURE, LOAD_USER_REQUEST, } from '../reducers/user';

function logInAPI(loginData) {
    //서버에 요청을 보내는 부분
    return axios.post('/user/login', loginData, { 
        withCredentials: true, 
    });
}

function* logIn(action) {
    try {
        const result = yield call(logInAPI, action.data);
        yield put({ //put은 dispatch와 동일, loginAPI 성공
            type: LOG_IN_SUCCESS,
            data: result.data,
        })
    } catch (e) { //loginAPI 실패
        console.error(e);
        yield put({
            type: LOG_IN_FAILURE
        })
    }
}

function signUpAPI(signUpData) { //signUpData에 id, nickname, password가 전달됨.
    //서버에 요청을 보내는 부분
    return axios.post('/user/', signUpData);
}

function* signUp(action) { 
    try {
        yield call(signUpAPI, action.data); //첫번째(signUpAPI부분)는 함수고 두번째(action.data부분) 부터 signUpAPI의 인자다
        yield put({ //put은 dispatch와 동일, loginAPI 성공
            type: SIGN_UP_SUCCESS
        })
    } catch (e) { //loginAPI 실패
        console.error(e);
        yield put({
            type: SIGN_UP_FAILURE,
            error: e
        })
    }
}

function logOutAPI() { 
    return axios.post('/user/logout', {}, { 
        withCredentials: true, 
    });
}

function* logOut(action) { 
    try {
        yield call(logOutAPI, action.data); 
        yield put({ 
            type: LOG_OUT_SUCCESS,
        })
    } catch (e) { 
        console.error(e);
        yield put({
            type: LOG_OUT_FAILURE,
            error: e
        })
    }
}

function loadUserAPI() { 
    return axios.get('/user', {
        withCredentials: true, 
    }); 
}

function* loadUser() { 
    try {
        const result = yield call(loadUserAPI); 
        yield put({ 
            type: LOAD_USER_SUCCESS,
            data: result.data,
        })
    } catch (e) { 
        console.error(e);
        yield put({
            type: LOAD_USER_FAILURE,
            error: e,
        })
    }
}

function* watchLoadUser() {
    yield takeEvery(LOAD_USER_REQUEST, loadUser); 
}

function* watchLogOut() {
    yield takeEvery(LOG_OUT_REQUEST, logOut); 
}

function* watchLogIn() {
    yield takeEvery(LOG_IN_REQUEST, logIn); 
}


function* watchSignUp() {
    yield takeEvery(SIGN_UP_REQUEST, signUp); 
}


export default function* userSaga() {
    yield all([
        fork(watchLogIn),
        fork(watchLogOut),
        fork(watchLoadUser),
        fork(watchSignUp),
    ])
}
