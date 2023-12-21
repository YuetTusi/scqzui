import { join } from 'path';
import debounce from 'lodash/debounce';
import differenceWith from 'lodash/differenceWith';
import { ipcRenderer, OpenDialogReturnValue } from 'electron';
import { Db, getDb } from '@/utils/db';
import React, { FC, MouseEvent } from 'react';
import ImportOutlined from '@ant-design/icons/ImportOutlined';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import Form from 'antd/lib/form';
import Modal from 'antd/lib/modal';
import { CaseInfo } from '@/schema/case-info';
import { DeviceType } from '@/schema/device-type';
import { QuickEvent } from '@/schema/quick-event';
import { QuickRecord } from '@/schema/quick-record';
import { TableName } from '@/schema/table-name';
import { TipBox } from './styled/style';
import { NedbImportModalProp } from './prop';

const cwd = process.cwd();
const { Item, useForm } = Form;

/**
 * 导入旧版本表数据
 * @param {string} dir 旧UI表目录(传到qzui/nedb)
 */
const importPrevNedb = async (dir: string) => {
    const originCaseDb = new Db<CaseInfo>('Case', join(dir, '../'));
    const originDeviceDb = new Db<DeviceType>('Device', join(dir, '../'));

    const caseDb = getDb<CaseInfo>(TableName.Cases);
    const eventDb = getDb<QuickEvent>(TableName.QuickEvent);
    const deviceDb = getDb<DeviceType>(TableName.Devices);
    const recordDb = getDb<QuickRecord>(TableName.QuickRecord);

    try {
        const [
            prevCase, //旧案件
            prevDevice, //旧设备
            nextCase,//新标准案件
            nextEvent,//新快速点验案件
            nextDevice,//新案件设备
            nextRecord//新快速点验设备
        ] = await Promise.all([
            originCaseDb.all(),
            originDeviceDb.all(),
            caseDb.all(),
            eventDb.all(),
            deviceDb.all(),
            recordDb.all()
        ]);

        //将原数据表按caseType拆分为现在4张表
        const next = prevCase.reduce<{
            normalCase: CaseInfo[],
            quickEvent: QuickEvent[],
            device: DeviceType[],
            quickRecord: QuickRecord[]
        }>((acc, current) => {
            if ((current as any).caseType === 1) {
                //快速点验
                acc.quickEvent.push({
                    _id: current._id,
                    eventName: current.m_strCaseName,
                    eventPath: current.m_strCasePath,
                    ruleFrom: (current as any)?.ruleFrom,
                    ruleTo: (current as any)?.ruleTo,
                    isAi: current.isAi
                });
                acc.quickRecord = acc.quickRecord.concat(
                    prevDevice
                        .filter(item => item.caseId === current._id)
                        .map(item => ({ ...item, id: undefined }))
                );
            } else {
                //标准案件
                acc.normalCase.push(current);
                acc.device = acc.device.concat(
                    prevDevice
                        .filter(item => item.caseId === current._id)
                        .map(item => ({ ...item, id: undefined }))
                );
            }
            return acc;
        }, { normalCase: [], quickEvent: [], device: [], quickRecord: [] });

        const [caseCount, eventCount, deviceCount, recordCount] = await Promise.all([
            caseDb.insert(differenceWith(next.normalCase, nextCase, (prev, next) => prev._id === next._id)),
            eventDb.insert(differenceWith(next.quickEvent, nextEvent, (prev, next) => prev._id === next._id)),
            deviceDb.insert(differenceWith(next.device, nextDevice, (prev, next) => prev._id === next._id)),
            recordDb.insert(differenceWith(next.quickRecord, nextRecord, (prev, next) => prev._id === next._id)),
        ]);

        return [
            (caseCount as CaseInfo[]).length,
            (eventCount as QuickEvent[]).length,
            (deviceCount as DeviceType[]).length,
            (recordCount as QuickRecord[]).length
        ];
    } catch (error) {
        throw error;
    }
};

/**
 * 导入旧版本UI数据（兼容性功能）
 * # 由于新版UI已将案件拆分成`案件表`与`点验案件表`
 * # 此功能将原有旧表数据自动导入到cases和quick-event中
 */
const NedbImportModal: FC<NedbImportModalProp> = ({
    visible, importHandle, cancelHandle
}) => {

    const [formRef] = useForm<{ nedbDir: string }>();

    /**
     * 选择目录
     */
    const selectDirHandle = debounce(() => {
        const { setFieldsValue } = formRef;
        ipcRenderer
            .invoke('open-dialog', {
                title: '请选择数据库目录',
                properties: ['openDirectory'],
                defaultPath: cwd
            })
            .then(({ filePaths }: OpenDialogReturnValue) => {
                if (filePaths && filePaths.length > 0) {
                    setFieldsValue({ nedbDir: filePaths[0] });
                }
            }).catch(() => {
                setFieldsValue({ nedbDir: '' });
            });
    },
        600,
        { leading: true, trailing: false }
    );

    /**
     * 导入Click
     */
    const onImportClick = async (e: MouseEvent<HTMLButtonElement>) => {
        const { validateFields } = formRef;
        e.preventDefault();
        try {
            const { nedbDir } = await validateFields();
            importHandle(nedbDir);
        } catch (error) {
            console.warn(error);
        }
    }

    return <Modal
        footer={[
            <Button
                onClick={cancelHandle}
                type="default"
                key="DBIM_0">
                <CloseCircleOutlined />
                <span>取消</span>
            </Button>,
            <Button
                onClick={onImportClick}
                type="primary"
                key="DBIM_1">
                <ImportOutlined />
                <span>导入</span>
            </Button>
        ]}
        onCancel={cancelHandle}
        visible={visible}
        title="旧版本数据导入"
        destroyOnClose={true}
        maskClosable={false}
        centered={true}
        forceRender={true}>
        <TipBox>
            <legend>数据导入提示</legend>
            <ul>
                <li>此功能用于导入旧版本案件数据，请选择旧版安装位置下的<strong>qzui/nedb</strong>目录</li>
                <li>成功后<strong>不可重复导入相同数据</strong></li>
            </ul>
        </TipBox>
        <Form form={formRef}>
            <Item
                rules={[
                    { required: true, message: '请选择数据表目录' },
                ]}
                initialValue={join(cwd, './nedb')}
                name="nedbDir"
                label="数据表目录"
                tooltip="请选择旧版软件安装位置下的qzui/nedb目录">
                <Input
                    onClick={() => selectDirHandle()}
                    readOnly={true}
                    placeholder="请选择数据库目录" />
            </Item>
        </Form>
    </Modal>
};

NedbImportModal.defaultProps = {
    visible: false,
    cancelHandle: () => { },
    importHandle: () => { }
}

export { importPrevNedb };
export default NedbImportModal;