import React, { FC, memo } from 'react';
import Spin from 'antd/lib/spin';
import { ReadingBox } from './styled/style';

/**
 * 加载视图等待组件
 */
const LoadView: FC<{}> = () =>
    <ReadingBox style={{ display: 'flex' }}>
        <Spin size="large" />
    </ReadingBox>;

export default memo(LoadView);