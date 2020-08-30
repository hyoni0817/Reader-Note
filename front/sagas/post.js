//post 리듀서만 담당
import { all, fork, takeLatest, put, delay, call } from 'redux-saga/effects'
import { ADD_POST_REQUEST, ADD_POST_SUCCESS, ADD_POST_FAILURE, ADD_COMMENT_REQUEST, ADD_COMMENT_SUCCESS, ADD_COMMENT_FAILURE, LOAD_MAIN_POSTS_REQUEST, LOAD_MAIN_POSTS_SUCCESS, LOAD_MAIN_POSTS_FAILURE, LOAD_HASHTAG_POSTS_REQUEST, LOAD_HASHTAG_POSTS_SUCCESS, LOAD_HASHTAG_POSTS_FAILURE, LOAD_USER_POSTS_REQUEST, LOAD_USER_POSTS_SUCCESS, LOAD_USER_POSTS_FAILURE, LOAD_COMMENTS_REQUEST, LOAD_COMMENTS_SUCCESS, LOAD_COMMENTS_FAILURE, UPLOAD_IMAGES_REQUEST, UPLOAD_IMAGES_SUCCESS, UPLOAD_IMAGES_FAILURE, LIKE_POST_REQUEST, LIKE_POST_SUCCESS, LIKE_POST_FAILURE, UNLIKE_POST_REQUEST, UNLIKE_POST_SUCCESS, UNLIKE_POST_FAILURE, RETWEET_REQUEST, RETWEET_SUCCESS, RETWEET_FAILURE } from '../reducers/post';
import { ADD_POST_TO_ME } from '../reducers/user';
import axios from 'axios';

function addPostAPI(postData) {
    return axios.post('/post', postData, {
        withCredentials: true, 
    });
}
function* addPost(action) {
    try {
        const result = yield call(addPostAPI, action.data);
        yield put({ //post reducer의 데이터를 수정
            type: ADD_POST_SUCCESS,
            data: result.data,
        });
        yield put({ //user reducer의 데이터를 수정
            type: ADD_POST_TO_ME,
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

function addCommentAPI(data) {
    // if(!data.content){
    //     return console.error("데이터 확인 요망,data.content:", data.content);
    // }
    return axios.post(`/post/${data.postId}/comment`, {content: data.content}, {
        withCredentials: true 
    });
}

function* addComment(action) { //이 액션은 PostCard.js의 ADD_COMMENT_REQUEST가 디스패치할 때 전달되는 액션이다. 
    try {
        const result = yield call(addCommentAPI, action.data);
        yield put({
            type: ADD_COMMENT_SUCCESS,
            data: {
                postId: action.data.postId,
                comment: result.data,
            }
        });
    } catch (e) {
        console.error(e)
        yield put({
            type: ADD_COMMENT_FAILURE,
            error: e,
        })
        alert(e.response && e.response.data);
    }
}

function* watchAddComment() {
    yield takeLatest(ADD_COMMENT_REQUEST, addComment); 
}

function loadCommentsAPI(postId) {
    return axios.get(`/post/${postId}/comments`);
}

function* loadComments(action) { 
    try {
        const result = yield call(loadCommentsAPI, action.data);
        yield put({
            type: LOAD_COMMENTS_SUCCESS,
            data: {
                postId: action.data,
                comments: result.data,
            }
        });
    } catch (e) {
        console.log(e)
        yield put({
            type: LOAD_COMMENTS_FAILURE,
            error: e,
        })
        alert(e.response && e.response.data);
    }
}

function* watchLoadComments() {
    yield takeLatest(LOAD_COMMENTS_REQUEST, loadComments); 
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
    return axios.get(`/hashtag/${encodeURIComponent(tag)}`); 
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


function uploadImagesAPI(formData) {
    return axios.post(`/post/images`, formData, {
        withCredentials: true, 
    }); 
}

function* uploadImages(action) { 
    try {
        const result = yield call(uploadImagesAPI, action.data);
        yield put({
            type: UPLOAD_IMAGES_SUCCESS,
            data: result.data, 
        });
    } catch (e) {
        console.error(e)
        yield put({
            type: UPLOAD_IMAGES_FAILURE,
            error: e,
        })
    }
}

function* watchUploadImages() {
    yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages); 
}

function likePostAPI(postId) { // 게시글 좋아요 누르는 API
    return axios.post(`/post/${postId}/like`, {}, {
        withCredentials: true, 
    }); 
}

function* likePost(action) { 
    try {
        const result = yield call(likePostAPI, action.data);
        yield put({
            type: LIKE_POST_SUCCESS,
            data: {
                postId: action.data,
                userId: result.data.userId, //서버쪽에서는 좋아요 누른 사람의 id를 보내줌.
            }, 
        });
    } catch (e) {
        console.error(e)
        yield put({
            type: LIKE_POST_FAILURE,
            error: e,
        })
        alert(e.response && e.response.data);
    }
}

function* watchLikePost() {
    yield takeLatest(LIKE_POST_REQUEST, likePost); 
}

function unlikePostAPI(postId) { // 게시글 좋아요 누르는 API
    return axios.delete(`/post/${postId}/like`, {
        withCredentials: true, 
    }); 
}

function* unlikePost(action) { 
    try {
        const result = yield call(unlikePostAPI, action.data);
        yield put({
            type: UNLIKE_POST_SUCCESS,
            data: {
                postId: action.data,
                userId: result.data.userId, //서버쪽에서는 좋아요 누른 사람의 id를 보내줌.
            }, 
        });
    } catch (e) {
        console.error(e)
        yield put({
            type: UNLIKE_POST_FAILURE,
            error: e,
        })
        alert(e.response && e.response.data);
    }
}

function* watchUnlikePost() {
    yield takeLatest(UNLIKE_POST_REQUEST, unlikePost); 
}

function retweetAPI(postId) { 
    return axios.post(`/post/${postId}/retweet`, {}, { //두번째 인자에 데이터가 없더라도 빈객체 꼭 넣어주기.
        withCredentials: true, 
    }); 
}

function* retweet(action) { 
    try {
        const result = yield call(retweetAPI, action.data);
        yield put({
            type: RETWEET_SUCCESS,
            data: result.data, //리트윗한 게시글 데이터 전달 
        });
    } catch (e) {
        console.error(e)
        yield put({
            type: RETWEET_FAILURE,
            error: e,
        })
        //console.dir(e); //에러에 대한 데이터도 에러 객체에 들어 있다. 그래서 alert를 통해 에러 내용을 띄우려고 할 때 console.dir를 통해 에러에 대한 내용이 어느 속성에 들어있는지 확인해줘야 한다.
        alert(e.response && e.response.data);
    }
}

function* watchRetweet() {
    yield takeLatest(RETWEET_REQUEST, retweet); 
}

export default function* postSaga() {
    yield all([
        fork(watchLoadMainPosts),
        fork(watchAddPost),
        fork(watchAddComment),
        fork(watchLoadComments),
        fork(watchLoadHashtagPosts),
        fork(watchLoadUserPosts),
        fork(watchUploadImages),
        fork(watchLikePost),
        fork(watchUnlikePost),
        fork(watchRetweet),
    ]);
}