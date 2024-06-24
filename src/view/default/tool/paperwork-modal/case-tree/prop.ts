
import { TreeNodeProps } from "antd";
import { Key, ReactNode } from "react";
import CaseInfo from "@/schema/case-info";


export interface CaseTreeProp {

    data: TreeNodeProps[],

    expandedKeys: Key[],

    onExpand: (keys: Key[]) => void
}