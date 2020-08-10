import React, { useState, useCallback, useEffect } from 'react';
import { Card, Icon, Button, Avatar, List, Form, Input, Comment} from 'antd';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux'; 
import { ADD_COMMENT_REQUEST, LOAD_COMMENTS_REQUEST, UNLIKE_POST_REQUEST, LIKE_POST_REQUEST  } from '../reducers/post';
import PostImages from './PostImages';

const PostCard = ({ post }) => {
    const [ commentFormOpened, setCommentFormOpened ] = useState(false);
    const [commentText, setCommentText] = useState('');
    const { me } = useSelector(state => state.user); 
    const { commentAdded, isAddingComment } = useSelector(state => state.post);
    const dispatch = useDispatch();

    const liked = post.Likers && post.Likers.find(v => v.id === me.id);

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

    return (
        <div>
        <Card
            key={+post.createdAt}
            cover={post.Images[0] && <PostImages images={post.Images} />}
            actions={[
                <Icon type="retweet" key="retweet" />,
                <Icon type="heart" key="heart" theme={ liked ? 'twoTone' : 'outlined'} twoToneColor="#eb2f96" onClick={onToggleLike} />,
                <Icon type="message" key="message" onClick={onToggleComment} />,
                <Icon type="ellipsis" key="ellipsis" />,
            ]}
            extra={<Button>팔로우</Button>}
        >
            <Card.Meta
                avatar={<Link href={{ pathname: '/user', query: {id: post.User.id}}} as={`/user/${post.User.id}`}><a><Avatar>{post.User.nickname[0]}</Avatar></a></Link>}
                title={post.User.nickname}
                description={(
                    <div>
                        {post.content.split(/(#[^\s]+)/g).map((v) => {
                            if(v.match(/#[^\s]+/)){ //쪼갠 애들이 해시태그이면 링크로 쪼개줌
                                return (
                                    <Link 
                                        href={{ pathname: '/hashtag', query: { tag: v.slice(1) }}} as={`/hashtag/${v.slice(1)}`} 
                                        key={v}><a>{v}
                                    </a></Link>
                                )
                            }
                            return v;
                        })}
                    </div>
                )}
            />
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