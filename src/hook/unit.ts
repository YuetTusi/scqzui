import { useSelector } from 'dva';
import { StateTree } from '@/type/model';
import { Organization } from '@/schema/organization';


/**
 * 获取采集单位名称及编码
 */
export const useUnit = (): [string | undefined, string | undefined] => {
    const {
        collectUnitCode, collectUnitName
    } = useSelector<StateTree, Organization>(state => state.organization);
    return [collectUnitCode, collectUnitName];
}

/**
 * 获取目的检验单位名称及编码
 */
export const useDstUnit = (): [string | undefined, string | undefined] => {
    const {
        dstUnitCode, dstUnitName
    } = useSelector<StateTree, Organization>(state => state.organization);
    return [dstUnitCode, dstUnitName];
}