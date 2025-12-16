import GuideImage from '@/schema/guide-image';
import installApk from '../images/apk/apk.jpg';
import huaweiHisuite from '../images/fetch/huawei_hisuite.jpg';
import huaweiBackup from '../images/fetch/huawei_backup.jpg';
import huaweiClone from '../images/fetch/huawei_clone.jpg';
import honorClone from '../images/fetch/honor_clone.jpg';
import meizuBackup from '../images/fetch/meizu_backup.jpg';
import oppoBackup from '../images/fetch/oppo_backup.jpg';
import oppoWiFi from '../images/fetch/oppo_wifi.jpg';
import oppoTrans from '../images/fetch/oppo_trans.jpg';
import oppoReplace from '../images/fetch/oppo_replace.jpg';
import nubiaWiFi from '../images/fetch/nubia_wifi.jpg';
import samsungTrans from '../images/fetch/samsung_trans.jpg';
import vivoBackup from '../images/fetch/vivo_backup.jpg';
import miBackup from '../images/fetch/mi_backup.jpg';
import miReplace from '../images/fetch/mi_replace.jpg';
import installEasyshare from '../images/apk/easy_share.jpg';
import oneplusBackup from '../images/fetch/oneplus_backup.jpg';
import oneplusWiFi from '../images/fetch/oneplus_wifi.jpg';
import easymover2 from '../images/apk/easymover2.jpg';
import blacksharkBackup from '../images/fetch/blackshark_backup.jpg';

export const imageMap: Record<string, string> = {
	[GuideImage.InstallApk]: installApk,
	[GuideImage.HuaweiBackup]: huaweiBackup,
	[GuideImage.HuaweiHisuite]: huaweiHisuite,
	[GuideImage.HuaweiClone]: huaweiClone,
	[GuideImage.HonorClone]: honorClone,
	[GuideImage.MeizuBackup]: meizuBackup,
	[GuideImage.OppoWifi]: oppoWiFi,
	[GuideImage.OppoBackup]: oppoBackup,
	[GuideImage.OppoTrans]: oppoTrans,
	[GuideImage.OppoReplace]: oppoReplace,
	[GuideImage.NubiaWifi]: nubiaWiFi,
	[GuideImage.SamsungTrans]: samsungTrans,
	[GuideImage.VivoBackup]: vivoBackup,
	[GuideImage.MiBackup]: miBackup,
	[GuideImage.MiReplace]: miReplace,
	[GuideImage.InstallEasyshare]: installEasyshare,
	[GuideImage.OneplusBackup]: oneplusBackup,
	[GuideImage.OneplusWifi]: oneplusWiFi,
	[GuideImage.InstallEasymover2]: easymover2,
	[GuideImage.BlacksharkBackup]: blacksharkBackup,
};