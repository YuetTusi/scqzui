import { Key } from "react";
import { TreeNodeProps } from "antd";

export interface CaseTreeProp {

    /**
     * 节点数据
     */
    data: TreeNodeProps[],
    /**
     * 加载中
     */
    loading: boolean,
    /**
     * 禁用
     */
    disabled: boolean,
    /**
     * 展开节点key
     */
    expandedKeys: Key[],
    /**
     * 展开handle
     * @param keys[] 节点key 
     */
    onExpand: (keys: Key[]) => void
}