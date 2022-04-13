import React, { FC } from 'react';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import CheckCircleFilled from '@ant-design/icons/CheckCircleFilled';
import CloseCircleFilled from '@ant-design/icons/CloseCircleFilled';
import Alert from 'antd/lib/alert';

interface TestAlertProp {
    state: TestState
}

enum TestState {
    None,
    Testing,
    Success,
    Failure
}

const TestAlert: FC<TestAlertProp> = ({ state }) => {

    switch (state) {
        case TestState.Testing:
            return <Alert message="正在测试，请稍等" type="info" icon={<LoadingOutlined />} showIcon={true} />;
        case TestState.Success:
            return <Alert message="连接成功，请保存配置" type="success" icon={<CheckCircleFilled />} showIcon={true} />;
        case TestState.Failure:
            return <Alert message="无法连接到指定地址" type="error" icon={<CloseCircleFilled />} showIcon={true} />;
        case TestState.None:
        default:
            return null;
    }
};

export { TestAlert, TestState };