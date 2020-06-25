export const initialState = {
    mainPosts: [{
        User: {
            id: 1,
            nickname: '둘리', 
        },
        content: '첫 번째 게시물',
        img: 'https://cphoto.asiae.co.kr/listimglink/6/2013051007205672589_1.jpg',
    }], //화면에 보일 포스트들
    imagePaths: [], //미리보기 이미지 경로
    addPostErrorReason: false, //포스트 업로드 실패 사유
    isAddingPost: false, //포스트 업로드 중
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        default: {
            return {
                ...state,
            }
        } //switch문에 default를 꼭 넣어줘야하며, default의 의미는 아무것도 없지만 기존의 state를 넣은 새로운 state 객체를 리턴한다고 적어주면 된다.
    }
}

export default reducer;