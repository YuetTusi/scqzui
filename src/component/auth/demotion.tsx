import React, { FC } from "react";
import { DemotionProp } from "./prop";

/**
 * 降级组件
 */
const Demotion: FC<DemotionProp> = ({ widget }) =>
    widget === undefined
        ? null
        : <>{widget}</>;


Demotion.defaultProps = {
    widget: undefined
};

export { Demotion };