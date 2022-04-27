import React, { FC } from 'react';
import Empty from 'antd/lib/empty';

/**
 * 列表组件
 */
const List: FC<{ list: string[]; prefix?: string }> = ({ list, prefix }) => {
    if (list.length === 0) {
        return <Empty description="暂无数据" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    } else {
        return <ul>
            {list.map((item, index) =>
                item === '' ? null : <li key={`${prefix}_${index}`}>{item}</li>
            )}
        </ul>;
    }
};

List.defaultProps = {
    prefix: 'L'
};

export { List };
