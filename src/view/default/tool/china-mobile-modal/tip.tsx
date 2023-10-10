import React, { FC, memo } from 'react';

/**
 * 提示文案
 */
const Tip: FC<{}> = memo(() => {


    return <fieldset className="tip-msg full">
        <legend>操作提示</legend>
        <ol>
            <li>
                请点击「<strong>获取二维码</strong>」
            </li>
            <li>
                使用手机扫描二维码，正确登录后，填写相关信息后点击「<strong>获取验证码</strong>」，填写相关信息，点击「<strong>下载帐单</strong>」即可
            </li>
            <li>
                如果二维码失效，请再点击「获取二维码」重新扫描
            </li>
        </ol>
    </fieldset>;
});

export { Tip };
