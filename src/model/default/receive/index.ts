import { Model } from 'dva';
import subscriptions from './subscriptions';

let model: Model = {
    namespace: 'receive',
    effects: {},
    reducers: {},
    subscriptions
};

export default model;