import { AnyAction } from 'redux';
import { EditQuickEventModalState } from '.';


export default {

    setData(state: EditQuickEventModalState, { payload }: AnyAction) {
        state.data = payload;
        return state;
    },
    setVisible(state: EditQuickEventModalState, { payload }: AnyAction) {
        state.visible = payload;
        return state;
    }
};
