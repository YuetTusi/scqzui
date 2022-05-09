import { Model } from 'dva';
import { QuickRecord } from '@/schema/quick-record';
import ParseDetail from '@/schema/parse-detail';
import reducers from './reducers';
import effects from './effects';

interface CheckingListState {
    /**
     * 进度消息
     * 数组中每一条对应一个设备
     * 如数组有2条表示有同时两部设备正在解析
     * 用deviceId来做区分
     */
    info: ParseDetail[],
    /**
     * 设备数据与进度数据对应
     */
    records: QuickRecord[]
}


/**
 * 快速点验设备列表
 */
let model: Model = {

    namespace: 'checkingList',
    state: {
        info: [
            // {
            //     caseId: '4vU515iZ6pCrhQTo',
            //     deviceId: 'a9ad2ce72395bec8',
            //     curinfo: '正在解析微信数据',
            //     curprogress: 33
            // }, {
            //     caseId: '4vU515iZ6pCrhQTo',
            //     deviceId: 'aeea2d452a85be4e',
            //     curinfo: '正在分析数据库',
            //     curprogress: 66
            // }
        ],
        records: []
    },
    reducers,
    effects
};

export { CheckingListState };
export default model;