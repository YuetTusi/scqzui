import { Model } from 'dva';
import reducers from './reducers';
import effects from './effects';

interface Apk {
    id: string,
    /**
     * 名称
     */
    name: string,
    /**
     * 值，包名
     */
    value: string
}

/**
 * 手机
 */
interface Phone {
    /**
     * id
     */
    id: string,
    /**
     * 手机名称
     */
    name: string,
    /**
     * 值
     */
    value: string
}

interface ApkModalState {

    phone: Phone[],
    apk: Apk[]
}

/**
 * 工具箱apk提取弹框
 */
let model: Model = {
    namespace: 'apkModal',
    state: {
        apk: [
            // { id: '1001', name: 'test.apk', value: 'test.com' },
            // { id: '1002', name: 'test2.apk', value: 'test2.com' },
            // { id: '1003', name: 'test3.apk', value: 'test3.com' }
        ],
        phone: [
            // { id: '1001', name: 'oneplus', value: 'oneplus' },
            // { id: '1002', name: 'samsung', value: 'samsung' },
            // { id: '1003', name: 'mi', value: 'mi' }
        ]
    },
    reducers,
    effects
};

export { Apk, ApkModalState };
export default model;