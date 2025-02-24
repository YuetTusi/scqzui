import { AnyAction } from 'redux';
import { HelpModalState } from ".";

export default {

    /**
     * 更新提取方式
     * @param payload {name:string,value:string}[] 
     */
    setOpen(state: HelpModalState, { payload }: AnyAction) {
        state.open = payload;
        return state;
    },
    /**
     * 更新厂商
     */
    setManufacturer(state: HelpModalState, { payload }: AnyAction) {
        state.manufacturer = payload;
        return state;
    }
};