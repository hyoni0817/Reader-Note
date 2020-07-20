import React, {useCallback, useState, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { ADD_POST_REQUEST } from '../reducers/post';

const PostForm = () => {
    const dispatch = useDispatch();
    const [text, setText] = useState('');
    const { imagePaths, isAddingPost, postAdded } = useSelector(state => state.post);

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
    }, []);

    const onChangeText = useCallback((e) => {
        setText(e.target.value);
    }, [])

    return (
        <Form style={{ margin: '10px 0 20px' }} encType="mutipart/form-data" onSubmit={onSubmit}>
                    <Input.TextArea maxLength={140} placeholder="어떤 신기한 일이 있었나요?" value={text} onChange={onChangeText} />
                    <div>
                        <input type="file" multiple hidden />
                        <Button>이미지 업로드</Button>
                        <Button type="primary" style={{ float: 'right' }} htmlType="submit" loading={isAddingPost}>쨱쨱</Button>
                    </div>
                    <div>
                        {/* 이미지 미리보기 */}
                        {imagePaths.map((v) => (
                            <div key={v} style={{ display: 'inline-block' }}>
                                <img src={`http://localhost:3065/${v}`} style={{ width: '200px'}} alt={v} />
                                <div>
                                    <Button>제거</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Form>
    )
}

export default PostForm;