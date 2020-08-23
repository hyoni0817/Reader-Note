import React, { useState, useCallback } from 'react';
import { Button, Form, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { EDIT_NICKNAME_REQUEST } from '../reducers/user';

const NicknameEditForm = () => {
    const { me, isEditingNickname } = useSelector(state => state.user);
    const [editedName, setEditedName] = useState(`${me && me.nickname}` || '');
    const dispatch = useDispatch();
    console.log("me:", me)
    //console.log("me.nickname:", me.nickname)
    const onChangedNickname = useCallback((e) => {
        console.log(e.target.value);
        setEditedName(e.target.value);
    }, []);

    const onEditNickname = useCallback((e) => {
        e.preventDefault();
        dispatch({
            type: EDIT_NICKNAME_REQUEST,
            data: editedName,
        })
    }, [editedName]);

    return (
        <Form style={{ marginBottom: '20px', border: '1px solid #d9d9d9', padding: '20px'}} onSubmit={onEditNickname}>
            <Input addonBefore="닉네임" value={editedName} onChange={onChangedNickname} />
            <Button type="primary" htmlType="submit" loading={isEditingNickname}>수정</Button>
        </Form>
    )
}

export default NicknameEditForm;