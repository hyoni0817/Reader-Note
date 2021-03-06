//회원 가입 화면
import React, { useState, useCallback, useEffect } from 'react';
import { Form, Input, Checkbox, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import styled from 'styled-components';
import { SIGN_UP_REQUEST } from '../reducers/user';

const SignupError = styled.div`
    color: red;
`;

export const useInput = (initValue = null) => {
    const [value, setter] = useState(initValue);
    const handler = useCallback((e) => {
        setter(e.target.value);
    }, []);
    return [value, handler];
}

const Signup = () => {
    const [passwordCheck, setPasswordCheck] = useState('');
    const [term, setTerm] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [termError, setTermError] = useState(false);

    const [id, onChangeId] = useInput('');
    const [nick, onChangeNick] = useInput('');
    const [password, onChangePassword] = useInput('');
    const dispatch = useDispatch();
    const { isSigningUp, me } = useSelector(state => state.user);

    useEffect(() => {
        if(me) {
            alert('로그인 했으니 메인 페이지로 이동합니다.')
            Router.push('/');
        }
    }, [me && me.id]);

    const onSubmit = useCallback((e) => {
        e.preventDefault();
        if(password !== passwordCheck) {
            return setPasswordError(true);
        }
        if(!term) {
            return setTermError(true);
        }
        dispatch({
            type: SIGN_UP_REQUEST,
            data: {
                userId: id,
                password, 
                nickname: nick,
            }
        });
    }, [id, nick, password, passwordCheck, term]);
    
    const onChangePasswordCheck = useCallback((e) => {
        setPasswordError(e.target.value !== password);
        setPasswordCheck(e.target.value);
    }, [password]);
    
    const onChangeTerm = useCallback((e) => {
        setTermError(false);
        setTerm(e.target.checked);
    }, []);

    if (me) { //로그인한 상태면 아예 회원가입 페이지를 보여주지 않게 함.
        return null;
    }

    return (
        <>
            <Form onSubmit={onSubmit} style={{ padding: 10 }}>
                <div>
                    <label htmlFor="user-id">아이디</label>
                    <br />
                    <Input name="user-id" value={id} required onChange={onChangeId} />    
                </div>
                <div>
                    <label htmlFor="user-nick">닉네임</label>
                    <br />
                    <Input name="user-nick" value={nick} required onChange={onChangeNick} />   
                </div>
                <div>
                    <label htmlFor="user-password">비밀번호</label>
                    <br />
                    <Input name="user-password" type="password" value={password} required onChange={onChangePassword} />   
                </div>
                <div>
                    <label htmlFor="user-password-check">비밀번호체크</label>
                    <br />
                    <Input name="user-password-check" type="password" value={passwordCheck} required onChange={onChangePasswordCheck} />   
                    {passwordError && <SignupError>비밀번호가 일치하지 않습니다.</SignupError>}
                </div>
                <div>
                    <Checkbox name="user-term" value={term} onChange={onChangeTerm}>약관에 동의합니다.</Checkbox>   
                    {termError && <SignupError>약관에 동의하셔야 합니다.</SignupError>}
                </div>
                <div style={{ marginTop: 10}}>
                    <Button type="primary" htmlType="submit" loading={isSigningUp}>가입하기</Button>
                    {/* htmlFor과 같이 html에서 button 속성에서 사용하던 type을 react에서는 htmlType이라고 표현한다. */}
                </div>
            </Form>
        </>
    );
};

export default Signup;