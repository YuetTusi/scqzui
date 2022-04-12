import { LoginState } from "@/model/default/trace-login";
import { FormInstance } from "antd/es/form/Form";

export interface FormValue {

    username: string,

    password: string
}

export interface LoginFormProp {

    formRef: FormInstance<FormValue>,

    /**
     * 登录状态
     */
    loginState: LoginState
}
