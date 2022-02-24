import React, { FC } from 'react';
import SubLayout from '@/component/sub-layout';
import { CollectProp } from './prop';

const Collect: FC<CollectProp> = ({ }) => {

    return <SubLayout title="设备取证">
        <div style={{ width: '100%', height: '200px', backgroundColor: '#efefef' }}>
            取证页
        </div>
    </SubLayout>
};

export default Collect;