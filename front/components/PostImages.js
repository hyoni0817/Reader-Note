import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

const PostImages = ({ images }) => {
    if(images.length === 1) {
        return (
            <img src={`http://localhost:3065/${images[0].src}`} />
        );
    }
    if (images.length === 2) {
        return (
            <div>
                <img src={`http://localhost:3065/${images[0].src}`} width="50%" />
                <img src={`http://localhost:3065/${images[1].src}`} width="50%" />
            </div>
        );
    }
    return (
        <div>
            <img src={`http://localhost:3065/${images[0].src}`} width="50%" />
            <div style={{display: 'inline-block', width: '50%', textAlign: 'center', verticalAlign:'middle'}}>
                <Icon type="plus" />
                <br />
                {images.length - 1}
                개의 사진 더보기
            </div>
        </div>
    );
};

PostImages.propType = {
    //images: PropTypes.arrayOf(PropTyps.object).isRequired,
    //아래와 같은 방식으로 작성해줘도 된다. (Object를 구체화해서 적어주는 것이 Shape다.)
    images: PropTypes.arrayOf(PropTypes.shape({
        src: PropTypes.string,
    })).isRequired,
}

export default PostImages;