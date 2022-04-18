import { AnyAction } from 'redux';
import { ImportDataModalState } from ".";


export default {

    /**
     * 更新显示
     */
    setVisible(state: ImportDataModalState, { payload }: AnyAction) {
        state.visible = payload;
        return state;
    },
    /**
     * 更新显示
     */
    setTitle(state: ImportDataModalState, { payload }: AnyAction) {
        state.title = payload;
        return state;
    },
    /**
     * 更新导入类型
     */
    setImportType(state: ImportDataModalState, { payload }: AnyAction) {
        state.importType = payload;
        return state;
    }
};