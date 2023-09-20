import React, { FC, memo } from 'react';

/**
 * 提示文案
 */
const ApkTip: FC<{}> = memo(() => {


    return <fieldset className="tip-msg full">
        <legend>操作提示</legend>
        {/* <div className="sub-tip">功能：</div> */}
        <ul>
            <li>
                选择要提取的设备及存储位置，勾选apk文件提取即可
            </li>
            <li>
                如果无设备数据，请点击刷新设备
            </li>
        </ul>
    </fieldset>;
});

export default ApkTip;
