//post 리듀서만 담당
import { all, fork, takeLatest, put, delay, call } from 'redux-saga/effects'
import { ADD_POST_REQUEST, ADD_POST_SUCCESS, ADD_POST_FAILURE, ADD_COMMENT_REQUEST, ADD_COMMENT_SUCCESS, ADD_COMMENT_FAILURE, LOAD_MAIN_POSTS_REQUEST, LOAD_MAIN_POSTS_SUCCESS, LOAD_MAIN_POSTS_FAILURE, LOAD_HASHTAG_POSTS_REQUEST, LOAD_HASHTAG_POSTS_SUCCESS, LOAD_HASHTAG_POSTS_FAILURE, LOAD_USER_POSTS_REQUEST, LOAD_USER_POSTS_SUCCESS, LOAD_USER_POSTS_FAILURE } from '../reducers/post';
import axios from 'axios';

function addPostAPI(postData) {
    return axios.post('/post', postData, {
        withCredentials: true, 
    });
}
function* addPost(action) {
    try {
        const result = yield call(addPostAPI, action.data);
        yield put({
            type: ADD_POST_SUCCESS,
            data: result.data,
        });
    } catch (e) {
        yield put({
            type: ADD_POST_FAILURE,
            error: e,
        })
    }
}

function* watchAddPost() {
    yield takeLatest(ADD_POST_REQUEST, addPost); //작성 버튼을 여러번 누르면 한번만 등록이 되야 하는게 맞기 때문에 takeLastest 사용

}

function* addCommentAPI() {

}
function* addComment(action) { //이 액션은 PostCard.js의 ADD_COMMENT_REQUEST가 디스패치할 때 전달되는 액션이다. 
    try {
        yield delay(2000);
        yield put({
            type: ADD_COMMENT_SUCCESS,
            data: {
                postId: action.data.postId
            }
        });
    } catch (e) {
        console.log(e)
        yield put({
            type: ADD_COMMENT_FAILURE,
            error: e,
        })
    }
}

function* watchAddComment() {
    
    yield takeLatest(ADD_COMMENT_REQUEST, addComment); //작성 버튼을 여러번 누르면 한번만 등록이 되야 하는게 맞기 때문에 takeLastest 사용

}

function loadMainPostsAPI() {
    return axios.get('/posts'); 
}

function* loadMainPosts() { 
    try {
        const result = yield call(loadMainPostsAPI);
        yield put({
            type: LOAD_MAIN_POSTS_SUCCESS,
            data: result.data, 
        });
    } catch (e) {
        console.log(e)
        yield put({
            type: LOAD_MAIN_POSTS_FAILURE,
            error: e,
        })
    }
}

function* watchLoadMainPosts() {
    
    yield takeLatest(LOAD_MAIN_POSTS_REQUEST, loadMainPosts); 

}

function loadHashtagPostsAPI(tag) {
    return axios.get(`/hashtag/${tag}`); 
}

function* loadHashtagPosts(action) { 
    try {
        const result = yield call(loadHashtagPostsAPI, action.data);
        yield put({
            type: LOAD_HASHTAG_POSTS_SUCCESS,
            data: result.data, 
        });
    } catch (e) {
        console.log(e)
        yield put({
            type: LOAD_HASHTAG_POSTS_FAILURE,
            error: e,
        })
    }
}

function* watchLoadHashtagPosts() { 
    yield takeLatest(LOAD_HASHTAG_POSTS_REQUEST, loadHashtagPosts); 
}

function loadUserPostsAPI(id) {
    return axios.get(`/user/${id}/posts`); 
}

function* loadUserPosts(action) { 
    try {
        const result = yield call(loadUserPostsAPI, action.data);
        yield put({
            type: LOAD_USER_POSTS_SUCCESS,
            data: result.data, 
        });
    } catch (e) {
        console.log(e)
        yield put({
            type: LOAD_USER_POSTS_FAILURE,
            error: e,
        })
    }
}

function* watchLoadUserPosts() {
    yield takeLatest(LOAD_USER_POSTS_REQUEST, loadUserPosts); 
}

export default function* postSaga() {
    yield all([
        fork(watchLoadMainPosts),
        fork(watchAddPost),
        fork(watchAddComment),
        fork(watchLoadHashtagPosts),
        fork(watchLoadUserPosts),
    ]);
}