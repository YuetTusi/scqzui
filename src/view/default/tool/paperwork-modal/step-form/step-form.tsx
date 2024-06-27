import React, { FC } from 'react';
import { Divider, Steps } from 'antd';
import { StepOne } from './step-one';
import { StepTwo } from './step-two';
import { StepThree } from './step-three';
import { StepFour } from './step-four';
import { StepFormBox } from './styled/box';
import { StepFormProp } from './prop';

/**
 * 表单
 */
const StepForm: FC<StepFormProp> = ({
    step, oneFormRef, twoFormRef, threeFormRef, fourFormRef
}) => {

    return <StepFormBox>
        <div className="step-box">
            <Steps
                current={step}
                items={[
                    { title: '填写报告信息' },
                    { title: '填写检查信息' },
                    { title: '设置检查信息' },
                    { title: '设置检查记录' }
                ]}
                size="small"
            />
        </div>
        <Divider />
        <div className="form-box">
            <StepOne formRef={oneFormRef} visible={step === 0} />
            <StepTwo formRef={twoFormRef} visible={step === 1} />
            <StepThree formRef={threeFormRef} visible={step === 2} />
            <StepFour formRef={fourFormRef} visible={step === 3} />
        </div>
    </StepFormBox >;
};

export { StepForm };