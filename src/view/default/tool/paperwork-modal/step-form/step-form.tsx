import React, { FC, useState } from 'react';
import { Button, Divider, Form, Steps } from 'antd';
import { StepOne } from './step-one';
import { StepTwo } from './step-two';
import { StepFormBox } from './styled/box';
import { StepFormProp, StepOneFormValue } from './prop';

const { useForm } = Form;

/**
 * 表单
 */
const StepForm: FC<StepFormProp> = ({
    step, oneFormRef, twoFormRef
}) => {

    return <StepFormBox>
        <div className="step-box">
            <Steps
                current={step}
                items={[
                    { title: '填写报告信息' },
                    { title: '填写检查信息' },
                    { title: '设置检查信息' },
                    { title: '设置检查记录' },
                    { title: '报告预览' }
                ]}
                size="small"
            />
        </div>
        <Divider />
        <div className="form-box">
            <StepOne formRef={oneFormRef} visible={step === 0} />
            <StepTwo formRef={twoFormRef} visible={step === 1} />
        </div>
    </StepFormBox >;
};

export { StepForm };