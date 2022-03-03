import { HumanVerify } from '@/schema/human-verify';


/**
 * 属性
 */
interface Prop {
    /**
     * 是否显示
     */
    visible: boolean,
    /**
     * USB序号
     */
    usb: number,
    /**
     * 应用id
     */
    appId: string,
    /**
     * 标题
     */
    title: string,
    /**
     * 图形验证数据
     */
    humanVerifyData: HumanVerify | null,
    /**
     * 显示handle
     */
    closeHandle: () => void
}

export { Prop };