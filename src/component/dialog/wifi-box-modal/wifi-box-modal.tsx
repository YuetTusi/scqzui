import React, { FC, useState } from 'react';
import { useSelector } from 'dva';
import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined';
import ArrowRightOutlined from '@ant-design/icons/ArrowRightOutlined';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';
import Steps from 'antd/lib/steps';
import { StateTree } from '@/type/model';
import { HelpSteps } from './help-steps';
import { WifiBoxModalProp } from './prop';
import { StepsBox } from './styled/box';

const WifiBoxModal: FC<WifiBoxModalProp> = ({ onCancel }) => {

    const { open } = useSelector((state: StateTree) => state.wifiBoxModal);
    const [step, setStep] = useState<number>(0);

    const onStepChange = (value: number) => {
        setStep(value);
    };

    const onCancelClick = () => {
        setStep(0);
        onCancel();
    };

    return <Modal
        footer={[
            <Button
                key="WBM_0"
                type="default"
                onClick={onCancelClick}>
                <CloseCircleOutlined />
                <span>取消</span>
            </Button>,
            <Button
                key="WBM_1"
                type="primary"
                disabled={step <= 0}
                onClick={() => setStep((prev) => prev - 1)}>
                <ArrowLeftOutlined />
                <span>上一步</span>
            </Button>,
            <Button
                key="WBM_2"
                type="primary"
                disabled={step >= 9}
                onClick={() => setStep((prev) => prev + 1)}>
                <ArrowRightOutlined />
                <span>下一步</span>
            </Button>
        ]}
        open={open}
        onCancel={onCancelClick}
        centered={true}
        destroyOnClose={true}
        maskClosable={false}
        width={1440}
        title="配置采集WiFi"
        getContainer="#root"
        className="zero-padding-body">
        <StepsBox>
            <div className="step">
                <Steps
                    current={step}
                    onChange={onStepChange}
                    items={[
                        { title: '第1步' },
                        { title: '第2步' },
                        { title: '第3步' },
                        { title: '第4步' },
                        { title: '第5步' },
                        { title: '第6步' },
                        { title: '第7步' },
                        { title: '第8步' },
                        { title: '第9步' },
                        { title: '第10步' }
                    ]}
                    direction="vertical"
                    size="small">
                </Steps>
            </div>

            <div className="explain">
                <HelpSteps step={step} />
            </div>
        </StepsBox>
    </Modal>
};

export { WifiBoxModal };