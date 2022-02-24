import React, { FC } from 'react';
import ContentBox from './content-box/content-box';
import { CollectProp } from './prop';
import { SubLayout } from './styled/sub-layout';

const Collect: FC<CollectProp> = ({ }) => {

    return <SubLayout>
        <ContentBox title="设备取证">
            <div style={{width: '100%', height: '800px',backgroundColor: '#efefef'}}>
            取证页
            </div>
        </ContentBox>
    </SubLayout>
};

export default Collect;