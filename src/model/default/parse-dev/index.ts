import { Model } from 'dva';
import DeviceType from '@/schema/device-type';
import { helper } from '@/utils/helper';
import reducers from './reducers';
import effects from './effects';

interface ParseDevState {
    /**
     * 案件id
     */
    caseId?: string,
    /**
     * 案件数据
     */
    data: DeviceType[],
    /**
     * 状态
     */
    loading: boolean,
    /**
     * 当前页
     */
    pageIndex: number,
    /**
     * 页尺寸
     */
    pageSize: number,
    /**
     * 总数
     */
    total: number,
    /**
     * 展开行key
     */
    expandedRowKeys: Array<string | number>
}

/**
 * 解析设备
 */
let model: Model = {
    namespace: 'parseDev',
    state: {
        caseId: undefined,
        data: [],
        loading: false,
        total: 0,
        pageIndex: 1,
        pageSize: helper.PAGE_SIZE,
        expandedRowKeys: []
    },
    reducers,
    effects
};

export { ParseDevState };
export default model;