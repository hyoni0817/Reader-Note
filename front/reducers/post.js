export const initialState = {
    mainPosts: [{
        User: {
            id: 1,
            nickname: '둘리', 
        },
        content: '첫 번째 게시물',
        img: 'https://cphoto.asiae.co.kr/listimglink/6/2013051007205672589_1.jpg',
    }],
    imagePaths: [],
};

const ADD_POST = 'ADD_POST';
const ADD_DUMMY = 'ADD_DUMMY';

export const addPost = {
    type: ADD_POST,
};

export const addDummy = {
    type: ADD_DUMMY,
    data: {
        content: 'Hello',
        UserId: 1,
        User: {
            nickname: '제로초',
        }
    }
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_POST: {
            return {
                ...state, 
            }
        }
        case ADD_DUMMY: {
            return {
                ...state, 
                mainPosts: [action.data, ...state.mainPosts],
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