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

export const SIGN_UP = 'SIGN_UP';
export const LOG_IN = 'LOG_IN'; //액션의 이름
export const LOG_OUT = 'LOG_OUT';

export const signUpAction = (data) => {
    return {
        type: SIGN_UP,
        data: data,
    }
}

//action도 자주 쓰이니 export 해준다.
export const loginAction = {
    type: LOG_IN,
    data: {
        nickname: '제로초',
    }
};

export const logoutAction = {
    type: LOG_OUT,
};

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case LOG_IN: {
            return {
                ...state,
                isLoggedIn: true,
                user: dummyUser,
            }
        }
        case LOG_OUT: {
            return {
                ...state,
                isLoggedIn: false,
                user: null,
            }
        }
        case SIGN_UP: {
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