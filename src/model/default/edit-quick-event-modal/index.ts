import { Model } from 'dva';
import reducers from './reducers';
import effects from './effects';
import { QuickEvent } from '@/schema/quick-event';

interface EditQuickEventModalState {
    /**
     * 显示
     */
    visible: boolean,
    /**
     * 数据
     */
    data?: QuickEvent
};

let model: Model = {

    namespace: 'editQuickEventModal',
    state: {
        data: undefined,
        visible: false
    },
    reducers,
    effects
};

export { EditQuickEventModalState };
export default model;