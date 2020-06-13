import React from 'react';
import { Card, Icon, Button, Avatar} from 'antd';
import PropTypes from 'prop-types';

const PostCard = ({ post }) => {
    return (
        <Card
            key={+post.createAt}
            cover={post.img && <img alt="example" src={post.img} />}
            actions={[
                <Icon type="retweet" key="retweet" />,
                <Icon type="heart" key="heart" />,
                <Icon type="message" key="message" />,
                <Icon type="ellipsis" key="ellipsis" />,
            ]}
            extra={<Button>팔로우</Button>}
        >
            <Card.Meta
                avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
                title={post.User.nickname}
                description={post.content}
            />
        </Card>
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