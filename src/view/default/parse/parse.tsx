import React, { FC } from 'react';
import SubLayout from '@/component/sub-layout';
import { Split } from '@/component/style-tool';
import ParsingList from './parsing-list';
import CaseList from './case-list';
import DevList from './dev-list';
import { TableBox, ParseBox, ParsingPanel } from './styled/style';

const Parse: FC<{}> = () => <SubLayout title="数据解析">
    <ParseBox>
        <ParsingPanel>
            <ParsingList />
        </ParsingPanel>
        <Split />
        <TableBox>
            <div className="case-list">
                <div className="title-bar">
                    案件
                </div>
                <div>
                    <CaseList />
                </div>
            </div>
            <div className="dev-list">
                <div className="title-bar">
                    设备
                </div>
                <div>
                    <DevList />
                </div>
            </div>
        </TableBox>
    </ParseBox>
</SubLayout>;

export default Parse;