
import { ipcRenderer } from 'electron';
import { EffectsCommandMap } from "dva";
import { AnyAction } from 'redux';
import Modal from 'antd/lib/modal';
import { helper } from '@/utils/helper';
import { CaseInfo } from "@/schema/case-info";
import { TableName } from "@/schema/table-name";
import { DeviceType } from "@/schema/device-type";
import { Db } from '@/utils/db';

export default {
    /**
     * 查询案件列表
     */
    *fetchCaseData({ payload }: AnyAction, { all, call, put }: EffectsCommandMap) {
        const { current, pageSize = helper.PAGE_SIZE } = payload;
        yield put({ type: 'setLoading', payload: true });
        try {
            const [result, total]: [CaseInfo[], number] = yield all([
                call([ipcRenderer, 'invoke'], 'db-find-by-page', TableName.Case, null, current, pageSize, 'createdAt', -1),
                call([ipcRenderer, 'invoke'], 'db-count', TableName.Case, null)
            ]);
            yield put({ type: 'setCaseData', payload: result });
            yield put({ type: 'setPage', payload: { current, pageSize, total } });
        } catch (error) {
            console.log(`@modal/CaseData.ts/fetchCaseData: ${error.message}`);
        } finally {
            yield put({ type: 'setLoading', payload: false });
        }
    },
    /**
     * 查询全部案件
     */
    *queryAllCaseData({ }: AnyAction, { call, put }: EffectsCommandMap) {
        const db = new Db<CaseInfo>(TableName.Case);
        try {
            const next: CaseInfo[] = yield call([db, 'find'], null, 'createdAt', -1);
            yield put({ type: 'setAllCaseData', payload: next });
        } catch (error) {
            console.log(`@modal/CaseData/effects/queryAllCaseData: ${error.message}`);
        }
    },
    /**
     * 删除案件记录(payload为NeDB_id)
     * @param {string} payload.id 案件id
     * @param {string} payload.casePath 案件路径
     */
    *deleteCaseData({ payload }: AnyAction, { all, call, put }: EffectsCommandMap) {
        const modal = Modal.info({
            content: '正在删除，可能时间较长，请不要关闭程序',
            okText: '确定',
            maskClosable: false,
            okButtonProps: { disabled: true, loading: true }
        });
        try {
            yield put({ type: 'setLoading', payload: true });
            let success: boolean = yield helper.delDiskFile(payload.casePath);
            if (success) {
                //# 磁盘文件成功删除后，删掉数据库相关记录
                let devicesInCase: DeviceType[] = yield call([ipcRenderer, 'invoke'], 'db-find', TableName.Device, { caseId: payload.id });
                yield all([
                    call([ipcRenderer, 'invoke'], 'db-remove', TableName.Device, { caseId: payload.id }, true),
                    call([ipcRenderer, 'invoke'], 'db-remove', TableName.Case, { _id: payload.id })
                ]);
                //删除掉点验记录 和 BCP历史记录
                yield all([
                    call([ipcRenderer, 'invoke'], 'db-remove', TableName.CheckData, { caseId: payload.id }, true),
                    call([ipcRenderer, 'invoke'], 'db-remove', TableName.CreateBcpHistory, { deviceId: { $in: devicesInCase.map(i => i.id) } }, true)
                ]);
                modal.update({ content: '删除成功', okButtonProps: { disabled: false, loading: false } });
            } else {
                modal.update({ title: '删除失败', content: '可能文件仍被占用，请稍后再试', okButtonProps: { disabled: false } });
            }
            setTimeout(() => {
                modal.destroy();
            }, 1000);
        } catch (error) {
            console.log(`@modal/CaseData.ts/deleteCaseData: ${error.message}`);
            modal.update({ title: '删除失败', content: '可能文件仍被占用，请稍后再试', okButtonProps: { disabled: false } });
            setTimeout(() => {
                modal.destroy();
            }, 1000);
        } finally {
            yield put({
                type: 'fetchCaseData', payload: {
                    current: 1,
                    pageSize: helper.PAGE_SIZE
                }
            });
        }
    }
}