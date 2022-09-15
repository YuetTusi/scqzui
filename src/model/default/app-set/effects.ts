import { ipcRenderer } from 'electron';
import { AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';
import Modal from 'antd/lib/modal';
import { LocalStoreKey } from '@/utils/local-store';
import { helper } from '@/utils/helper';
import logger from '@/utils/log';
import { getDb } from '@/utils/db';
import { request } from '@/utils/request';
import { TableName } from '@/schema/table-name';
import { DeviceType } from '@/schema/device-type';
import { ParseState } from '@/schema/device-state';
import { AppCategory } from '@/schema/app-config';
import { QuickRecord } from '@/schema/quick-record';

const config = helper.readConf();

export default {
    /**
     * 退出前检测采集&解析状态
     */
    *fetchingAndParsingState() {

        let question = `确认退出吗？`;
        Modal.destroyAll();
        Modal.confirm({
            title: '退出应用',
            content: question,
            okText: '是',
            cancelText: '否',
            zIndex: 9000,
            centered: true,
            onOk() {
                ipcRenderer.send('do-close', true);
                localStorage.removeItem(LocalStoreKey.CaseData);
            }
        });
    },
    /**
     * 将案件下所有设备为`解析中`和`采集中`更新为新状态
     * @param {ParseState} payload 解析状态
     */
    *updateAllDeviceParseState({ payload }: AnyAction, { all, call, fork }: EffectsCommandMap) {
        const deviceDb = getDb<DeviceType>(TableName.Devices);
        const recDb = getDb<QuickRecord>(TableName.QuickRecord);
        let msgBox: any = null;
        try {
            const [deviceData, recData]: [DeviceType[], QuickRecord[]] = yield all([
                call([deviceDb, 'all']),
                call([recDb, 'all'])
            ]);
            let devUpdateId: string[] = [];
            let recUpdateId: string[] = [];
            for (let i = 0; i < deviceData.length; i++) {
                if (deviceData[i].parseState === ParseState.Fetching || deviceData[i].parseState === ParseState.Parsing) {
                    devUpdateId.push(deviceData[i]._id!);
                }
            }
            for (let i = 0; i < recData.length; i++) {
                if (recData[i].parseState === ParseState.Fetching || recData[i].parseState === ParseState.Parsing) {
                    recUpdateId.push(recData[i]._id!);
                }
            }
            if (devUpdateId.length > 0 || recUpdateId.length > 0) {
                msgBox = Modal.info({
                    content: '正在处理数据，请稍候...',
                    okText: '确定',
                    maskClosable: false,
                    centered: true
                });
                yield fork([deviceDb, 'update'],
                    { _id: { $in: devUpdateId } },
                    { $set: { parseState: payload } }, true);
                yield fork([recDb, 'update'],
                    { _id: { $in: recUpdateId } },
                    { $set: { parseState: payload } }, true);
            }
        } catch (error) {
            logger.error(`启动应用更新解析状态失败 @modal/default/app-set/*updateAllDeviceParseState: ${error.message}`);
        } finally {
            if (msgBox !== null) {
                msgBox.destroy();
            }
        }
    },
    /**
     * 调用HTTP接口
     */
    *fetchCloudAppData({ payload }: AnyAction, { call, put }: EffectsCommandMap) {

        const url = config?.cloudAppUrl ?? helper.FETCH_CLOUD_APP_URL;

        try {
            const { code, data }: { code: number, data: { fetch: AppCategory[] } }
                = yield call(request, url);
            if (code === 0) {
                yield put({ type: 'setCloudAppData', payload: data.fetch });
            }
        } catch (error) {
            logger.error(`查询云取应用接口失败 @modal/default/app-set/*fetchCloudAppData: ${error.message}`);
        }
    }
};