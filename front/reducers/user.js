const dummyUser = {
    nickname: '피카츄',
    Post: [],
    Followings: [],
    Followers: [],
    signUpData: {},
    id: 1,
};

export const initialState = { //initialState는 웹을 대표하는 모든 상태값을 갖고 있는 중앙 통제실. 그래서 initialState 설계를 잘하는 것이 중요하다.
    isLoggingOut: false, //로그아웃 시도중
    isLoggingIn: false, //로그인 시도중
    logInErrorReason: '', //로그인 에러 사유
    signedUp: false, // 회원가입 성공
    isSigningUp: false, //회원가입 시도중
    signUpErrorReason: '', //회원가입 실패 사유
    me: null, //내 정보
    followingList: [], //팔로잉 리스트
    followerList: [], //팔로워 리스트
    userInfo: null, //남의 정보
}; 

//비동기 요청은 뒤에 REQUEST, SUCCESS, FAILURE를 붙인다. 그러면 Redux-saga에서 동작하는 것인 것을 알 수 있어서 redux에서 동작하는 것과 구별이 가능하다. 그리고 비동기는 무조건 액션이 최소 3개나온다. 
export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST'; //액션의 이름
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

//로그인 후 사용자 정보 불러오는 액션
export const LOAD_USER_REQUEST = 'LOAD_USER_REQUEST'; //액션의 이름
export const LOAD_USER_SUCCESS = 'LOAD_USER_SUCCESS';
export const LOAD_USER_FAILURE = 'LOAD_USER_FAILURE';

export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

//팔로우 목록 불러오는 액션
export const LOAD_FOLLOW_REQUEST = 'LOAD_FOLLOW_REQUEST'; //액션의 이름
export const LOAD_FOLLOW_SUCCESS = 'LOAD_FOLLOW_SUCCESS';
export const LOAD_FOLLOW_FAILURE = 'LOAD_FOLLOW_FAILURE';

//팔로우하는 액션
export const FOLLOW_USER_REQUEST = 'FOLLOW_USER_REQUEST'; //액션의 이름
export const FOLLOW_USER_SUCCESS = 'FOLLOW_USER_SUCCESS';
export const FOLLOW_USER_FAILURE = 'FOLLOW_USER_FAILURE';

//팔로우 해제하는 액션
export const UNFOLLOW_USER_REQUEST = 'UNFOLLOW_USER_REQUEST'; //액션의 이름
export const UNFOLLOW_USER_SUCCESS = 'UNFOLLOW_USER_SUCCESS';
export const UNFOLLOW_USER_FAILURE = 'UNFOLLOW_USER_FAILURE';

//팔로워 차단(제거)하는 액션
export const REMOVE_FOLLOWER_REQUEST = 'REMOVE_FOLLOWER_REQUEST'; //액션의 이름
export const REMOVE_FOLLOWER_SUCCESS = 'REMOVE_FOLLOWER_SUCCESS';
export const REMOVE_FOLLOWER_FAILURE = 'REMOVE_FOLLOWER_FAILURE';

export const ADD_POST_TO_ME = 'ADD_POST_TO_ME';

export const loginRequestAction = data => ({
    type: LOG_IN_REQUEST,
    data,
});

export const logoutRequestAction = {
    type: LOG_OUT_REQUEST,
};

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case LOG_IN_REQUEST: {
            return {
                ...state,
                isLoggingIn: true,
                //isLoading: true, //REQUEST에 보통 로딩창 여부를 적어준다.
                logInErrorReason: '',
            }
        }
        case LOG_IN_SUCCESS: {
            return {
                ...state,
                isLoggingIn: false,
                isLoading: false,
                me: action.data,
            };
        }
        case LOG_IN_FAILURE: {
            return {
                ...state,
                isLoggingIn: false,
                logInErrorReason: action.error,
                me: null,
            }
        }
        case LOG_OUT_REQUEST: {
            return {
                ...state,
                isLoggingOut: true,
            };
        }
        case LOG_OUT_SUCCESS: {
            return {
                ...state,
                isLoggingOut: false,
                me: null,
            }
        }
        case SIGN_UP_REQUEST: {
            return {
                ...state,
                isSigningUp: true,
                isSignedUp: false,
                signUpErrorReason: '',
            };
        }
        case SIGN_UP_SUCCESS: {
            return {
                ...state,
                isSigningUp: false,
                isSignedUp: true,
            };
        }
        case SIGN_UP_FAILURE: {
            return {
                ...state,
                isSigningUp: false,
                signUpErrorReason: action.error,
            };
        }
        case LOAD_USER_REQUEST: {
            return {
                ...state,
            };
        }
        case LOAD_USER_SUCCESS: {
            if (action.me) {
                return {
                    ...state,
                    me: action.data,
                };
            }
            return {
                ...state,
                userInfo: action.data,
            }
        }
        case LOAD_USER_FAILURE: {
            return {
                ...state,
            };
        }
        default: {
            return {
                ...state,
            }
        }
    }
}

export default reducer;