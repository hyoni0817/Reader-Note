const dummyUser = {
    nickname: '피카츄',
    Post: [],
    Followings: [],
    Followers: [],
    signUpData: {},
}

export const initialState = { //initialState는 웹을 대표하는 모든 상태값을 갖고 있는 중앙 통제실. 그래서 initialState 설계를 잘하는 것이 중요하다.
    isLoggedIn: false, //로그인 여부
    isLoggingOut: false, //로그아웃 시도중
    isLogginIn: false, //로그인 시도중
    logInErrorReason: '', //로그인 에러 사유
    signedUp: false, // 회원가입 성공
    isSigningUp: false, //회원가입 시도중
    signUpErrorReason: '', //회원가입 실패 사유
    me: null, 
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

export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

//동기 요청에는 요청 보냈다가 기다리는 것 없이 바로 실행되는 것이 때문에 REQUEST, SUCCESS, FAILURE 같은 것이 붙지 않는다. 이런것은 리덕스 사가가 필요하지 않기 때문에 리덕스 만으로 처리 가능.

export const signUpAction = (data) => ({
        type: SIGN_UP_REQUEST,
        data,
    } //return문을 쓰지 않고 소괄호를 쓰면 바로 리턴되는 방식으로 바꾼다.
);

export const signUpSuccess = {
    type: 'SIGN_UP_SUCCESS',
};

//action도 자주 쓰이니 export 해준다.
export const loginAction = {
    type: LOG_IN_REQUEST,
    data: {
        nickname: '제로초',
    }
};

export const logoutAction = {
    type: LOG_OUT_REQUEST,
};

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case LOG_IN_REQUEST: {
            return {
                ...state,
                isLoading: true, //REQUEST에 보통 로딩창 여부를 적어준다.
            }
        }
        case LOG_IN_SUCCESS: {
            return {
                ...state,
                isLoading: false,
                me: dummyUser,
                isLoggedIn: true,
            };
        }
        case LOG_IN_FAILURE: {
            return {
                ...state,
                isLoggedIn: false,
                me: null,
            }
        }
        case LOG_OUT_REQUEST: {
            return {
                ...state,
                isLoggedIn: false,
                me: null,
            }
        }
        case SIGN_UP_REQUEST: {
            return {
                ...state,
                signupData: action.data,
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