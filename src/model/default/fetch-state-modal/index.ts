import { Model } from 'dva';
import reducers from './reducers';

/**
 * 设备提取方式
 */
interface FetchStateModalState {
    /**
     * 键为USB序号，值为items，summary为汇总消息
     */
    data: Record<number, {
        summary: DetailItem | undefined,
        items: DetailItem[]
    }>
}

interface DetailItem {
    /**
     * 名称
     */
    name: string,
    /**
     * 值
     */
    value: string
}

let model: Model = {
    namespace: 'fetchStateModal',
    state: {
        data: {}
    },
    reducers
};

export { FetchStateModalState };
export default model;