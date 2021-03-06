import { ParseApp } from "@/schema/parse-app";
import { ITreeNode } from "@/type/ztree";


/**
 * 过滤勾选的node，返回level==2的应用结点
 * @param treeNode 勾选的zTree结点
 */
function filterToParseApp(treeNodes: ITreeNode[]) {
    return treeNodes.filter(node => node.level == 2).map(node => new ParseApp({
        m_strID: node.id,
        m_strPktlist: node.packages
    }));
}

export { filterToParseApp };