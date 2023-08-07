import { AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';
// import { getDb } from '@/utils/db';
import log from '@/utils/log';

export default {

    *test({ }: AnyAction, { put }: EffectsCommandMap) {
        log.info('Log in Model Cloud');
    }
};