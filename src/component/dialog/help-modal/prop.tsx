import React from 'react';
import { GuideImage } from '@/schema/guide-image';
import huaweiBackup from '../images/fetch/huawei_backup.jpg';
import meizuBackup from '../images/fetch/meizu_backup.jpg';
import oppoBackup from '../images/fetch/oppo_backup.jpg';
import oppoWiFi from '../images/fetch/oppo_wifi.jpg';
import vivoBackup from '../images/fetch/vivo_backup.jpg';
import vivoDev from '../images/fetch/vivo_dev.jpg';
import miBackup from '../images/fetch/mi_backup.jpg';
import oneplusBackup from '../images/fetch/oneplus_backup.jpg';
import oneplusWiFi from '../images/fetch/oneplus_wifi.jpg';
import blacksharkBackup from '../images/fetch/blackshark_backup.jpg';

interface Prop {
    /**
     * 确定回调
     */
    okHandle?: () => void;
    /**
     * 取消回调
     */
    cancelHandle?: () => void;
};

const tabItems: any[] = [
    {
        label: '小米',
        key: GuideImage.MiBackup,
        children: <div className="flow">
            <img src={miBackup} />
        </div>
    },
    {
        label: '华为',
        key: GuideImage.HuaweiBackup,
        children: <div className="flow">
            <img src={huaweiBackup} />
        </div>
    },
    {
        label: 'OPPO',
        key: GuideImage.OppoBackup,
        children: <div className="flow">
            <img src={oppoBackup} />
        </div>
    },
    {
        label: 'OPPO WiFi',
        key: GuideImage.OppoWifi,
        children: <div className="flow">
            <img src={oppoWiFi} />
        </div>
    },
    {
        label: 'VIVO',
        key: GuideImage.VivoBackup,
        children: <div className="flow">
            <img src={vivoBackup} />
        </div>
    },
    {
        label: 'VIVO开发者模式',
        key: GuideImage.VivoDev,
        children: <div className="flow">
            <img src={vivoDev} />
        </div>
    },
    {
        label: '一加',
        key: GuideImage.OneplusBackup,
        children: <div className="flow">
            <img src={oneplusBackup} />
        </div>
    }, {
        label: '一加 WiFi',
        key: GuideImage.OneplusWifi,
        children: <div className="flow">
            <img src={oneplusWiFi} />
        </div>
    }, {
        label: '魅族',
        key: GuideImage.MeizuBackup,
        children: <div className="flow">
            <img src={meizuBackup} />
        </div>
    }, {
        label: '黑鲨',
        key: GuideImage.BlacksharkBackup,
        children: <div className="flow">
            <img src={blacksharkBackup} />
        </div>
    }
];

export { Prop, tabItems };