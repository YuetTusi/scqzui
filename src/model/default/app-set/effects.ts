import { ipcRenderer } from 'electron';
import { AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';
import { PingResponse } from 'ping/types/parser/base';
import psList, { ProcessDescriptor } from 'ps-list';
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
import { StateTree } from '@/type/model';
import { ParsingListState } from '../parsing-list';
import { CheckingListState } from '../checking-list';

const config = helper.readConf();

export default {
    /**
     * 退出前检测采集&解析状态
     */
    *fetchingAndParsingState({ }: AnyAction, { select }: EffectsCommandMap) {

        const parsingList: ParsingListState = yield select((state: StateTree) => state.parsingList);
        const checkingList: CheckingListState = yield select((state: StateTree) => state.checkingList);
        const taskCount = parsingList.devices.length + checkingList.records.length;

        let content = '';
        if (taskCount > 0) {
            content = `仍有 ${taskCount} 台${config?.devText ?? '设备'}正在${config?.parseText ?? '解析'}，确认退出吗？`;
        } else {
            content = '确认退出吗？';
        }

        Modal.confirm({
            content,
            title: '退出应用',
            okText: '是',
            cancelText: '否',
            zIndex: 9000,
            centered: true,
            okButtonProps: {},
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
                const { _id, parseState } = deviceData[i];
                if (parseState === ParseState.Fetching || parseState === ParseState.Parsing) {
                    devUpdateId.push(_id!);
                }
            }
            for (let i = 0; i < recData.length; i++) {
                const { _id, parseState } = recData[i];
                if (parseState === ParseState.Fetching || parseState === ParseState.Parsing) {
                    recUpdateId.push(_id!);
                }
            }
            if (devUpdateId.length > 0 || recUpdateId.length > 0) {
                msgBox = Modal.info({
                    content: '正在处理数据，请稍候...',
                    okText: '确定',
                    maskClosable: false,
                    centered: true
                });
                yield all([
                    fork([deviceDb, 'update'],
                        { _id: { $in: devUpdateId } },
                        { $set: { parseState: payload } },
                        true
                    ),
                    fork([recDb, 'update'],
                        { _id: { $in: recUpdateId } },
                        { $set: { parseState: payload } },
                        true
                    )
                ]);
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
    *fetchCloudAppData({ }: AnyAction, { call, put }: EffectsCommandMap) {

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
    },
    /**
     * 检测WiFi采集盒子是否可以连通
     */
    *checkWifiBoxAlive({ }: AnyAction, { all, call, put }: EffectsCommandMap) {

        try {
            const [res, proc]: [PingResponse, ProcessDescriptor[]] = yield all([
                call([helper, 'ping'], '192.168.50.1'),
                call(psList)
            ]);
            const has = proc.some(item => item.name.toLowerCase().includes('opendhcpserver'));
            //DHCP进程运行且IP是通的，说明采集盒子连接正常
            yield put({ type: 'setWifiBoxAlive', payload: has && res.alive });
            yield put({ type: 'wifiBoxModal/setOpen', payload: !(has && res.alive) });
        } catch (error) {
            logger.error(`检测WiFi盒子连通失败 @modal/default/app-set/*checkWifiBoxAlive: ${error.message}`);
        }
    }
};