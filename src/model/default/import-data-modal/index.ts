import { Model } from 'dva';
import { ImportTypes } from '@/schema/import-type';
import reducers from './reducers';
import effects from './effects';

interface ImportDataModalState {
    /**
     * 显示
     */
    visible: boolean,
    /**
     * 标题
     */
    title: string,
    /**
     * 导入数据类型
     */
    importType: ImportTypes,
    /**
     * 提示信息
     */
    tips: string[]
};

let model: Model = {
    namespace: 'importDataModal',
    state: {
        visible: false,
        title: '',
        importType: ImportTypes.IOS
    },
    reducers,
    effects
};

export { ImportDataModalState };
export default model;