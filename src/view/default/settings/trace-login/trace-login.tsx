import debounce from 'lodash/debounce';
import React, { FC, MouseEvent, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'dva';
import KeyOutlined from '@ant-design/icons/KeyOutlined';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Alert from 'antd/lib/alert';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import Statistic from 'antd/lib/statistic';
import Checkbox, { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { Split } from '@/component/style-tool';
import { StateTree } from '@/type/model';
import { LoginState, TraceLoginState } from '@/model/default/trace-login';
import { helper } from '@/utils/helper';
import { send } from '@/utils/tcp-server';
import { TraceUser } from '@/schema/trace-user';
import CommandType, { SocketType } from '@/schema/command';
import { MainBox } from '../styled/sub-layout';
import LoginForm from './login-form';
import { FormValue } from './login-form/prop';
import { FormBox, StateBar } from './styled/style';
import { TraceLoginProp } from './prop';

const { Trace } = SocketType;
const { useForm } = Form;

const getLoginState = (state: LoginState) => {
    switch (state) {
        case LoginState.NotLogin:
            return 'info';
        case LoginState.IsLogin:
            return 'success';
        case LoginState.LoginError:
            return 'error';
        default:
            return 'info';
    }
};

/**
 * 云点验查询登录
 */
const TraceLogin: FC<TraceLoginProp> = () => {

    const dispatch = useDispatch();
    const [formRef] = useForm<FormValue>();
    const {
        limitCount,
        username,
        password,
        remember,
        loginState,
        loginMessage
    } = useSelector<StateTree, TraceLoginState>(state => state.traceLogin);

    const [rememberMe, setRememberMe] = useState<boolean>(false);

    useEffect(() => {
        dispatch({ type: 'traceLogin/queryUser', payload: null });
    }, []);

    useEffect(() => {
        const { setFieldsValue } = formRef;

        if (username !== undefined && password !== undefined) {
            setFieldsValue({
                username,
                password: helper.base64ToString(password)
            });
            setRememberMe(remember);
        }
    }, [username, password, remember]);

    /**
     * 保存状态Change
     */
    function onRememberChange(event: CheckboxChangeEvent) {
        setRememberMe(event.target.checked);
        dispatch({ type: 'traceLogin/updateRemember', payload: event.target.checked });
    }

    /**
     * 登录Submit
     */
    const onLoginSubmit = debounce(
        async (event: MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            const { validateFields } = formRef;
            try {
                const { username, password } = await validateFields();
                dispatch({ type: 'traceLogin/setLoginState', payload: LoginState.Busy });
                //用户&密码存库
                dispatch({
                    type: 'traceLogin/saveUser',
                    payload: {
                        username,
                        password: helper.stringToBase64(password),
                        remember: rememberMe
                    }
                });
                dispatch({
                    type: 'traceLogin/setUser',
                    payload: { username, password: helper.stringToBase64(password), rememberMe }
                });
                send(Trace, {
                    type: Trace,
                    cmd: CommandType.TraceLogin,
                    msg: { username, password }
                });
            } catch (error) {
                console.warn(error);
            }
        },
        500,
        { leading: true, trailing: false }
    );

    return <MainBox>
        <StateBar>
            <span />
            <Button
                onClick={onLoginSubmit}
                disabled={
                    loginState === LoginState.Busy ||
                    loginState === LoginState.IsLogin
                }
                type="primary">
                {loginState === LoginState.Busy ? <LoadingOutlined /> : <KeyOutlined />}
                <span>登录</span>
            </Button>
        </StateBar>
        <Split />
        <FormBox>
            <StateBar>
                <Alert
                    message={loginMessage}
                    type={getLoginState(loginState)}
                    showIcon={true}
                />
                <Statistic title="剩余次数" value={limitCount} />
            </StateBar>
            <Split />
            <LoginForm loginState={loginState} formRef={formRef} />
            <Row justify="end">
                <Col>
                    <div className="remember-box">
                        <Checkbox
                            checked={rememberMe}
                            onChange={onRememberChange}>
                            <span>保持登录状态</span>
                        </Checkbox>
                    </div>
                </Col>
            </Row>
        </FormBox>
    </MainBox>
};

export default TraceLogin;