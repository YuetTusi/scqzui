import { Model } from 'dva';
import { DeviceType } from '@/schema/device-type';
import reducers from './reducers';
import effects from './effects';


interface CleanViolationModalState {

    open: boolean,
    loading: boolean,
    device: DeviceType,
    message: string[],
}

let model: Model = {
    namespace: 'cleanViolationModal',
    state: {
        open: false,
        loading: false,
        device: undefined,
        message: []
    },
    reducers,
    effects
};

export { CleanViolationModalState };
export default model;