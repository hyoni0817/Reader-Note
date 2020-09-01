//프로필 화면(팔로워 및 팔로잉 목록, 나의 게시글 정보)
import React, { useCallback } from 'react';
import { Button, List, Card, Icon } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import PostCard from '../components/PostCard';
import NicknameEditForm from '../components/NicknameEditForm';
import { LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWINGS_REQUEST, UNFOLLOW_USER_REQUEST, REMOVE_FOLLOWER_REQUEST, } from '../reducers/user';
import { LOAD_USER_POSTS_REQUEST } from '../reducers/post';

const Profile = () => {
    const dispatch = useDispatch();
    const { followingList, followerList } = useSelector(state => state.user);
    const { mainPosts } = useSelector(state => state.post);
    
    const onUnfollow = useCallback( userId => () => {
        dispatch({
            type: UNFOLLOW_USER_REQUEST,
            data: userId,
        })
    }, []);

    const onRemoveFollower = useCallback( userId => () => {
        dispatch({
            type: REMOVE_FOLLOWER_REQUEST,
            data: userId,
        })
    }, []);
    return (
        <div>
            <NicknameEditForm />
            <List 
                style={{ marginBottom: '20px'}}
                grid={{ gutter: 4, xs: 2, md: 3}}
                size="small"
                header={<div>팔로잉 목록</div>}
                loadMore={<Button style={{ width: '100%' }}>더 보기</Button>}
                bordered
                dataSource={ followingList }
                renderItem={item => (
                    <List.Item style={{ marginTop: '20px' }}>
                        <Card actions={[<Icon key="stop" type="stop" onClick={onUnfollow(item.id)} />]}>
                            <Card.Meta description={item.nickname} />
                        </Card>
                    </List.Item>
                )}
            />
            <List 
                style={{ marginBottom: '20px'}}
                grid={{ gutter: 4, xs: 2, md: 3}}
                size="small"
                header={<div>팔로워 목록</div>}
                loadMore={<Button style={{ width: '100%' }}>더 보기</Button>}
                bordered
                dataSource={ followerList }
                renderItem={item => (
                    <List.Item style={{ marginTop: '20px' }}>
                        <Card actions={[<Icon key="stop" type="stop" onClick={onRemoveFollower(item.id)} />]}>
                            <Card.Meta description={item.nickname} />
                        </Card>
                    </List.Item>
                )}
            />
            <div>
            {mainPosts.map(c => (
                    <PostCard key={+c.createdAt} post={c} />
                ))}
            </div>
        </div> 
    );
};

Profile.getInitialProps = async (context) => {
    const state = context.store.getState(); //state를 이용해 me에 접근 가능
    //이 직전에 LOAD_USERS_REQUEST. LOAD_USERS_REQUEST가 먼저 끝나야 state.user.me가 생김. 
    context.store.dispatch({
        type: LOAD_FOLLOWERS_REQUEST,
        data: state.user.me && state.user.me.id, //me가 뒤에 생기기 때문에 data가 null다. null인 경우에는 '나(지신)'이라고 간주한다.(숫자 0을 자신의 아이디로 침. 그래서 서버쪽에서는 아이디가 0이면 내 정보겠구나 하고 생각함.)
    });
    context.store.dispatch({
        type: LOAD_FOLLOWINGS_REQUEST,
        data: state.user.me && state.user.me.id,
    });
    context.store.dispatch({
        type: LOAD_USER_POSTS_REQUEST,
        data: state.user.me && state.user.me.id,
    });

    // 이 쯤에서 LOAD_USERS_SUCCESS 돼서 me가 생김. 그래서 뒤에 me가 생기기 때문에 위에서 사용되는 me는 아직 me가 생성전이라서 접근을 하지 못한다.
    // 해결 방법
    // 1. LOAD_USERS_SUCCESS가 되고난 후에 위의 세가지 액션을 처리해주는 방법 ( 이 방법은 복잡한데다가 시간도 오래 걸림)
    // 2. 네 개의 액션을 동시에 보내면서 정상적으로 동작하는 방법이 가장 좋음.
}
export default Profile;