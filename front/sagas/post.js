//post 리듀서만 담당
import { all, fork, takeLatest, put, delay } from 'redux-saga/effects'
import { ADD_POST_REQUEST, ADD_POST_SUCCESS, ADD_POST_FAILURE } from '../reducers/post';

function* addPost() {
    try {
        yield delay(2000);
        yield put({
            type: ADD_POST_SUCCESS,
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

export default function* postSaga() {
    yield all([
        fork(watchAddPost),
    ]);
}