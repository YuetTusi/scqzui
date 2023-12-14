import { ipcRenderer } from 'electron';
import { join } from 'path';
import { shell } from 'electron';
import { EffectsCommandMap } from 'dva';
import { AnyAction } from 'redux';
import { message, notification } from 'antd';
import log from '@/utils/log';
import { getDb } from '@/utils/db';
import { helper } from '@/utils/helper';
import { CaseInfo } from '@/schema/case-info';
import { TableName } from '@/schema/table-name';
import { DeviceType } from '@/schema/device-type';
import { AlartMessageInfo } from '@/component/alert-message/prop';


export default {

    /**
     * 查询案件
     */
    *queryCase({ payload }: AnyAction, { all, call, put }: EffectsCommandMap) {
        const { pageIndex, pageSize, condition } = payload;
        const db = getDb<CaseInfo>(TableName.Cases);

        yield put({ type: 'setLoading', payload: true });
        try {
            const [next, total]: [CaseInfo[], number] = yield all([
                call([db, 'findByPage'], condition, pageIndex, pageSize, 'createdAt', -1),
                call([db, 'count'], condition)
            ]);
            yield put({ type: 'setPage', payload: { pageIndex, pageSize, total } });
            yield put({ type: 'setData', payload: next });
        } catch (error) {
            log.error(`查询案件列表失败 @model/default/parse-case/*queryCase:${error.message}`);
        } finally {
            yield put({ type: 'setLoading', payload: false });
        }
    },
    /**
     * 生成报告
     */
    *createReport({ payload }: AnyAction, { call, put }: EffectsCommandMap) {
        const { _id, m_strCasePath, m_strCaseName } = payload as CaseInfo;
        const db = getDb<DeviceType>(TableName.Devices);
        const exe = join(helper.APP_CWD, '../tools/CreateReport/create_report.exe');
        message.destroy();
        ipcRenderer.send('show-progress', true);
        const msg = new AlartMessageInfo({
            id: helper.newId(),
            msg: `正在生成「${m_strCaseName}」报告`
        });
        try {
            const devices: DeviceType[] = yield call([db, 'find'], { caseId: _id });
            if (devices.length === 0) {
                message.warn('无设备数据');
            } else {

                yield put({
                    type: 'alartMessage/addAlertMessage',
                    payload: msg
                }); //显示全局消息
                const code: number | null = yield call(
                    [helper, 'runTask'],
                    exe,
                    [m_strCasePath, devices.map(i => i.phonePath).join('|')]
                );
                if (code === 0) {
                    notification.success({
                        type: 'success',
                        message: '报告生成成功',
                        description: `「${m_strCaseName}」报告生成成功`,
                        duration: 0
                    });
                    shell.openPath(join(m_strCasePath, 'report'));
                } else {
                    notification.error({
                        type: 'error',
                        message: '报告生成失败',
                        description: `「${m_strCaseName}」报告生成失败`,
                        duration: 0
                    });
                }
            }

        } catch (error) {
            log.error(`查询案件下设备失败 @model/default/parse-case/*createReport:${error.message}`);
        } finally {
            ipcRenderer.send('show-progress', false);
            yield put({
                type: 'alartMessage/removeAlertMessage',
                payload: msg.id
            });
        }
    }
};