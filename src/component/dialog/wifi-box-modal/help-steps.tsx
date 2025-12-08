import React, { FC } from 'react';
import { HelpStepsProp } from './prop';
import image0 from './styled/images/1.png';
import image1 from './styled/images/2.png';
import image2 from './styled/images/3.png';
import image3 from './styled/images/4.png';
import image4 from './styled/images/5.png';
import image5 from './styled/images/6.png';
import image6 from './styled/images/7.png';
import image7 from './styled/images/8.png';
import image8 from './styled/images/9.png';
import image9 from './styled/images/10.png';

const ins: Record<number, string> = {
    [0]: '创建简易的管理员密码点击确定',
    [1]: '点击跳过向导',
    [2]: '上网设置wan口设置点击固定wan网口',
    [3]: '无线设置关闭WiFi多频合一点击保存',
    [4]: '2.4G和5G无线设置如图所示，点击保存',
    [5]: 'LAN口设置如图所示，点击保存',
    [6]: 'DHCP服务关闭点击保存',
    [7]: '易展按键点击关闭',
    [8]: '无线路由以太网协议4属性设置如图所示',
    [9]: '打开任务管理器启动服务中的`OpenDHCPServer`'
};

const images: Record<number, string> = {
    [0]: image0,
    [1]: image1,
    [2]: image2,
    [3]: image3,
    [4]: image4,
    [5]: image5,
    [6]: image6,
    [7]: image7,
    [8]: image8,
    [9]: image9
}

const HelpSteps: FC<HelpStepsProp> = ({ step }) => <>
    <div className="text">{ins[step]}</div>
    <div className="image-box">
        <img src={images[step]} />
    </div>
</>;

export { HelpSteps };