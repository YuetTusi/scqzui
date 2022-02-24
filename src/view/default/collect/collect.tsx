import React, { FC } from 'react';
import ContentBox from './content-box/content-box';
import { SubLayout } from './styled/sub-layout';
import { CollectProp } from './prop';

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