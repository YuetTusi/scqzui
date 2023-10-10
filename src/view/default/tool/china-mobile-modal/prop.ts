export interface ChinaMobileModalProp {

    visible: boolean,

    onCancel: () => void
}

export interface FormValue {
    /**
     * 服务密码
     */
    servpasswd: string,
    /**
     * 短信验证码
     */
    smspasswd: string,
    /**
     * 图片验证码
     */
    imgcode: string
}