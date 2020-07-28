import React, {useCallback, useState, useEffect, useRef } from 'react';
import { Form, Input, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { ADD_POST_REQUEST, UPLOAD_IMAGES_REQUEST, REMOVE_IMAGE } from '../reducers/post';

const PostForm = () => {
    const dispatch = useDispatch();
    const [text, setText] = useState('');
    const { imagePaths, isAddingPost, postAdded } = useSelector(state => state.post); //imagePaths가 이미지 미리보기 이다.
    const imageInput = useRef();

    useEffect(() => {
        setText('');
    },[postAdded === true]);

    const onSubmit = useCallback((e)=> {
        e.preventDefault();
        if (!text || !text.trim()) { //trim은 문자열의 양쪽 공백을 제거해주는 것.(스페이스만 쳐서 글을 작성하는 사람들을 막을 수 있다.)
            return alert('게시글을 작성하세요.')
        }
        dispatch({
            type: ADD_POST_REQUEST,
            data: {
                content: text,
            }
        })
    }, [text]);

    const onChangeText = useCallback((e) => {
        setText(e.target.value);
    }, [])

    const onChangeImages = useCallback((e) => {
        //실제 이미지를 업로드 했을 떄 작동함.
        //이미지만 따로 올리는 작업
        console.log(e.target.files);
        const imageFormData = new FormData(); //FormData는 브라우저에서 제공하는 객체인데 여기에 이미지 파일들을 하나씩 넣어줘야 한다. 
        [].forEach.call(e.target.files, (f) => {
            imageFormData.append('image', f); //append의 첫번째 인수인 name 부분은 서버쪽에서도 이걸로 인식하기 때문에 이 부분의 이름을 정확하게 지정해줘야 한다.
        });
        dispatch({
            type: UPLOAD_IMAGES_REQUEST,
            data: imageFormData,
        })
    }, []);

    const onClickImageUpload = useCallback(() => {
        imageInput.current.click(); //<Button>을 눌렀을 떄 input이 열리는 효과를 나게 함.
    }, [imageInput.current]); //라벨을 클릭했을 때 이미지를 업로드할 수 있는 input 창이 열리게 함.

    const onRemoveImage = useCallback(index => () => { 
        dispatch({
            type: REMOVE_IMAGE,
            index,
        });
    }, []); 
    return (
        <Form style={{ margin: '10px 0 20px' }} encType="mutipart/form-data" onSubmit={onSubmit}>
                    <Input.TextArea maxLength={140} placeholder="어떤 신기한 일이 있었나요?" value={text} onChange={onChangeText} />
                    <div>
                        <input type="file" multiple hidden ref={imageInput} onChange={onChangeImages} />
                        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
                        <Button type="primary" style={{ float: 'right' }} htmlType="submit" loading={isAddingPost}>쨱쨱</Button>
                    </div>
                    <div>
                        {/* 이미지 미리보기 */}
                        {imagePaths.map((v, i)=> (
                            <div key={v} style={{ display: 'inline-block' }}>
                                <img src={`http://localhost:3065/${v}`} style={{ width: '200px'}} alt={v} />
                                <div>
                                    <Button onClick={onRemoveImage(i)}>제거</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Form>
    )
}

export default PostForm;