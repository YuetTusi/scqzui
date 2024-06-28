import React, { FC, memo } from 'react';
import { Spin } from 'antd';
import { TreeLoadingBox } from './styled/box';

const TreeLoading: FC<{ loading: boolean }> = memo(({ loading }) => <TreeLoadingBox
    style={{ display: loading ? 'flex' : 'none' }}>
    <Spin />
</TreeLoadingBox>);

export { TreeLoading };