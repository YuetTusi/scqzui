import { join } from 'path';
import { AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';
import message from 'antd/lib/message';
import { getDb } from '@/utils/db';
import log from '@/utils/log';
import { TableName } from '@/schema/table-name';
import { Organization } from '@/schema/organization';
import { helper } from '@/utils/helper';

const cwd = process.cwd();
const { useBcp } = helper.readConf()!;

export default {

    /**
     * 查询当前单位设置数据
     */
    *query({ }: AnyAction, { call, put }: EffectsCommandMap) {
        const db = getDb<Organization>(TableName.Organization);
        try {
            const next: Organization[] = yield call([db, 'all']);
            if (next.length === 0) {
                yield put({
                    type: 'setUnit', payload: {
                        collectUnitName: undefined,
                        collectUnitCode: undefined,
                        dstUnitName: undefined,
                        dstUnitCode: undefined
                    }
                });
                yield put({
                    type: 'writeJson', payload: {
                        collectUnitName: undefined,
                        collectUnitCode: undefined,
                        dstUnitName: undefined,
                        dstUnitCode: undefined
                    }
                });
            } else {
                yield put({
                    type: 'setUnit', payload: {
                        collectUnitName: next[0].collectUnitName,
                        collectUnitCode: next[0].collectUnitCode,
                        dstUnitName: next[0].dstUnitName,
                        dstUnitCode: next[0].dstUnitCode
                    }
                });
                yield put({
                    type: 'writeJson', payload: {
                        collectUnitName: next[0].collectUnitName,
                        collectUnitCode: next[0].collectUnitCode,
                        dstUnitName: next[0].dstUnitName,
                        dstUnitCode: next[0].dstUnitCode
                    }
                });
            }
        } catch (error) {
            log.error(`@model/default/organization/*query: ${error.message}`);
        }
    },
    /**
     * 保存自定义单位设置
     * @param {string} payload.unitName 采集单位名称
     * @param {string} payload.unitCode 采集单位编号
     */
    *saveSelfUnit({ payload }: AnyAction, { call, put }: EffectsCommandMap) {
        const db = getDb<Organization>(TableName.Organization);
        const { unitName, unitCode } = payload;
        try {
            const next: Organization[] = yield call([db, 'all']);
            if (next.length === 0) {
                yield call([db, 'insert'], payload);
                yield put({ type: 'writeJson', payload });
            } else {
                yield call([db, 'update'], { _id: next[0]._id }, {
                    ...next[0],
                    collectUnitName: unitName,
                    collectUnitCode: unitCode
                });
                yield put({
                    type: 'writeJson', payload: {
                        ...next[0],
                        collectUnitName: unitName,
                        collectUnitCode: unitCode
                    }
                });
            }
            yield put({
                type: 'setCollectUnit', payload: {
                    collectUnitName: unitName,
                    collectUnitCode: unitCode
                }
            });
            message.destroy();
            message.success('保存成功');
        } catch (error) {
            log.error(`@model/default/organization/*saveCollectUnit: ${error.message}`);
            message.destroy();
            message.error('保存失败');
        }
    },
    /**
     * 保存采集单位设置
     * @param {string} payload.collectUnitName 采集单位名称
     * @param {string} payload.collectUnitCode 采集单位编号
     */
    *saveCollectUnit({ payload }: AnyAction, { call, put }: EffectsCommandMap) {
        const db = getDb<Organization>(TableName.Organization);
        const { collectUnitName, collectUnitCode } = payload;
        try {
            const next: Organization[] = yield call([db, 'all']);
            if (next.length === 0) {
                yield call([db, 'insert'], payload);
                yield put({ type: 'writeJson', payload });
            } else {
                yield call([db, 'update'], { _id: next[0]._id }, {
                    ...next[0],
                    collectUnitName,
                    collectUnitCode
                });
                yield put({
                    type: 'writeJson', payload: {
                        ...next[0],
                        collectUnitName,
                        collectUnitCode
                    }
                });
            }
            yield put({
                type: 'setCollectUnit', payload: {
                    collectUnitName,
                    collectUnitCode
                }
            });
            message.destroy();
            message.success('保存成功');
        } catch (error) {
            log.error(`@model/default/organization/*saveCollectUnit: ${error.message}`);
            message.destroy();
            message.error('保存失败');
        }
    },
    /**
     * 保存目的检验单位设置
     * @param {string} payload.dstUnitName 目的检验单位名称
     * @param {string} payload.dstUnitCode 目的检验单位编号
     */
    *saveDstUnit({ payload }: AnyAction, { call, put }: EffectsCommandMap) {
        const db = getDb<Organization>(TableName.Organization);
        const { dstUnitName, dstUnitCode } = payload;
        try {
            const next: Organization[] = yield call([db, 'all']);
            if (next.length === 0) {
                yield call([db, 'insert'], payload);
                yield put({ type: 'writeJson', payload });
            } else {
                yield call([db, 'update'], { _id: next[0]._id }, {
                    ...next[0],
                    dstUnitName,
                    dstUnitCode
                });
                yield put({
                    type: 'writeJson', payload: {
                        ...next[0],
                        dstUnitName,
                        dstUnitCode
                    }
                });
            }
            yield put({
                type: 'setDstUnit', payload: {
                    dstUnitName,
                    dstUnitCode
                }
            });
            message.destroy();
            message.success('保存成功');
        } catch (error) {
            log.error(`@model/default/organization/*saveCollectUnit: ${error.message}`);
            message.destroy();
            message.error('保存失败');
        }
    },
    /**
     * 将采集单位&目的检验单位写入unit.json
     */
    * writeJson({ payload }: AnyAction, { fork }: EffectsCommandMap) {
        const { collectUnitName, collectUnitCode, dstUnitName, dstUnitCode } = payload;
        let jsonSavePath = ''; //JSON文件路径
        if (process.env['NODE_ENV'] === 'development') {
            jsonSavePath = join(cwd, 'data/unit.json');
        } else {
            jsonSavePath = join(cwd, 'resources/data/unit.json');
        }
        yield fork([helper, 'writeJSONfile'], jsonSavePath, {
            customUnit: useBcp ? 0 : 1, //非BCP版本使用自定义单位1
            unitCode: collectUnitCode ?? '',
            unitName: collectUnitName ?? '',
            dstUnitCode: dstUnitCode ?? '',
            dstUnitName: dstUnitName ?? ''
        });
    },
}