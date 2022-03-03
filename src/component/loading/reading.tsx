import React, { FC } from 'react';
import { useSelector } from 'dva';
import Spin from 'antd/lib/spin';
import { StateTree } from '@/type/model';
import { AppSetStore } from '@/model/default/app-set';
import { ReadingBox } from './styled/style';

/**
 * 全局遮罩
 */
const Reading: FC<{}> = () => {

    const { reading } = useSelector<StateTree, AppSetStore>((state) => state.appSet);

    return <ReadingBox style={{ display: reading ? 'flex' : 'none' }}>
        <Spin size="large" />
    </ReadingBox>
};

export default Reading;