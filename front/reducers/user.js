const dummyUser = {
    nickname: '피카츄',
    Post: [],
    Followings: [],
    Followers: [],
    signUpData: {},
}

export const initialState = {
    isLoggedIn: false,
    user: null, 
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

export const INCREMENT_NUMBER; //동기 요청(동기 요청에는 요청 보냈다가 기다리는 것 없이 바로 실행되는 것이 때문에 REQUEST, SUCCESS, FAILURE 같은 것이 붙지 않는다. 이런것은 리덕스 사가가 필요하지 않기 때문에 리덕스 만으로 처리 가능.)

export const signUpAction = (data) => {
    return {
        type: SIGN_UP_REQUEST,
        data: data,
    }
}

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
                isLoggedIn: true,
                user: dummyUser,
                loginData: actio.data,
                isLoading: true, //REQUEST에 보통 로딩창 여부를 적어준다.
            }
        }
        case LOG_IN_SUCCESS: {
            return {
                ...state,
                isLoading: false,
                user: dummyUser,
                isLoggedIn: true,
            };
        }
        
        case LOG_OUT_REQUEST: {
            return {
                ...state,
                isLoggedIn: false,
                user: null,
            }
        }
        case SIGN_UP_REQUEST: {
            return {
                ...state,
                signupData: action.data,
            };
        }
        case LOG_IN_FAILURE: {
            return {
              ...state,
              isLoggedIn: false,
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