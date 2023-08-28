import { Model } from 'dva';
import reducers from './reducers';
import effects from './effects';
import FetchData from '@/schema/fetch-data';
import { TimeRange } from '@/schema/cloud-app';
import dayjs from 'dayjs';

interface CloudState {

    data: FetchData | null;
}

let model: Model = {
    namespace: 'cloud',
    state: {
        data: {
            cloudAppList: [
                {
                    m_strID: '1030063', name: 'Telegram', key: 'telegram', ext: [], option: {
                        timeRange: TimeRange.OneMonthAgo,
                        startTime: dayjs().add(-1, 'M').toDate(),
                        endTime: dayjs().toDate(),
                        item1: true,
                        item2: false,
                        item3: false,
                        item4: false,
                        item5: false,
                        item6: false,
                        item7: false,
                        item8: false,
                        item9: false,
                        item10: false,
                        item11: false,
                        item12: false
                    }
                },
                {
                    m_strID: '1030206', name: '探探', key: 'tantan', ext: [], option: {
                        timeRange: TimeRange.SixMonthsAgo,
                        startTime: dayjs().add(-6, 'M').toDate(),
                        endTime: dayjs().toDate(),
                        item1: true,
                        item2: false,
                        item3: false,
                        item4: true,
                        item5: false,
                        item6: false,
                        item7: false,
                        item8: true,
                        item9: false,
                        item10: false,
                        item11: true,
                        item12: false
                    }
                }
            ],
            caseId: "5U6QB3xWzckJKqga",
            caseName: "导出测试_20230721094324",
            casePath: "D:\\TZTest",
            cloudTimeout: 3600,
            cloudTimespan: 4,
            credential: "",
            hasReport: true,
            isAlive: false,
            isAuto: true,
            mobileHolder: "王志安",
            mobileNo: "",
            mobileNumber: "13999999999",
            mode: 3,
            note: "",
            sdCard: true,
            spareName: "",
            unitName: "万盛华通"
        }
    },
    reducers,
    effects
};

export { CloudState };
export default model;