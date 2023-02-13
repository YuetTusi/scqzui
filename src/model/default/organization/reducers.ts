import { AnyAction } from 'redux';
import { Organization } from '@/schema/organization';

export default {

    /**
     * 设置采集单位
     */
    setCollectUnit(state: Organization, { payload }: AnyAction) {

        const { collectUnitCode, collectUnitName } = payload;
        state.collectUnitCode = collectUnitCode;
        state.collectUnitName = collectUnitName;
        return state;
    },
    /**
     * 设置目的检验单位
     */
    setDstUnit(state: Organization, { payload }: AnyAction) {

        const { dstUnitCode, dstUnitName } = payload;
        state.dstUnitCode = dstUnitCode;
        state.dstUnitName = dstUnitName;
        return state;
    },
    /**
     * 设置单位
     */
    setUnit(state: Organization, { payload }: AnyAction) {
        const { collectUnitCode, collectUnitName, dstUnitCode, dstUnitName } = payload;
        state.collectUnitCode = collectUnitCode;
        state.collectUnitName = collectUnitName;
        state.dstUnitCode = dstUnitCode;
        state.dstUnitName = dstUnitName;
        return state;
    }
}