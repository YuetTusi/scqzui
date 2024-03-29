import { join } from 'path';
import { mkdirSync } from 'fs';
import { AnyAction } from 'redux';
import { EffectsCommandMap, routerRedux } from 'dva';
import Modal from 'antd/lib/modal';
import message from 'antd/lib/message';
import { StateTree } from '@/type/model';
import { TableName } from '@/schema/table-name';
import DeviceType from '@/schema/device-type';
import { DataMode } from '@/schema/data-mode';
import { ParseState } from '@/schema/device-state';
import BcpEntity from '@/schema/bcp-entity';
import { getDb } from '@/utils/db';
import logger from '@/utils/log';
import { helper } from '@/utils/helper';
import { ParseDevState } from '.';

export default {

    /**
     * 查询案件下设备
     * @param {number} pageIndex 当前页
     * @param {number} pageSize 页尺寸
     * @param {any} condition 条件
     */
    *queryDev({ payload }: AnyAction, { all, call, put, select }: EffectsCommandMap) {

        const { pageIndex, pageSize, condition } = payload;
        const db = getDb<DeviceType>(TableName.Devices);
        const { caseId } = yield select((state: StateTree) => state.parseDev);

        yield put({ type: 'setLoading', payload: true });
        try {
            if (caseId === undefined) {
                yield put({ type: 'setData', payload: [] });
                yield put({
                    type: 'setPage', payload: {
                        pageIndex: 1,
                        pageSize: 5,
                        total: 0
                    }
                });
            } else {
                const [data, total]: [DeviceType[], number] = yield all([
                    call([db, 'findByPage'], { ...condition, caseId }, pageIndex, pageSize, 'createdAt', -1),
                    call([db, 'count'], { ...condition, caseId })
                ]);
                yield put({ type: 'setData', payload: data });
                yield put({
                    type: 'setPage', payload: {
                        pageIndex,
                        pageSize,
                        total
                    }
                });
            }
        } catch (error) {
            logger.error(`查询案件设备失败 @model/default/parse-dev/*queryDev: ${error.message}`);
        } finally {
            yield put({ type: 'setLoading', payload: false });
        }
    },
    /**
     * 更新数据库解析状态
     * @param {string} payload.id 设备id
     * @param {ParseState} payload.parseState 解析状态
     * @param {number} payload.pageIndex 当前页
     */
    *updateParseState({ payload }: AnyAction, { call, put, select }: EffectsCommandMap) {
        const db = getDb<DeviceType>(TableName.Devices);
        const currentState: ParseDevState = yield select((state: StateTree) => state.parseDev);
        const { id, parseState, pageIndex } = payload as { id: string, parseState: ParseState, pageIndex: number };
        try {
            yield call([db, 'update'], { _id: id }, { $set: { parseState } });
            yield put({
                type: 'queryDev', payload: {
                    pageIndex: pageIndex === undefined ? currentState.pageIndex : 1,
                    pageSize: 5,
                    condition: null
                }
            });
            logger.info(`解析状态更新, deviceId:${id}, 状态:${parseState}`);
            console.log(`解析状态更新，id:${id}，状态:${parseState}`);
        } catch (error) {
            logger.error(`更新解析状态入库失败 @model/default/parse-dev/*updateParseState: ${error.message}`);
        }
    },
    /**
    * 更新设备数据
    * @param {DeviceType} payload 
    */
    *updateDev({ payload }: AnyAction, { call, fork, put, select }: EffectsCommandMap) {
        const db = getDb<DeviceType>(TableName.Devices);
        const { pageIndex, pageSize } = yield select((state: StateTree) => state.parseDev);
        try {
            yield call([db, 'update'], { _id: payload._id }, {
                $set: {
                    mobileHolder: payload.mobileHolder,
                    mobileNo: payload.mobileNo,
                    note: payload.note
                }
            });
            const exist: boolean = yield helper.existFile(payload.phonePath);
            if (!exist) {
                //手机路径不存在，创建之
                mkdirSync(payload.phonePath);
            }
            //将设备信息写入Device.json
            yield fork([helper, 'writeJSONfile'], join(payload.phonePath, 'Device.json'), {
                mobileHolder: payload.mobileHolder ?? '',
                mobileNo: payload.mobileNo ?? '',
                mobileName: payload.mobileName ?? '',
                note: payload.note ?? '',
                mode: payload.mode ?? DataMode.Self
            });
            yield put({
                type: 'queryDev', payload: {
                    pageIndex, pageSize, condition: null
                }
            });
            message.success('保存成功');
        } catch (error) {
            message.error('保存失败');
            logger.error(`编辑设备数据失败 @model/default/parse-dev/updateDev: ${error.message}`);
        }
    },
    /**
     * 删除设备
     * @param {DeviceType} payload
     */
    *delDev({ payload }: AnyAction, { all, call, put }: EffectsCommandMap) {
        const { _id, phonePath } = payload as DeviceType;
        const deviceDb = getDb<DeviceType>(TableName.Devices);
        const bcpHistoryDb = getDb<BcpEntity>(TableName.CreateBcpHistory);
        const handle = Modal.info({
            title: '正在删除',
            content: '正在删除数据，请不要关闭应用',
            okText: '确定',
            centered: true,
            okButtonProps: {
                disabled: true
            }
        });
        try {
            let success: boolean = yield helper.delDiskFile(phonePath!);
            if (success) {
                handle.update({
                    content: '删除成功',
                    okButtonProps: { disabled: false }
                });
                //NOTE:磁盘文件删除成功后，删除设备及BCP历史记录
                yield all([
                    call([deviceDb, 'remove'], { _id }),
                    call([bcpHistoryDb, 'remove'], { deviceId: _id }, true)
                ]);
                yield put({
                    type: 'queryDev', payload: {
                        pageIndex: 1,
                        pageSize: 5,
                        condition: null
                    }
                });
                yield put({ type: 'setExpandedRowKeys', payload: [] });
            } else {
                handle.update({
                    title: '删除失败',
                    content: '可能文件仍被占用，请稍后再试',
                    okButtonProps: { disabled: false }
                });
            }
            setTimeout(() => {
                handle.destroy();
            }, 1000);
        } catch (error) {
            logger.error(`删除设备失败 @model/default/parse-dev/*delDev: ${error.message}`);
            handle.update({
                title: '删除失败',
                content: '可能文件仍被占用，请稍后再试',
                okButtonProps: { disabled: false }
            });
            setTimeout(() => {
                handle.destroy();
            }, 1000);
        }
    },
    /**
     * 跳转到BCP页
     * @param {string} caseId 案件id
     * @param {string} deviceId 设备id
     */
    *gotoBcp({ payload }: AnyAction, { select, put }: EffectsCommandMap) {

        const { caseId, deviceId } = payload;
        const { parseCase, parseDev } = yield select((state: StateTree) => ({
            parseCase: state.parseCase,
            parseDev: state.parseDev
        }));

        yield put(
            routerRedux.push(
                `/bcp/${caseId}/${deviceId}?cp=${parseCase.pageIndex}&dp=${parseDev.pageIndex}`));
    },
    /**
     * 跳转到云点验页
     * @param {string} caseId 案件id
     * @param {string} deviceId 设备id
     */
    *gotoTrail({ payload }: AnyAction, { select, put }: EffectsCommandMap) {

        const { caseId, deviceId } = payload;
        const { parseCase, parseDev } = yield select((state: StateTree) => ({
            parseCase: state.parseCase,
            parseDev: state.parseDev
        }));

        yield put(
            routerRedux.push(
                `/trail/${caseId}/${deviceId}?cp=${parseCase.pageIndex}&dp=${parseDev.pageIndex}`));
    }
};