import { join } from 'path';
import React, { FC, useEffect, useState } from 'react';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import { Button, Modal, Checkbox } from 'antd';
import { StandardJson, StandardModalProp } from './prop';
import { helper } from '@/utils/helper';
import { StandardBox } from './styled/box';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';

const { Group } = Checkbox;
const target = helper.IS_DEV
    ? join(helper.APP_CWD, 'data/standard.json')
    : join(helper.APP_CWD, 'resources/config/standard.json');

let standardJson: StandardJson | null = null;

/**
 * 标准选择框
 */
const StandardModal: FC<StandardModalProp> = ({
    open, defaultValue, onCancel, onOk
}) => {

    const [data, setData] = useState<StandardJson>({ gb: [], sf: [] });

    useEffect(() => {
        if (standardJson === null) {
            (async () => {
                try {
                    standardJson = await helper.readJSONFile(target)
                } catch (error) {
                    console.warn(error);
                }
            })();
        }
    }, []);

    useEffect(() => {
        if (standardJson) {
            standardJson.gb = standardJson.gb.map(item => {
                const has = (defaultValue ?? []).some(i => i === item.value);
                item.checked = has;
                return item;
            });
            standardJson.sf = standardJson.sf.map(item => {
                const has = (defaultValue ?? []).some(i => i === item.value);
                if (has) {
                    item.checked = has;
                }
                return item;
            });
            setData(standardJson);
        }
    }, [open, defaultValue]);


    const toOptions = (item: { value: string, disabled: boolean, checked: boolean }[]) =>
        item.map((i) => ({
            label: i.value,
            value: i.value,
            disabled: i.disabled,
            checked: i.checked
        }));

    const onOkClick = () => {
        const gb = data.gb.filter(i => i.checked).map(i => i.value);
        const sf = data.sf.filter(i => i.checked).map(i => i.value);
        onOk([...gb, ...sf]);
    };

    const onCancelClick = () => {
        // setData({ gb: [], sf: [] });
        // gb.current.clear();
        // sf.current.clear();
        onCancel();
    };

    const onGbChange = (checkValue: CheckboxValueType[]) => {
        const next = data.gb.map(item => {
            const has = checkValue.find(i => i === item.value);
            item.checked = has !== undefined;
            return item;
        });
        setData(prev => ({ ...prev, gb: next }));
    };

    const onSfChange = (checkValue: CheckboxValueType[]) => {
        const next = data.sf.map(item => {
            const has = checkValue.find(i => i === item.value);
            item.checked = has !== undefined;
            return item;
        });
        setData(prev => ({ ...prev, sf: next }));
    };

    return <Modal
        footer={[
            <Button
                onClick={onCancelClick}
                type="default"
                key="SM_0">
                <CloseCircleOutlined />
                <span>取消</span>
            </Button>,
            <Button
                onClick={() => onOkClick()}
                type="primary"
                key="SM_1">
                <CheckCircleOutlined />
                <span>确定</span>
            </Button>
        ]}
        open={open}
        onCancel={onCancelClick}
        title="检测方法"
        width={600}
        centered={true}
        destroyOnClose={true}
        maskClosable={false}
        getContainer="#app">
        <StandardBox>
            <fieldset className="stand-sort">
                <legend>
                    国家标准
                </legend>
                <Group
                    onChange={onGbChange}
                    options={toOptions(data.gb)}
                    defaultValue={data.gb.filter(i => i.checked).map(i => i.value)}
                    name="gb" />
            </fieldset>
            <fieldset className="stand-sort">
                <legend>
                    司法规范
                </legend>
                <Group
                    onChange={onSfChange}
                    defaultValue={data.sf.filter(i => i.checked).map(i => i.value)}
                    options={toOptions(data.sf)}
                    name="sf" />
            </fieldset>
        </StandardBox>
    </Modal>
};

export { StandardModal };