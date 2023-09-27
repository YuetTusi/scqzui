import { Model } from 'dva';
import reducers from './reducers';
import effects from './effects';

interface Apk {
    /**
     * USB号
     */
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
            // {
            //     "id": "2",
            //     "name": "com.tencent.mm",
            //     "value": ""
            // },
            // {
            //     "id": "2",
            //     "name": "com.huawei.hisuite",
            //     "value": ""
            // },
            // {
            //     "id": "2",
            //     "name": "com.woyue.batchat",
            //     "value": "test"
            // }
        ],
        phone: [
            // { "name": "usb: 1, EVA-AL10", "value": 1, "id": '2' }
        ]
    },
    reducers,
    effects
};

export { Apk, Phone, ApkModalState };
export default model;