import { join } from 'path';
import debounce from 'lodash/debounce';
import React, { FC, MouseEvent, useEffect, useState } from 'react';
import { useDispatch, useLocation, useParams, useSelector } from 'dva';
import { routerRedux } from 'dva/router';
import RollbackOutlined from '@ant-design/icons/RollbackOutlined'
import SaveOutlined from '@ant-design/icons/SaveOutlined'
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import SubLayout from '@/component/sub-layout';
import { Split } from '@/component/style-tool';
import { StateTree } from '@/type/model';
import { CaseEditState } from '@/model/default/case-edit';
import { helper } from '@/utils/helper';
import CaseInfo from '@/schema/case-info';
import { BaseApp } from '@/schema/base-app';
import { ParseApp } from '@/schema/parse-app';
import { TokenApp } from '@/schema/token-app';
import EditForm from './edit-form';
import { CaseBox } from './styled/styled';
import { CaseEditProp } from './prop';

const { useForm } = Form;

/**
 * 取得案件名称
 */
export const getCaseName = (name?: string): [string, string] => {
    let caseName: string = '';
    let timestamp: string = '';
    if (name === undefined) {
        return ['', ''];
    } else if (name.includes('_')) {
        [caseName, timestamp] = name.split('_');
    } else {
        caseName = name;
        timestamp = '';
    }
    return [caseName, timestamp];
}

const CaseEdit: FC<CaseEditProp> = () => {

    const dispatch = useDispatch();
    const { data } = useSelector<StateTree, CaseEditState>(state => state.caseEdit);
    const { search } = useLocation();
    const { id } = useParams<{ id: string }>();
    const [formRef] = useForm<CaseInfo>();
    const sdCard = useState<boolean>(true);
    const hasReport = useState<boolean>(true);
    const autoParse = useState<boolean>(true);
    const generateBcp = useState<boolean>(false);
    const attachment = useState<boolean>(false);
    const isDel = useState<boolean>(false);
    const isAi = useState<boolean>(false);
    const parseAppList = useState<BaseApp[]>([]);
    const tokenAppList = useState<BaseApp[]>([]);


    useEffect(() => {
        dispatch({ type: 'caseEdit/queryById', payload: id });
        return () => {
            dispatch({ type: 'caseEdit/setData', payload: null });
        }
    }, []);

    useEffect(() => {
        if (parseAppList[0].length === 0) {
            //首次加载时，将数据库中案件的解析应用列表数据赋值给parseAppList
            parseAppList[1](data?.m_Applist ? data.m_Applist : []);
        }
    }, [data?.m_Applist]);
    useEffect(() => {
        if (tokenAppList[0].length === 0) {
            //首次加载时，将数据库中案件的云取证应用列表数据赋值给cloudAppList
            tokenAppList[1](data?.tokenAppList ? data.tokenAppList : []);
        }
    }, [data?.tokenAppList]);

    useEffect(() => {
        if (data !== null) {
            formRef.setFieldsValue({
                ...data,
                m_strCaseName: getCaseName(data.m_strCaseName)[0]
            });
            sdCard[1](data?.sdCard ?? true);
            hasReport[1](data?.hasReport ?? true);
            autoParse[1](data?.m_bIsAutoParse ?? true);
            generateBcp[1](data?.generateBcp ?? false);
            attachment[1](data?.attachment ?? false);
            isDel[1](data?.isDel ?? false);
            isAi[1](data?.isAi ?? false);
            dispatch({
                type: 'aiSwitch/readAiConfig',
                payload: { casePath: join(data.m_strCasePath, data.m_strCaseName) }
            });
        }
    }, [data]);


    /**
     * 保存案件
     */
    const saveCase = (data: CaseInfo) =>
        dispatch({ type: 'caseEdit/saveCase', payload: data });

    /**
     * 返回Click
     */
    const onBackClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const params = new URLSearchParams(search);
        if (helper.isNullOrUndefined(params.get('name'))) {
            dispatch(routerRedux.push('/case-data'));
        } else {
            dispatch(routerRedux.push('/collect'));
        }
    };

    /**
     * 保存Click
     */
    const onSaveClick = debounce(async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const { validateFields } = formRef;
        try {
            const values = await validateFields();
            let entity = new CaseInfo();
            entity._id = id;
            entity.m_strCaseName = values.m_strCaseName;
            entity.spareName = values.spareName;
            entity.m_strCasePath = values.m_strCasePath;
            entity.m_strCheckUnitName = values.m_strCheckUnitName;
            entity.sdCard = sdCard[0];
            entity.hasReport = hasReport[0];
            entity.m_bIsAutoParse = autoParse[0];
            entity.generateBcp = generateBcp[0];
            entity.attachment = attachment[0];
            entity.isDel = isDel[0];
            entity.m_Applist = parseAppList[0] as ParseApp[];
            entity.tokenAppList = tokenAppList[0] as TokenApp[];
            entity.officerNo = values.officerNo;
            entity.securityCaseNo = values.securityCaseNo;
            entity.securityCaseType = values.securityCaseType;
            entity.securityCaseName = values.securityCaseName;
            entity.handleCaseNo = values.handleCaseNo;
            entity.handleCaseType = values.handleCaseType;
            entity.handleCaseName = values.handleCaseName;
            entity.isAi = isAi[0];
            saveCase(entity);
        } catch (error) {
            console.clear();
            console.warn(error);
        }
    }, 500, { leading: true, trailing: false });

    return <SubLayout title={`案件编辑 - ${getCaseName(data?.m_strCaseName)[0]}`}>
        <CaseBox>
            <div className="button-bar">
                <Button onClick={onBackClick} type="primary">
                    <RollbackOutlined />
                    <span>返回</span>
                </Button>
                <Button onClick={onSaveClick} type="primary">
                    <SaveOutlined />
                    <span>保存</span>
                </Button>
            </div>
            <Split />
            <EditForm
                formRef={formRef}
                sdCardState={sdCard}
                hasReportState={hasReport}
                autoParseState={autoParse}
                generateBcpState={generateBcp}
                attachmentState={attachment}
                isDelState={isDel}
                isAiState={isAi}
                parseAppListState={parseAppList}
                tokenAppListState={tokenAppList} />
        </CaseBox>
    </SubLayout>;
};

export default CaseEdit