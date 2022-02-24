import { Model } from 'dva';
import subscriptions from './subscriptions';

let model: Model = {
    namespace: 'receive',
    subscriptions
};

export default model;