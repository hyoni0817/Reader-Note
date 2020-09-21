import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Slick from 'react-slick'; //이미지 슬라이더 역할
import { Overlay, Header, CloseBtn, SlickWrapper, ImgWrapper, Indicator } from './style';

const ImagesZoom = ({ images, onClose }) => {
    const [currentSlide, setCurrentSlide] = useState(0); //currentSlide는 전체 이미지 중에 몇번째 것을 보고 있는지 알려줌.
    return (
        <Overlay>
            <Header>
                <h1>상세 이미지</h1>
                <CloseBtn type="close" onClick={onClose} />
            </Header>
            <SlickWrapper>
                <div>
                    <Slick
                        initialSlide={0}
                        afterChange={slide => setCurrentSlide(slide)}
                        infinite={false}
                        arrows
                        slidesToShow={1}
                        slidesToScroll={1}
                    >
                        {images.map((v) => {
                            return (
                                <ImgWrapper>
                                    <img src={`http://localhost:3065/${v.src}`} />
                                </ImgWrapper>
                            )
                        })}
                    </Slick>
                    <Indicator>
                        <div>{currentSlide + 1} / {images.length}</div>
                    </Indicator>
                </div>
            </SlickWrapper>
        </Overlay>

    )
};

ImagesZoom.propTypes = {
    images: PropTypes.arrayOf(PropTypes.shape({
        src: PropTypes.string,
    })).isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ImagesZoom;