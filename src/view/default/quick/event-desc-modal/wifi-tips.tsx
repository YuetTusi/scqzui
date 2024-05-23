import React, { FC, memo } from 'react';
import { helper } from '@/utils/helper';
import { WiFiTipBox } from './styled/style';

const { fetchText } = helper.readConf()!;

/**
 * 连接WiFi提示
 */
const WiFiTips: FC<{ ip: string }> = memo(({ ip }) => {

    let tip: string | JSX.Element = '';

    switch (ip) {
        case '192.168.137.1':
            tip = <div><strong>本机WiFi热点</strong></div>;
            break;
        case '172.28.1.1':
        case '192.168.50.99':
            tip = <div style={{ width: '140px' }}>
                <div>WiFi：<strong>abco_apbc2G</strong>或<strong>abco_apbc5G</strong></div>
                <div>密码：<strong>11111111</strong></div>
            </div>;
            break;
        case '192.168.191.1':
            tip = <div style={{ width: '160px' }}>
                <div>
                    <strong>{`WiFi：快速${fetchText ?? '点验'}密码8个1`}</strong>
                </div>
                <div>
                    密码：<strong>11111111</strong>
                </div>
            </div>;
            break;
        default:
            break;
    }

    return <WiFiTipBox>{tip}</WiFiTipBox>;
});

export { WiFiTips };