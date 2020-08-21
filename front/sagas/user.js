//user 리듀서만 담당
import { all, takeLatest, put, call, fork, take, takeEvery, delay } from 'redux-saga/effects'
import axios from 'axios'; //서버에 요청을 보내주는 모듈
import { LOG_IN_SUCCESS, LOG_IN_FAILURE, LOG_IN_REQUEST, SIGN_UP_REQUEST, SIGN_UP_SUCCESS, SIGN_UP_FAILURE, LOG_OUT_SUCCESS, LOG_OUT_FAILURE, LOG_OUT_REQUEST, LOAD_USER_SUCCESS, LOAD_USER_FAILURE, LOAD_USER_REQUEST, FOLLOW_USER_SUCCESS, FOLLOW_USER_FAILURE, FOLLOW_USER_REQUEST, UNFOLLOW_USER_SUCCESS, UNFOLLOW_USER_FAILURE, UNFOLLOW_USER_REQUEST, LOAD_FOLLOWERS_SUCCESS, LOAD_FOLLOWERS_FAILURE, LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWINGS_SUCCESS, LOAD_FOLLOWINGS_FAILURE, LOAD_FOLLOWINGS_REQUEST, REMOVE_FOLLOWER_SUCCESS, REMOVE_FOLLOWER_FAILURE, REMOVE_FOLLOWER_REQUEST, } from '../reducers/user';

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

function loadUserAPI(userId) { 
    return axios.get(userId ? `/user/${userId}` : '/user', {
        withCredentials: true, 
    }); 
}

function* loadUser(action) { 
    try {
        const result = yield call(loadUserAPI, action.data); 
        yield put({ 
            type: LOAD_USER_SUCCESS,
            data: result.data,
            me: !action.data, 
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

function followAPI(userId) { 
    return axios.post(`/user/${userId}/follow`, {}, {
        withCredentials: true, 
    }); 
}

function* follow(action) { 
    try {
        const result = yield call(followAPI, action.data); 
        yield put({ 
            type: FOLLOW_USER_SUCCESS,
            data: result.data,
        })
    } catch (e) { 
        console.error(e);
        yield put({
            type: FOLLOW_USER_FAILURE,
            error: e,
        })
    }
}

function* watchFollow() {
    yield takeEvery(FOLLOW_USER_REQUEST, follow); 
}

function unfollowAPI(userId) { 
    return axios.delete(`/user/${userId}/follow`, {
        withCredentials: true, 
    }); 
}

function* unfollow(action) { 
    try {
        const result = yield call(unfollowAPI, action.data); 
        yield put({ 
            type: UNFOLLOW_USER_SUCCESS,
            data: result.data,
        })
    } catch (e) { 
        console.error(e);
        yield put({
            type: UNFOLLOW_USER_FAILURE,
            error: e,
        })
    }
}

function* watchUnfollow() {
    yield takeEvery(UNFOLLOW_USER_REQUEST, unfollow); 
}

function loadFollowersAPI(userId) { 
    return axios.get(`/user/${userId}/followers`, {
        withCredentials: true, 
    }); 
}

function* loadFollowers(action) { 
    try {
        const result = yield call(loadFollowersAPI, action.data); 
        yield put({ 
            type: LOAD_FOLLOWERS_SUCCESS,
            data: result.data,
        })
    } catch (e) { 
        console.error(e);
        yield put({
            type: LOAD_FOLLOWERS_FAILURE,
            error: e,
        })
    }
}

function* watchLoadFollowers() {
    yield takeEvery(LOAD_FOLLOWERS_REQUEST, loadFollowers); 
}

function loadFollowingsAPI(userId) { 
    return axios.get(`/user/${userId}/followings`, {
        withCredentials: true, 
    }); 
}

function* loadFollowings(action) { 
    try {
        const result = yield call(loadFollowingsAPI, action.data); 
        yield put({ 
            type: LOAD_FOLLOWINGS_SUCCESS,
            data: result.data,
        })
    } catch (e) { 
        console.error(e);
        yield put({
            type: LOAD_FOLLOWINGS_FAILURE,
            error: e,
        })
    }
}

function* watchLoadFollowings() {
    yield takeEvery(LOAD_FOLLOWINGS_REQUEST, loadFollowings); 
}

function removeFollowersAPI(userId) { 
    return axios.delete(`/user/${userId}/follower`, {
        withCredentials: true, 
    }); 
}

function* removeFollowers(action) { 
    try {
        const result = yield call(removeFollowersAPI, action.data); 
        yield put({ 
            type: REMOVE_FOLLOWER_SUCCESS,
            data: result.data,
        })
    } catch (e) { 
        console.error(e);
        yield put({
            type: REMOVE_FOLLOWER_FAILURE,
            error: e,
        })
    }
}

function* watchRemoveFollower() {
    yield takeEvery(REMOVE_FOLLOWER_REQUEST, removeFollowers); 
}

export default function* userSaga() {
    yield all([
        fork(watchLogIn),
        fork(watchLogOut),
        fork(watchLoadUser),
        fork(watchSignUp),
        fork(watchFollow),
        fork(watchUnfollow),
        fork(watchLoadFollowers),
        fork(watchLoadFollowings),
        fork(watchRemoveFollower),
    ])
}
