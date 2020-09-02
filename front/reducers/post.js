export const initialState = {
    mainPosts: [], //화면에 보일 포스트들
    imagePaths: [], //미리보기 이미지 경로
    addPostErrorReason: false, //포스트 업로드 실패 사유
    isAddingPost: false, //포스트 업로드 중
    postAdded: false, //포스트 업로드 성공
    isAddingComment: false, 
    addCommentErrorReason: '',
    commentAdded: false,
};

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
export const RETWEET_REQUEST = 'RETWEET_REQUEST';
export const RETWEET_SUCCESS = 'RETWEET_SUCCESS';
export const RETWEET_FAILURE = 'RETWEET_FAILURE';

//포스트 지우는 액션
export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case UPLOAD_IMAGES_REQUEST: {
            return {
                ...state, 
            }
        }
        case UPLOAD_IMAGES_SUCCESS: {
            return {
                ...state, 
                imagePaths: [...state.imagePaths, ...action.data], //이미지 미리보기 할 수 있는 경로
            }
        }
        case UPLOAD_IMAGES_FAILURE: {
            return {
                ...state, 
            }
        }

        case REMOVE_IMAGE: {
            return {
                ...state,
                imagePaths: state.imagePaths.filter((v, i) => i !== action.index), //필터링하고싶은 이미지(삭제하고 싶은 이미지)가 빠짐.
            };
        }
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
                mainPosts: [action.data, ...state.mainPosts],
                postAdded: true,
                imagePaths: [],
            }
        }
        case ADD_POST_FAILURE: {
            return {
                ...state, 
                isAddingPost: false,
                addPostErrorReason: action.error,
            }
        }

        case ADD_COMMENT_REQUEST: {
            return {
                ...state, 
                isAddingComment: true,
                addCommentErrorReason: '',
                commentAdded: false,
            }
        }
        case ADD_COMMENT_SUCCESS: {
            const postIndex = state.mainPosts.findIndex(v=>v.id === action.data.postId); //여기서 action은 sagas/post.js의 addComment()를 통해 ADD_COMMNET_SUCCESS로 전달 받은 액션이다. 즉 SUCCESS의 액션이다. 
            const post = state.mainPosts[postIndex];
            const Comments = [...post.Comments, action.data.comment];
            const mainPosts = [...state.mainPosts];
            mainPosts[postIndex] = {...post, Comments};

            return {
                ...state, 
                isAddingComment: false,
                mainPosts,
                commentAdded: true,
            }
        }
        case ADD_COMMENT_FAILURE: {
            return {
                ...state, 
                isAddingComment: false,
                addCommentErrorReason: action.error,
            }
        }

        case LOAD_COMMENTS_SUCCESS: {
            const postIndex = state.mainPosts.findIndex(v => v.id === action.data.postId);
            const post = state.mainPosts[postIndex];
            const Comments = action.data.comments;
            const mainPosts = [...state.mainPosts];
            mainPosts[postIndex] = { ...post, Comments };
            return {
                ...state,
                mainPosts,
            };
        }
        //공통된 작업을 수행한다면 아래와 같이 case를 3개 연달아서 사용할 수 있다.
        case LOAD_MAIN_POSTS_REQUEST: 
        case LOAD_HASHTAG_POSTS_REQUEST: 
        case LOAD_USER_POSTS_REQUEST: {
            return {
                ...state, 
                mainPosts: [],
            }
        }
        case LOAD_MAIN_POSTS_SUCCESS: 
        case LOAD_HASHTAG_POSTS_SUCCESS: 
        case LOAD_USER_POSTS_SUCCESS: {
            return {
                ...state, 
                mainPosts: action.data, //서버로 부터 받은 데이터
            }
        }
        case LOAD_MAIN_POSTS_FAILURE: 
        case LOAD_HASHTAG_POSTS_FAILURE: 
        case LOAD_USER_POSTS_FAILURE: {
            return {
                ...state, 
            }
        }
        case LIKE_POST_REQUEST: {
            return {
                ...state, 
            }
        }
        case LIKE_POST_SUCCESS: {
            const postIndex = state.mainPosts.findIndex(v => v.id === action.data.postId); //게시글 찾기
            const post = state.mainPosts[postIndex];
            const Likers = [{ id: action.data.userId }, ...post.Likers]; //좋아요 목록을 누른 사람들에 자신의 아이디 추가
            const mainPosts = [...state.mainPosts];
            mainPosts[postIndex] = {...post, Likers};
            return {
                ...state, 
                mainPosts,
            }
        }
        case LIKE_POST_FAILURE: {
            return {
                ...state, 
            }
        }

        case UNLIKE_POST_REQUEST: {
            return {
                ...state, 
            }
        }
        case UNLIKE_POST_SUCCESS: {
            const postIndex = state.mainPosts.findIndex(v => v.id === action.data.postId); //게시글 찾기
            const post = state.mainPosts[postIndex];
            const Likers = post.Likers.filter(v => v.id !== action.data.userId); //필터링으로 좋아요 누른 아이디 목록에서 자신의 아이디를 빼는 것은 좋아요를 누르지 않은 것과 같다.
            const mainPosts = [...state.mainPosts];
            mainPosts[postIndex] = {...post, Likers};
            return {
                ...state, 
                mainPosts,
            }
        }
        case UNLIKE_POST_FAILURE: {
            return {
                ...state, 
            }
        }

        case RETWEET_REQUEST: {
            return {
                ...state, 
            }
        }
        case RETWEET_SUCCESS: {
            //retweetWithPrevPost가 action.data에 값이 들어가져 있다.
            return {
                ...state, 
                mainPosts: [action.data, ...state.mainPosts], //기존 게시글(state.mainPosts) 앞에 받아온 게시글(actio.data) 포함만 시켜주면 됨.
            }
        }
        case RETWEET_FAILURE: {
            return {
                ...state, 
            }
        }
        
        case REMOVE_POST_REQUEST: {
            return {
                ...state, 
            }
        }
        case REMOVE_POST_SUCCESS: {
            return {
                ...state, 
                mainPosts: state.mainPosts.filter(v => v.id !== action.data), 
            }
        }
        case REMOVE_POST_FAILURE: {
            return {
                ...state, 
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