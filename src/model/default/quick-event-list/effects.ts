import { join } from 'path';
import { ipcRenderer, shell } from 'electron';
import { AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';
import { message, notification } from 'antd';
import Modal from 'antd/lib/modal';
import log from '@/utils/log';
import { getDb } from '@/utils/db';
import { helper } from '@/utils/helper';
import { TableName } from '@/schema/table-name';
import { QuickEvent } from '@/schema/quick-event';
import { QuickRecord } from '@/schema/quick-record';
import { AlartMessageInfo } from '@/component/alert-message/prop';

const { fetchText } = helper.readConf()!;

export default {

    /**
     * 点验案件查询
     */
    *query({ payload }: AnyAction, { all, call, put }: EffectsCommandMap) {

        const db = getDb<QuickEvent>(TableName.QuickEvent);
        const { pageIndex, pageSize = helper.PAGE_SIZE } = payload;

        yield put({ type: 'setLoading', payload: true });
        try {
            const [data, total]: [QuickEvent[], number] = yield all([
                call([db, 'findByPage'], {}, pageIndex, pageSize, 'createdAt', -1),
                call([db, 'count'], {})
            ]);
            yield put({ type: 'setData', payload: data });
            yield put({
                type: 'setPage', payload: {
                    pageIndex,
                    pageSize,
                    total
                }
            });
        } catch (error) {
            console.warn(error);
            log.error(`查询快速点验记录失败 @model/default/quick-event-list/*query:${error.message}`);
        } finally {
            yield put({ type: 'setLoading', payload: false });
        }
    },
    /**
     * 删除快速点验案件
     */
    *del({ payload }: AnyAction, { all, call, put }: EffectsCommandMap) {

        const eventDb = getDb<QuickEvent>(TableName.QuickEvent);
        const recDb = getDb<QuickRecord>(TableName.QuickRecord);

        yield put({ type: 'setLoading', payload: true });
        const modal = Modal.info({
            content: '正在删除，可能时间较长，请不要关闭程序',
            okText: '确定',
            maskClosable: false,
            centered: true,
            okButtonProps: {
                disabled: true
            }
        });
        try {
            const next: QuickEvent | null = yield eventDb.findOne({ _id: payload });
            if (next === null) {
                modal.update({
                    title: '删除失败',
                    content: `${fetchText ?? '点验'}数据有误，请重试`,
                    okButtonProps: {
                        disabled: false
                    }
                });
            } else {
                const { _id, eventName, eventPath } = next;
                let success: boolean = yield helper.delDiskFile(join(eventPath, eventName));
                if (success) {
                    yield all([
                        call([recDb, 'remove'], { caseId: _id }, true),
                        call([eventDb, 'remove'], { _id: payload })
                    ]);
                }
                modal.update({
                    title: '删除成功',
                    content: undefined,
                    okButtonProps: {
                        disabled: false
                    }
                });
                setTimeout(() => {
                    modal.destroy();
                }, 800);
                yield put({
                    type: 'query',
                    payload: { pageIndex: 1, pageSize: helper.PAGE_SIZE }
                });
                yield put({ type: 'quickRecordList/setEventId', payload: payload });
                yield put({ type: 'quickRecordList/query', payload: { pageIndex: 1, pageSize: 5 } });
            }

        } catch (error) {
            log.error(`删除快速点验记录失败 @model/default/quick-event-list/*del:${error.message}`);
            modal.update({
                title: '删除失败',
                content: '数据仍被占用，请稍后重试',
                okButtonProps: {
                    disabled: false
                }
            });
        } finally {
            yield put({ type: 'setLoading', payload: false });
        }
    },
    /**
     * 生成报告
     */
    *createReport({ payload }: AnyAction, { call, put }: EffectsCommandMap) {
        const { _id, eventPath, eventName } = payload as QuickEvent;
        const db = getDb<QuickRecord>(TableName.QuickRecord);
        const exe = join(helper.APP_CWD, '../tools/CreateReport/create_report.exe');
        message.destroy();
        ipcRenderer.send('show-progress', true);
        const msg = new AlartMessageInfo({
            id: helper.newId(),
            msg: `正在生成「${eventName}」报告`
        });
        try {
            const records: QuickRecord[] = yield call([db, 'find'], { caseId: _id });
            if (records.length === 0) {
                message.warn('无设备数据');
            } else {
                // console.clear();
                // console.log(m_strCasePath);
                // console.log(devices.map(i => i.phonePath).join('|'));

                yield put({
                    type: 'alartMessage/addAlertMessage',
                    payload: msg
                }); //显示全局消息
                const code: number | null = yield call(
                    [helper, 'runTask'],
                    exe,
                    [eventPath, records.map(i => i.phonePath).join('|')]
                );
                if (code === 0) {
                    notification.success({
                        type: 'success',
                        message: '报告生成成功',
                        description: `「${eventName}」报告生成成功`,
                        duration: 0
                    });
                    shell.openPath(join(eventPath, 'report'));
                } else {
                    notification.error({
                        type: 'error',
                        message: '报告生成失败',
                        description: `「${eventName}」报告生成失败`,
                        duration: 0
                    });
                }
            }

        } catch (error) {
            log.error(`查询案件下设备失败 @model/default/quick-event-list/*createReport:${error.message}`);
        } finally {
            ipcRenderer.send('show-progress', false);
            yield put({
                type: 'alartMessage/removeAlertMessage',
                payload: msg.id
            });
        }
    }
};
