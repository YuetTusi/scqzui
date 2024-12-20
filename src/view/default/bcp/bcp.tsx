import { join } from 'path';
import { execFile } from 'child_process';
import React, { FC, useEffect, useRef, MouseEvent } from 'react';
import { useDispatch, useLocation, useParams, useSelector, routerRedux } from 'dva';
import InteractionOutlined from '@ant-design/icons/InteractionOutlined';
import RollbackOutlined from '@ant-design/icons/RollbackOutlined';
import message from 'antd/lib/message';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import logger from '@/utils/log';
import { getDb } from '@/utils/db';
import { helper } from '@/utils/helper';
import { useCase, useDevice, useDstUnit, useUnit } from '@/hook';
import { StateTree } from '@/type/model';
import { BcpHistoryState } from '@/model/default/bcp-history';
import SubLayout from '@/component/sub-layout';
import { Split } from '@/component/style-tool';
import DeviceInfo from '@/component/device-info';
import { SortPanel } from '@/component/style-tool/split';
import { BcpEntity } from '@/schema/bcp-entity';
import { Officer } from '@/schema/officer';
import { TableName } from '@/schema/table-name';
import GenerateForm, { FormValue } from './generate-form';
import { BcpBox, ButtonBar, FormPanel } from './styled/style';
import { BcpProp } from './prop';

const { devText } = helper.readConf()!;
const cwd = process.cwd();
const { useForm } = Form;

/**
 * 拼接检材编号
 * # 格式：（单位编码+时间年月+前3位+中划线+后4位）
 * # 举例：140497202104001-0001
 */
const getBcpNo = (no1: string, no2: string, no3: string): string | undefined => {
    if (helper.isNullOrUndefinedOrEmptyString(no2) || helper.isNullOrUndefinedOrEmptyString(no3)) {
        return helper.EMPTY_STRING;
    } else {
        return `${no1}${no2}-${no3}`;
    }
};

/**
 * 生成BCP
 */
const Bcp: FC<BcpProp> = () => {

    const dispatch = useDispatch();
    const { cid, did } = useParams<{ cid: string, did: string }>(); //案件id, 设备id
    const { search } = useLocation<{ cp: string, dp: string }>();
    const { bcpHistory } = useSelector<StateTree, BcpHistoryState>(state => state.bcpHistory);
    const [formRef] = useForm<FormValue>();
    const unit = useUnit();
    const dstUnit = useDstUnit();
    const currentCase = useCase(cid);
    const currentDev = useDevice(did);
    const unitNameRef = useRef<string>('');
    const dstUnitNameRef = useRef<string>('');

    useEffect(() => {
        if (did) {
            dispatch({ type: 'bcpHistory/queryBcpHistory', payload: did });
        }
    }, [did]);

    useEffect(() => {
        unitNameRef.current = unit[1] ?? '';
        dstUnitNameRef.current = dstUnit[1] ?? '';
    }, [unit, dstUnit]);

    /**
     * 返回handle
     */
    const onGoBackClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const params = new URLSearchParams(search);
        const casePage = params.get('cp'); //案件页码
        const devPage = params.get('dp'); //设备页码
        dispatch(routerRedux.push(
            `/parse?cid=${cid}&did=${did}&cp=${casePage}&dp=${devPage}`
        ));
    };

    /**
     * 生成handle
     */
    const onCreateClick = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const db = getDb<Officer>(TableName.Officer);
        const { validateFields } = formRef;
        try {
            const values = await validateFields();
            const officer = await db.findOne({ no: values.officerNo });
            const bcp = new BcpEntity();
            bcp.mobilePath = currentDev?.phonePath! ?? '';
            bcp.remark = currentDev?.note ?? '';
            bcp.attachment = values.attachment;
            bcp.checkUnitName = currentCase?.m_strCheckUnitName ?? '';
            bcp.unitNo = values.unitCode;
            bcp.unitName = unitNameRef.current;
            bcp.dstUnitNo = values.dstUnitCode ?? '';
            bcp.dstUnitName = dstUnitNameRef.current;
            bcp.officerNo = values.officerNo ?? '';
            bcp.officerName = officer.name;
            bcp.mobileHolder = values.mobileHolder;
            bcp.bcpNo = getBcpNo(values.bcpNo1, values.bcpNo2, values.bcpNo3);
            bcp.phoneNumber = values.phoneNumber ?? '';
            bcp.credentialType = values.credentialType ?? '';
            bcp.credentialNo = values.credentialNo ?? '';
            bcp.credentialEffectiveDate = values.credentialEffectiveDate
                ? values.credentialEffectiveDate.format('YYYY-MM-DD')
                : '';
            bcp.credentialExpireDate = values.credentialExpireDate
                ? values.credentialExpireDate.format('YYYY-MM-DD')
                : '';
            bcp.credentialOrg = values.credentialOrg ?? '';
            bcp.credentialAvatar = values.credentialAvatar ?? '';
            bcp.gender = values.gender ?? '0';
            bcp.nation = values.nation ?? '00';
            bcp.birthday = values.birthday ? values.birthday.format('YYYY-MM-DD') : '';
            bcp.address = values.address ?? '';
            bcp.securityCaseNo = values.securityCaseNo ?? '';
            bcp.securityCaseType = values.securityCaseType ?? '';
            bcp.securityCaseName = values.securityCaseName ?? '';
            bcp.handleCaseNo = values.handleCaseNo ?? '';
            bcp.handleCaseType = values.handleCaseType ?? '';
            bcp.handleCaseName = values.handleCaseName ?? '';
            bcp.handleOfficerNo = values.handleOfficerNo ?? '';

            dispatch({
                type: 'bcpHistory/saveOrUpdateBcpHistory',
                payload: {
                    ...bcp,
                    deviceId: currentDev?._id
                }
            });
            message.loading('正在生成BCP...', 0);
            await helper.writeBcpJson(currentDev?.phonePath!, bcp);
            const bcpExe = join(cwd, '../tools/BcpTools/BcpGen.exe');
            const attachment = typeof bcp.attachment === 'boolean' ? Number(bcp.attachment) : bcp.attachment;
            const process = execFile(
                bcpExe,
                [currentDev?.phonePath!, attachment.toString()],
                {
                    windowsHide: true,
                    cwd: join(cwd, '../tools/BcpTools')
                }
            );
            //#当BCP进程退出了，表示生成任务结束
            process.once('close', () => {
                message.destroy();
                message.info('生成完成');
            });
            process.once('error', (error) => {
                message.destroy();
                message.error('生成BCP失败');
                logger.error(`生成BCP失败：${error}`);
            });
        } catch (error) {
            console.warn(error);
        }
    };

    /**
     * 表单采集单位Change
     */
    const onUnitChange = (_: string, name: string) =>
        unitNameRef.current = name;

    /**
     * 表单目的检验单位Change
     */
    const onDstUnitChange = (_: string, name: string) =>
        dstUnitNameRef.current = name;


    return <SubLayout title="生成BCP">
        <BcpBox>
            <ButtonBar>
                <Button onClick={onGoBackClick} type="primary">
                    <RollbackOutlined />
                    <span>返回</span>
                </Button>
                <Button onClick={onCreateClick} type="primary">
                    <InteractionOutlined />
                    <span>生成</span>
                </Button>
            </ButtonBar>
            <Split />
            <div className="scroll-panel">
                <div className="inner-box">
                    <SortPanel>
                        <div className="caption">
                            {`${devText ?? '设备'}信息`}
                        </div>
                        <div className="content">
                            <DeviceInfo caseId={cid} deviceId={did} />
                        </div>
                    </SortPanel>
                </div>
                <FormPanel>
                    <GenerateForm
                        formRef={formRef}
                        history={bcpHistory}
                        caseData={currentCase}
                        deviceData={currentDev}
                        unit={unit}
                        dstUnit={dstUnit}
                        unitChangeHandle={onUnitChange}
                        dstUnitChangeHandle={onDstUnitChange} />
                </FormPanel>
            </div>
        </BcpBox>
    </SubLayout>;
}

export default Bcp;