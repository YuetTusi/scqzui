import { EffectsCommandMap } from "dva";
import { AnyAction } from 'redux';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import Modal from 'antd/lib/modal';
import log from '@/utils/log';
import { Db } from '@/utils/db';
import { helper } from '@/utils/helper';
import { CaseInfo } from "@/schema/case-info";
import { TableName } from "@/schema/table-name";
import { DeviceType } from "@/schema/device-type";
import BcpEntity from '@/schema/bcp-entity';

export default {
    /**
     * 查询案件列表
     */
    *fetchCaseData({ payload }: AnyAction, { all, call, put }: EffectsCommandMap) {
        const { current, pageSize = helper.PAGE_SIZE } = payload;
        const db = new Db<CaseInfo>(TableName.Case);
        yield put({ type: 'setLoading', payload: true });
        try {
            const [result, total]: [CaseInfo[], number] = yield all([
                call([db, 'findByPage'], null, current, pageSize, 'createdAt', -1),
                call([db, 'count'], null)
            ]);
            yield put({ type: 'setCaseData', payload: result });
            yield put({ type: 'setPage', payload: { current, pageSize, total } });
        } catch (error) {
            log.error(`@model/default/case-data/*fetchCaseData:${error.message}`);
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
            console.log(`@model/default/case-data/*queryAllCaseData: ${error.message}`);
        }
    },
    /**
     * 删除案件记录(payload为NeDB_id)
     * @param {string} payload.id 案件id
     * @param {string} payload.casePath 案件路径
     */
    *deleteCaseData({ payload }: AnyAction, { all, call, put }: EffectsCommandMap) {
        const caseDb = new Db<CaseInfo>(TableName.Case);
        const deviceDb = new Db<DeviceType>(TableName.Device);
        const checkDb = new Db<BcpEntity>(TableName.CheckData);
        const bcpDb = new Db<BcpEntity>(TableName.CreateBcpHistory);
        const modal = Modal.info({
            content: '正在删除，可能时间较长，请不要关闭程序',
            okText: '确定',
            maskClosable: false,
            okButtonProps: { disabled: true, icon: LoadingOutlined }
        });
        try {
            yield put({ type: 'setLoading', payload: true });
            let success: boolean = yield helper.delDiskFile(payload.casePath);
            if (success) {
                //# 磁盘文件成功删除后，删掉数据库相关记录
                let devicesInCase: DeviceType[] = yield call([deviceDb, 'find'], { caseId: payload.id });
                yield all([
                    call([deviceDb, 'remove'], { caseId: payload.id }, true),
                    call([caseDb, 'remove'], { _id: payload.id })
                ]);
                //删除掉点验记录 和 BCP历史记录
                yield all([
                    call([checkDb, 'remove'], { caseId: payload.id }, true),
                    call([bcpDb, 'remove'], { deviceId: { $in: devicesInCase.map(i => i._id) } }, true)
                ]);
                modal.update({ content: '删除成功', okButtonProps: { disabled: false } });
            } else {
                modal.update({ title: '删除失败', content: '可能文件仍被占用，请稍后再试', okButtonProps: { disabled: false } });
            }
            setTimeout(() => {
                modal.destroy();
            }, 1000);
        } catch (error) {
            console.log(`@model/default/case-data/*deleteCaseData: ${error.message}`);
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