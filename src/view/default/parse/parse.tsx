import React, { FC, useEffect } from 'react';
import { useDispatch, useLocation } from 'dva';
import SubLayout from '@/component/sub-layout';
import { Split } from '@/component/style-tool';
import { helper } from '@/utils/helper';
import ParsingList from './parsing-list';
import CaseList from './case-list';
import DevList from './dev-list';
import { TableBox, ParseBox, ParsingPanel } from './styled/style';
import { ParseProp } from './prop';

const { caseText, devText, parseText } = helper.readConf()!;

/**
 * 数据解析页
 */
const Parse: FC<ParseProp> = () => {

    const dispatch = useDispatch();
    const { search } = useLocation();

    useEffect(() => {
        const did = new URLSearchParams(search).get('did');
        if (did !== null) {
            dispatch({ type: 'parseDev/setExpandedRowKeys', payload: [did] });
        }
    }, [search]);

    return <SubLayout title={`数据${parseText ?? '解析'}`}>
        <ParseBox>
            <ParsingPanel>
                <ParsingList />
            </ParsingPanel>
            <Split />
            <TableBox>
                <div className="case-list">
                    <div className="title-bar">
                        {caseText ?? '案件'}
                    </div>
                    <div>
                        <CaseList />
                    </div>
                </div>
                <div className="dev-list">
                    <div className="title-bar">
                        {devText ?? '设备'}
                    </div>
                    <div>
                        <DevList />
                    </div>
                </div>
            </TableBox>
        </ParseBox>
    </SubLayout>
};

export default Parse;