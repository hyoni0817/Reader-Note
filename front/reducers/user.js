import produce from 'immer';

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
    isEditingNickname: false, //이름 변경 중
    editNicknameErrorReason: '', //이름 변경 실패 사유
    hasMoreFollower: true, //팔로워 목록 더보기 버튼 표시 여부
    hasMoreFollowing: true, //팔로잉 목록 더보기 버튼 표시 여부
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
export const LOAD_FOLLOWERS_REQUEST = 'LOAD_FOLLOWERS_REQUEST'; //액션의 이름
export const LOAD_FOLLOWERS_SUCCESS = 'LOAD_FOLLOWERS_SUCCESS';
export const LOAD_FOLLOWERS_FAILURE = 'LOAD_FOLLOWERS_FAILURE';

//팔로잉 목록 불러오는 액션
export const LOAD_FOLLOWINGS_REQUEST = 'LOAD_FOLLOWINGS_REQUEST'; //액션의 이름
export const LOAD_FOLLOWINGS_SUCCESS = 'LOAD_FOLLOWINGS_SUCCESS';
export const LOAD_FOLLOWINGS_FAILURE = 'LOAD_FOLLOWINGS_FAILURE';

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

export const EDIT_NICKNAME_REQUEST = 'EDIT_NICKNAME_REQUEST'; //액션의 이름
export const EDIT_NICKNAME_SUCCESS = 'EDIT_NICKNAME_SUCCESS';
export const EDIT_NICKNAME_FAILURE = 'EDIT_NICKNAME_FAILURE';

export const ADD_POST_TO_ME = 'ADD_POST_TO_ME'; //'짹짹'에 추가된 게시글 갯수 업데이트
export const REMOVE_POST_OF_ME = 'REMOVE_POST_OF_ME'; //'짹짹'에 삭제된 게시글 갯수 업데이트

export const loginRequestAction = data => ({
    type: LOG_IN_REQUEST,
    data,
});

export const logoutRequestAction = {
    type: LOG_OUT_REQUEST,
};

const reducer = (state = initialState, action) => {
    return produce(state, (draft) => {
        switch(action.type) {
            case LOG_IN_REQUEST: {
                draft.isLoggingIn = true;
                draft.logInErrorReason = '';
                break;
            }
            case LOG_IN_SUCCESS: {
                draft.isLogginIn = false;
                draft.isLoading = false;
                draft.me = action.data;
                break;
            }
            case LOG_IN_FAILURE: {
                draft.isLogginIn = false;
                draft.logInErrorReason = action.error;
                draft.me = null;
                break;
            }
            case LOG_OUT_REQUEST: {
                draft.isLogginOut = true;
                break;
            }
            case LOG_OUT_SUCCESS: {
                draft.isLogginOut = false;
                draft.me = null;
                break;
            }
            case SIGN_UP_REQUEST: {
                draft.isSigningUp = true;
                draft.isSignedUp = false;
                draft.signUpErrorReason = '';
                break;
            }
            case SIGN_UP_SUCCESS: {
                draft.isSigningUp = false;
                draft.isSignedUp = true;
                break;
            }
            case SIGN_UP_FAILURE: {
                draft.isSigningUp = false;
                draft.signUpErrorReason = action.error;
                break;
            }
            case LOAD_USER_REQUEST: {
                break;
            }
            case LOAD_USER_SUCCESS: {
                if (action.me) {
                    draft.me = action.data;
                    break;
                }
                draft.userInfo = action.data;
                break;
            }
            case LOAD_USER_FAILURE: {
                break;
            }
            case FOLLOW_USER_REQUEST: {
                break;
            }
            case FOLLOW_USER_SUCCESS: {
                draft.me.Followings.unshift({ id: action.data });
                break;
            }
            case FOLLOW_USER_FAILURE: {
                break;
            }
            case UNFOLLOW_USER_REQUEST: {
               break;
            }
            case UNFOLLOW_USER_SUCCESS: {
                const followingsIndex = draft.me.Followings.findIndex(v => v.id === action.data);
                const followingListIndex = draft.followingList.findIndex(v => v.id === action.data);
                draft.me.Followings.splice(followingsIndex, 1);
                draft.followingList.splice(followingListIndex, 1);
                break;
            }
            case UNFOLLOW_USER_FAILURE: {
                break;
            }
            case ADD_POST_TO_ME: {
                draft.me.Posts.unshift({id: action.data.id});
                break;
            }
            case REMOVE_POST_OF_ME: {
                const postsIndex = draft.me.Posts.findIndex((v) =>  v.id === action.data);
                draft.me.Posts.splice(postsIndex, 1);
                break;
            }
            case LOAD_FOLLOWERS_REQUEST: {
                //draft.followerList = !action.offset ? [] : draft.followerList;
                draft.hasMoreFollower = action.offset? draft.hasMoreFollower : true;
                break;
            }
            case LOAD_FOLLOWERS_SUCCESS: {
                action.data.forEach((p) => {
                    draft.followerList.push(p);
                });
                draft.hasMoreFollower = action.data.length === 3;
                break;
            }
            case LOAD_FOLLOWERS_FAILURE: {
                break;
            }
            case LOAD_FOLLOWINGS_REQUEST: {
                //draft.followingList = !action.offset ? [] : draft.followingList;
                draft.hasMoreFollowing = action.offset ? state.hasMoreFollowing : true;
                break;
            }
            case LOAD_FOLLOWINGS_SUCCESS: {         
                action.data.forEach((p) => {
                    draft.followingList.push(p);
                });
                draft.hasMoreFollowing = action.data.legnth === 3;
                break;
            }
            case LOAD_FOLLOWINGS_FAILURE: {
                break;
            }
            case REMOVE_FOLLOWER_REQUEST: {
                break;
            }
            case REMOVE_FOLLOWER_SUCCESS: {
                const followersIndex = draft.me.Followers.findIndex(v => v.id === action.data);
                const followerListIndex = draft.followerList.findIndex(v => v.id === action.data);
                draft.me.Followers.splice(followersIndex, 1);
                draft.followerList.splice(followerListIndex, 1); 
                break;
            }
            case REMOVE_FOLLOWER_FAILURE: {
                break;
            }
            case EDIT_NICKNAME_REQUEST: {
                draft.isEditingNickname = true;
                draft.editNicknameErrorReason = action.data;
                break;
            }
            case EDIT_NICKNAME_SUCCESS: {
                draft.isEditingNickname = false;
                draft.me.nickname = action.data;
                break;
            }
            case EDIT_NICKNAME_FAILURE: {
                //draft.isEditingNickname = false;
                //draft.editNicknameErrorReason = action.error;
                break;
            }
            default: {
                break;
            }
        }
    })
}

export default reducer;