import styled from 'styled-components';
import { Icon } from 'antd';

//아래 styled-component는 변수이기 때문에 export 를 사용해서 모듈로 만들어서 쓸 수도 있다. 
export const Overlay = styled.div`
    position: fixed;
    z-index: 5000;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
`;

//아래 & h1의 의미는 heder안에 들어있는 h1이라는 의미다.
// & 는 자기자신을 가리키는 태그
//header와 같이 대표적인 것만 css 컴포넌트로 만들고 나머지는 css 선택자(ex. >나 . 같은 것)로 만든다.
export const Header = styled.header`
    height: 44px;
    background: white;
    position: relative;
    padding; 0;
    text-align: center;

    & h1 {
        margin: 0;
        font-size: 17px;
        color: #333;
        line-height: 44px;
    }
`;

export const SlickWrapper = styled.div`
    height: calc(100% - 44px);
    background: #090909;
`;

//Icon 같은 경우에는 styled component인데 style이 이미 적용되어 있지만 바꿀 수도 있다. 즉, 기존 컴포넌트도 styled-component로 css를 덮어 씌울 수 있다.  
export const CloseBtn = styled(Icon)`
    position: absolute;
    right: 0;
    top: 0;
    padding: 15px;
    line-height: 14px;
    cursor: pointer;
`;

export const Indicator = styled.div`
    text-align: center;

    & > div {
        width: 75px;
        height: 30px;
        line-height: 30px;
        border-radius: 15px;
        background: #313131;
        display: inline-block;
        text-align: center;
        color: white;
        font-size: 15px;
    }
`;

export const ImgWrapper = styled.div`
    padding: 32px;
    text-align: center;

    & img {
        margin: 0 auto;
        max-height: 750px;
    }
`;
