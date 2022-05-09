
import { Model } from 'dva';
import { PAGE_SIZE } from '@/utils/helper';
import { QuickRecord } from '@/schema/quick-record';
import reducers from './reducers';
import effects from './effects';

interface QuickRecordListState {

    /**
     * 案件id
     */
    eventId?: string,
    /**
     * 数据
     */
    data: QuickRecord[],
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
     * 读取中
     */
    loading: boolean,
    /**
     * 展开行key
     */
    expandedRowKeys: Array<string | number>
};

let model: Model = {
    namespace: 'quickRecordList',
    state: {
        eventId: undefined,
        data: [],
        pageIndex: 1,
        pageSize: PAGE_SIZE,
        total: 0,
        loading: false,
        expandedRowKeys: []
    },
    reducers,
    effects
};

export { QuickRecordListState }
export default model;