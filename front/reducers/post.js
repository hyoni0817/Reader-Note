export const initialState = {
    mainPosts: [{
        id: 1,
        User: {
            id: 1,
            nickname: '둘리', 
        },
        content: '첫 번째 게시물',
        img: 'https://cphoto.asiae.co.kr/listimglink/6/2013051007205672589_1.jpg',
        Comments: [],
    }], //화면에 보일 포스트들
    imagePaths: [], //미리보기 이미지 경로
    addPostErrorReason: false, //포스트 업로드 실패 사유
    isAddingPost: false, //포스트 업로드 중
    postAdded: false, //포스트 업로드 성공
    isAddingComment: false, 
    addCommentErrorReason: '',
    commentAdded: false,
};

const dummyPost = {
    id: 2,// id로 구별을 하기 때문에 id를 잘 달아줘야 한다. 
    User: {
        id: 1,
        nickname: '둘리',
    },
    content: '나는 더미입니다.',
    Comments: [],
};

const dummyComment = {
    User: {
        id: 1,
        nickname: 2,
    },
    createAt: '2020-06-02',
    content: '더미 댓글입니다.',
}

//메인 포스트를 로딩하는 액션
export const LOAD_MAIN_POSTS_REQUEST = 'LOAD_MAIN_POSTS_REQUEST';
export const LOAD_MAIN_POSTS_SUCCESS = 'LOAD_MAIN_POSTS_SUCCESS';
export const LOAD_MAIN_POSTS_FAILURE = 'LOAD_MAIN_POSTS_FAILURE';

//해시태그로 검색했을 때 결과를 로딩하는 액션
export const LOAD_HASHTAG_POSTS_REQUEST = 'LOAD_HASHTAG_POSTS_REQUEST';
export const LOAD_HASHTAG_POSTS_SUCCESS = 'LOAD_HASHTAG_POSTS_SUCCESS';
export const LOAD_HASHTAG_POSTS_FAILURE = 'LOAD_HASHTAG_POSTS_FAILURE';

//사용자가 어떤 게시글들을 작성했는지 로딩하는 액션
export const LOAD_USER_POSTS_REQUEST = 'LOAD_USER_POSTS_REQUEST';
export const LOAD_USER_POSTS_SUCCESS = 'LOAD_USER_POSTS_SUCCESS';
export const LOAD_USER_POSTS_FAILURE = 'LOAD_USER_POSTS_FAILURE';

//이미지 업로드 하는 액션
export const UPLOAD_IMAGES_REQUEST = 'UPLOAD_IMAGES_REQUEST';
export const UPLOAD_IMAGES_SUCCESS = 'UPLOAD_IMAGES_SUCCESS';
export const UPLOAD_IMAGES_FAILURE = 'UPLOAD_IMAGES_FAILURE';

//업로드 한 이미지 취소하는 액션(동기적으로 작동해도 상관 없기 때문에 비동기 아님)
export const REMOVE_IMAGE = 'REMOVE_IMAGE';

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

//하트 버튼 누르는 액션
export const LIKE_POST_REQUEST = 'LIKE_POST_REQUEST';
export const LIKE_POST_SUCCESS = 'LIKE_POST_SUCCESS';
export const LIKE_POST_FAILURE = 'LIKE_POST_FAILURE';

//하트 버튼 취소하는 액션
export const UNLIKE_POST_REQUEST = 'UNLIKE_POST_REQUEST';
export const UNLIKE_POST_SUCCESS = 'UNLIKE_POST_SUCCESS';
export const UNLIKE_POST_FAILURE = 'UNLIKE_POST_FAILURE';

//게시글에 댓글 남기는 액션
export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

//게시글의 댓글 불러오는 액션
export const LOAD_COMMENTS_REQUEST = 'LOAD_COMMENTS_REQUEST';
export const LOAD_COMMENTS_SUCCESS = 'LOAD_COMMENTS_SUCCESS';
export const LOAD_COMMENTS_FAILURE = 'LOAD_COMMENTS_FAILURE';

//리트윗 같은 기능을 담당하는 액션
export const REPOST_REQUEST = 'REPOST_REQUEST';
export const REPOST_SUCCESS = 'REPOST_SUCCESS';
export const REPOST_FAILURE = 'REPOST_FAILURE';

//포스트 지우는 액션
export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_POST_REQUEST: {
            return {
                ...state, 
                isAddingPost: true,
                addPostErrorReason: '',
                postAdded: false,
            }
        }
        case ADD_POST_SUCCESS: {
            return {
                ...state, 
                isAddingPost: false,
                mainPosts: [dummyPost, ...state.mainPosts],
                postAdded: true,
            }
        }
        case ADD_POST_FAILURE: {
            return {
                ...state, 
                isAddingPost: false,
                addPostErrorReason: action.error,
            }
        }

        default: {
            return {
                ...state,
            }
        } //switch문에 default를 꼭 넣어줘야하며, default의 의미는 아무것도 없지만 기존의 state를 넣은 새로운 state 객체를 리턴한다고 적어주면 된다.
    }
}

export default reducer;