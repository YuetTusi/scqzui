import React, { FC, MouseEvent, useState } from 'react';
import { useLocation, useDispatch } from 'dva';
import { routerRedux } from 'dva/router';
import debounce from 'lodash/debounce';
import RollbackOutlined from '@ant-design/icons/RollbackOutlined'
import SaveOutlined from '@ant-design/icons/SaveOutlined'
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import { helper } from '@/utils/helper';
import { BaseApp } from '@/schema/base-app';
import { CaseInfo } from '@/schema/case-info';
import { ParseApp } from '@/schema/parse-app';
import { TokenApp } from '@/schema/token-app';
import SubLayout from '@/component/sub-layout/sub-layout';
import { Split } from '@/component/style-tool';
import { CaseBox } from './styled/styled';
import AddForm from './add-form';
import { CaseAddProp, FormValue } from './prop';

const { caseText } = helper.readConf()!;
const { useForm } = Form;

/**
 * 新增案件
 */
const CaseAdd: FC<CaseAddProp> = () => {

    const dispatch = useDispatch();
    const { search } = useLocation();
    const [formRef] = useForm<FormValue>();
    const sdCard = useState<boolean>(true);
    const hasReport = useState<boolean>(true);
    const autoParse = useState<boolean>(true);
    const generateBcp = useState<boolean>(false);
    const attachment = useState<boolean>(false);
    const isDel = useState<boolean>(false);
    const isAi = useState<boolean>(false);
    const parseAppList = useState<BaseApp[]>([]);
    const tokenAppList = useState<BaseApp[]>([]);

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
     * 保存案件
     */
    const saveCase = (entity: CaseInfo) => {
        const params = new URLSearchParams(search);
        dispatch({
            type: 'caseAdd/saveCase',
            payload: {
                entity,
                name: params.get('name')
            }
        });
    }

    /**
     * 保存
     */
    const onSaveClick = debounce(async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const { validateFields } = formRef;
        try {
            const values = await validateFields();
            let entity = new CaseInfo();
            entity.m_strCaseName = `${values.currentCaseName.replace(
                /_/g,
                ''
            )}_${helper.timestamp()}`;
            entity.m_strCasePath = values.m_strCasePath;
            entity.spareName = '';
            entity.m_strCheckUnitName = values.checkUnitName;
            entity.sdCard = sdCard[0];
            entity.hasReport = hasReport[0];
            entity.m_bIsAutoParse = autoParse[0];
            entity.m_Applist = parseAppList[0] as ParseApp[];
            entity.tokenAppList = tokenAppList[0] as TokenApp[];
            entity.generateBcp = generateBcp[0];
            entity.attachment = attachment[0];
            entity.isDel = isDel[0];
            entity.officerNo = values.officerNo;
            // entity.officerName = this.currentOfficerName;
            entity.securityCaseNo = values.securityCaseNo;
            entity.securityCaseType = values.securityCaseType;
            entity.securityCaseName = values.securityCaseName;
            entity.handleCaseNo = values.handleCaseNo;
            entity.handleCaseType = values.handleCaseType;
            entity.handleCaseName = values.handleCaseName;
            entity.isAi = isAi[0];
            entity.aiThumbnail = values.aiThumbnail;
            entity.aiWeapon = values.aiWeapon;
            entity.aiDoc = values.aiDoc;
            entity.aiDrug = values.aiDrug;
            entity.aiNude = values.aiNude;
            entity.aiMoney = values.aiMoney;
            entity.aiDress = values.aiDress;
            entity.aiTransport = values.aiTransport;
            entity.aiCredential = values.aiCredential;
            entity.aiTransfer = values.aiTransfer;
            entity.aiScreenshot = values.aiScreenshot;

            saveCase(entity);
        } catch (error) {
            console.warn(error);
        }
    }, 500, { leading: true, trailing: false });

    return <SubLayout title={`创建新${caseText ?? '案件'}`}>
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
            <AddForm
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
    </SubLayout>
}

export default CaseAdd;