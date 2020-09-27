import React, {memo} from 'react';
import { Button, Card, Icon, List } from 'antd';
import PropTypes from 'prop-types';

const FollowList = memo(({ header, hasMore, onClickMore, data, onClickStop }) => {
    return (
        <List 
            style={{ marginBottom: '20px'}}
            grid={{ gutter: 4, xs: 2, md: 3}}
            size="small"
            header={<div>{header}</div>}
            loadMore={ hasMore && <Button style={{ width: '100%' }} onClick={onClickMore}>더 보기</Button>}
            bordered
            dataSource={data}
            renderItem={item => (
                <List.Item style={{ marginTop: '20px' }}>
                    <Card actions={[<Icon key="stop" type="stop" onClick={onClickStop(item.id)} />]}>
                        <Card.Meta description={item.nickname} />
                    </Card>
                </List.Item>
            )}
        />
    )
});
//팔로워와 팔로잉 목록 코드 중 서로 다른 부분은 props에 둔다.
FollowList.propTypes = {
    header: PropTypes.string.isRequired,
    hasMore: PropTypes.bool.isRequired,
    onClickMore: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
    onClickStop: PropTypes.func.isRequired,
}

export default FollowList;