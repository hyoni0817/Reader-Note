import React, { useState, useCallback, useEffect } from 'react';
import { Card, Icon, Button, Avatar, List, Form, Input, Comment} from 'antd';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux'; 
import { ADD_COMMENT_REQUEST, LOAD_COMMENTS_REQUEST, UNLIKE_POST_REQUEST, LIKE_POST_REQUEST, RETWEET_REQUEST, } from '../reducers/post';
import { FOLLOW_USER_REQUEST, UNFOLLOW_USER_REQUEST } from '../reducers/user';
import PostImages from './PostImages';
import PostCardContent from './PostCardContent';

const PostCard = ({ post }) => {
    const [ commentFormOpened, setCommentFormOpened ] = useState(false);
    const [commentText, setCommentText] = useState('');
    const { me } = useSelector(state => state.user); 
    const { commentAdded, isAddingComment } = useSelector(state => state.post);
    const dispatch = useDispatch();

    const liked = me && post.Likers && post.Likers.find(v => v.id === me.id);

    const onToggleComment = useCallback(() => {
        setCommentFormOpened(prev => !prev);
        if(!commentFormOpened) { //닫혀있는 댓글창 켜기
            dispatch({
                type: LOAD_COMMENTS_REQUEST,
                data: post.id,
            })
        }
    }, []);

    const onSubmitComment = useCallback((e) => {
        e.preventDefault();
        if(!me) {
            return alert('로그인이 필요합니다.')
        }
        return dispatch({
            type: ADD_COMMENT_REQUEST,
            data: {
                postId: post.id,
                content: commentText,
            }
        })
    }, [me && me.id, commentText]); 

    useEffect(() => {
        setCommentText('');
    }, [commentAdded === true])

    const onChangeCommentText = useCallback((e) => {
        setCommentText(e.target.value);
    }, [])
    //console.log(post.Images[0].src);

    const onToggleLike = useCallback(() => {
        if (!me) {
            return alert('로그인이 필요합니다!');
        }

        //likers라는 배열 안에 누가 좋아요를 눌렀는지 id(좋아요를 누른 사람들의 id)들이 배열로 들어있음.
        if (liked) { //좋아요 누른 상태
            return dispatch({
                type: UNLIKE_POST_REQUEST,
                data: post.id,
            })
        } else { //좋아요 안 누른 상태
            dispatch({
                type: LIKE_POST_REQUEST,
                data: post.id,
            });
        }
        
    }, [me && me.id, post && post.id, liked]);

    const onRetweet = useCallback(() => {
        if ( !me ) {
            return alert('로그인이 필요합니다.');
        }
        return dispatch({
            type: RETWEET_REQUEST,
            data: post.id,
        })
    }, [me && me.id, post && post.id]);

    const onFollow = useCallback(userId => () => {
        dispatch({
            type: FOLLOW_USER_REQUEST,
            data: userId,
        })
    }, []);

    const onUnfollow = useCallback(userId => () => {
        dispatch({
            type: UNFOLLOW_USER_REQUEST,
            data: userId,
        })
    }, []);
    return (
        <div>
        <Card
            key={+post.createdAt}
            cover={post.Images[0] && <PostImages images={post.Images} />}
            actions={[
                <Icon type="retweet" key="retweet" onClick={onRetweet}/>,
                <Icon type="heart" key="heart" theme={ liked ? 'twoTone' : 'outlined'} twoToneColor="#eb2f96" onClick={onToggleLike} />,
                <Icon type="message" key="message" onClick={onToggleComment} />,
                <Icon type="ellipsis" key="ellipsis" />,
            ]}
            title={post.RetweetId ? `${post.User.nickname}님이 리트윗하셨습니다.` : null}
            extra={
                !me || post.User.id === me.id //로그인 안했을 때, 자신의 게시글일 때 follow, unfollow 버튼 안뜸
                ? null
                : me.Followings && me.Followings.find(v => v.id === post.User.id) //내 팔로잉 목록에 작성자의 id가 존재한다면 팔로우 취소버튼 필요
                    ? <Button onClick={onUnfollow(post.User.id)}>언팔로우</Button>
                    : <Button onClick={onFollow(post.User.id)}>팔로우</Button>
            }
        >
            {/* 리트윗을 한 게시물인지 아닌지를 구별하여 postCard를 보여줌 그리고 구별을 하면서 중복되던 코드는 PostCardContent 컴포넌트로 분리시켜서 중복을 제거해줌.  */}
            {/* 리트윗 객체안에 리트윗한 내용이 들어 있음. */}
            {post.RetweetId && post.Retweet ?
                (
                //리트윗한 경우
                <Card
                    cover={post.Retweet.Images[0] && <PostImages images={post.Retweet.Images} />} //리트윗한 게시글에서 원본 게시글을 보여줘야 하기 때문에 post.Retweet 사용
                >
                    <Card.Meta
                        avatar={(
                            <Link href={{ pathname: '/user', query: {id: post.Retweet.User.id}}} as={`/user/${post.Retweet.User.id}`}>
                                <a><Avatar>{post.Retweet.User.nickname[0]}</Avatar></a>
                            </Link>
                        )}
                        title={post.Retweet.User.nickname}
                        description={<PostCardContent postData={post.Retweet.content} />}
                    />  
                </Card>
                )
                : (
                //리트윗안 한 경우
                <Card.Meta
                    avatar={<Link href={{ pathname: '/user', query: {id: post.User.id}}} as={`/user/${post.User.id}`}><a><Avatar>{post.User.nickname[0]}</Avatar></a></Link>}
                    title={post.User.nickname}
                    description={<PostCardContent postData={post.content} />}
                />  
            )}
        </Card>
            {commentFormOpened && (
                <>
                    <Form onSubmit={onSubmitComment}>
                        <Form.Item>
                            <Input.TextArea rows={4} value={commentText} onChange={onChangeCommentText} />
                        </Form.Item>
                        <Button type="primary" htmlType="submit" loading={isAddingComment}>삐약</Button>
                    </Form>
                    <List
                        header={`${post.Comments ? post.Comments.length : 0} 댓글`}
                        itemLayout="horizontal"
                        dataSource={post.Comments || []}
                        renderItem={item => (
                            <li>
                                <Comment
                                    autor={item.User.nickname}
                                    avatar={<Link href={{ pathname: '/user', query: {id: item.User.id}}} as={`/user/${item.User.id}`}><a><Avatar>{item.User.nickname[0]}</Avatar></a></Link>}
                                    datetime={item.createAt}
                                    content={item.content}
                                />
                            </li>
                        )}
                    />
                </>
            )}
        </div>
    )
}

PostCard.propTypes = {
    post: PropTypes.shape({
        User: PropTypes.object,
        content: PropTypes.string,
        img: PropTypes.string,
        createAt: PropTypes.object,
    }),
};
//Object라고 써도 되지만 shape은 객체 안에 데이터 형태를 상세하게 쓸 수 있다.

export default PostCard;