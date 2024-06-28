import { groupBy } from 'lodash';
import { EffectsCommandMap } from 'dva';
import { AnyAction } from 'redux';
import { TreeNodeProps } from 'antd';
import DeviceType from '@/schema/device-type';
import { TableName } from '@/schema/table-name';
import CaseInfo from '@/schema/case-info';
import { getDb } from '@/utils/db';
import logger from '@/utils/log';
import { helper } from '@/utils/helper';

export default {

    *queryCaseTree({ }: AnyAction, { all, put, call }: EffectsCommandMap) {

        const caseDb = getDb<CaseInfo>(TableName.Cases);
        const deviceDb = getDb<DeviceType>(TableName.Devices);
        yield put({ type: 'setLoading', payload: true });

        try {
            const [caseData, deviceData]: [CaseInfo[], DeviceType[]] = yield all([
                call([caseDb, 'find'], null, 'createdAt', -1),
                call([deviceDb, 'find'], null, 'createdAt', -1)
            ]);

            const nodes = caseData.reduce<TreeNodeProps[]>((acc, current) => {

                //按持有人分组
                const holder = groupBy(deviceData.filter(i => i.caseId === current._id), 'mobileHolder');

                acc.push({
                    key: current._id,
                    title: helper.getNameWithoutTime(current.m_strCaseName),
                    disabled: false,
                    isLeaf: false,
                    checkable: false,
                    selectable: false,
                    children: Object.keys(holder).map((i, index) => ({
                        key: `holder_${helper.newId()}`,
                        title: i,
                        disabled: false,
                        isLeaf: holder[i].length === 0,
                        checkable: true,
                        selectable: false,
                        children: holder[i].map(j => ({
                            key: j._id,
                            title: helper.getNameWithoutTime(j.mobileName),
                            disabled: false,
                            isLeaf: true,
                            checkable: true,
                            selectable: false,
                            _id: j._id,
                            mobileHolder: j.mobileHolder,
                            mobileName: j.mobileName,
                            mobileNumber: j.mobileNumber,
                            model: j.model,
                            serial: j.serial
                        }))
                    }))
                });
                return acc;
            }, []);

            yield put({
                type: 'setExpandedKeys',
                payload: ['case_tree_root', ...caseData.map(i => i._id)]
            });

            yield put({
                type: 'setCaseTree', payload: [{
                    key: 'case_tree_root',
                    title: '案件',
                    disabled: false,
                    isLeaf: false,
                    checkable: false,
                    children: nodes
                }]
            });

        } catch (error) {
            logger.error(`查询案件树失败 @modal/default/paperwork-modal/*queryCaseTree: ${error.message}`);
        } finally {
            yield put({ type: 'setLoading', payload: false });
        }
    }
};