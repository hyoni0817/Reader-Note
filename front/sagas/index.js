import { all, call } from 'redux-saga/effects';
import axios from 'axios';
import user from './user';
import post from './post';

axios.defaults.baseURL = 'http://localhost:3065/api';

export default function* rootSaga() {
    yield all([
        call(user),
        call(post)
    ])
} //rootReducer와 비슷한 형식이다.(root saga는 여러개 saga를 조합하는 역할)