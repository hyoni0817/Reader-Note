import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import ImagesZoom from './ImagesZoom';

const PostImages = ({ images }) => {
    const [showImagesZoom, setShowImagesZoom] = useState(false);
    const onZoom = useCallback(() => {
        setShowImagesZoom(true); //이미지를 클릭하면 이미지 Zoom 컴포넌트를 보여주는 state를 true로 만든다. 
    }, []);
    const onClose = useCallback(() => {
        setShowImagesZoom(false);
    }, []);
    if(images.length === 1) {
        return (
            <>
                <img src={`http://localhost:3065/${images[0].src}`} onClick={onZoom} />
                {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />} 
            </>
        );
    }
    if (images.length === 2) {
        return (
            <>
                <div>
                    <img src={`http://localhost:3065/${images[0].src}`} width="50%" onClick={onZoom} />
                    <img src={`http://localhost:3065/${images[1].src}`} width="50%" onClick={onZoom} />
                </div>
                {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
            </>
        );
    }
    return (
        <>
            <div>
                <img src={`http://localhost:3065/${images[0].src}`} width="50%" onClick={onZoom} />
                <div style={{display: 'inline-block', width: '50%', textAlign: 'center', verticalAlign:'middle'}} onClick={onZoom}>
                    <Icon type="plus" />
                    <br />
                    {images.length - 1}
                    개의 사진 더보기
                </div>
            </div>
            {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />} {/** 아마지나 더보기를 클릭하면 해당 라인의 코드가 보일 수 있게 하기. */}          
        </>
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