import noneImage from './styled/image/bsdMkMger8.png';
import { debounce, throttle } from 'lodash';
import { OpenDialogReturnValue, ipcRenderer } from 'electron';
import React, { FC, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'dva';
import UploadOutlined from '@ant-design/icons/UploadOutlined';
import { Col, Row, Button, Form, Input, Image } from 'antd';
import DeviceType from '@/schema/device-type';
import { StateTree } from '@/type/model';
import { PaperworkModalState } from '@/model/default/paperwork-modal';
import localStore, { LocalStoreKey } from '@/utils/local-store';
import { DeviceList } from './device-list';
import { FormThreeBox } from './styled/box';
import { StepProp } from './prop';

const { Item } = Form;

const StepThree: FC<StepProp> = ({ visible, formRef }) => {

    const dispatch = useDispatch();
    const picturesPath = useRef<string>();
    const [currentDev, setCurrentDev] = useState<DeviceType>(); //当前正在编辑的设备
    const [front, setFront] = useState<string>(''); //正面照片路径
    const [back, setBack] = useState<string>(''); //背面照片路径
    const {
        checkedDevices,
        threeFormValue
    } = useSelector<StateTree, PaperworkModalState>((state) => state.paperworkModal);

    /**
     * 选择图片
     */
    const selectImageHandle = debounce((type: 'front' | 'back') => {
        const { setFieldsValue } = formRef;
        ipcRenderer
            .invoke('open-dialog', {
                title: '请选择照片',
                properties: ['openFile'],
                filters: [{ name: '图片文件', extensions: ['jpg', 'jpeg', 'png'] }],
                defaultPath: localStore.get(LocalStoreKey.SysPath).pictures
            })
            .then(({ filePaths }: OpenDialogReturnValue) => {
                if (filePaths && filePaths.length > 0) {
                    switch (type) {
                        case 'back':
                            setBack(filePaths[0]);
                            dispatch({
                                type: 'paperworkModal/setThreeFormValue',
                                payload: threeFormValue.map(i => {
                                    if (i._id === currentDev?._id) {
                                        return { ...i, backPath: filePaths[0] };
                                    } else {
                                        return i;
                                    }
                                })
                            });
                            break;
                        case 'front':
                            setFront(filePaths[0]);
                            dispatch({
                                type: 'paperworkModal/setThreeFormValue',
                                payload: threeFormValue.map(i => {
                                    if (i._id === currentDev?._id) {
                                        return { ...i, frontPath: filePaths[0] };
                                    } else {
                                        return i;
                                    }
                                })
                            });
                            break;
                    }
                }
            }).catch(() => {
                setFieldsValue({ savePath: '' });
            });
    }, 600, { leading: true, trailing: false });

    const onDeviceClick = (id: string) => {
        const current = threeFormValue.find(i => i._id === id);
        if (current) {
            formRef.setFieldsValue(current);
            setBack(current.backPath);
            setFront(current.frontPath);
            setCurrentDev(current);
        }
    };

    /**
     * 表单项Change后更新对应值到store中
     */
    const onFormValueChange = throttle((changedValues: Record<string, any>) => {
        const value = { ...currentDev, ...changedValues };
        const next = threeFormValue.map((i) => {
            if (i._id === value._id) {
                return { ...i, ...value };
            } else {
                return i;
            }
        });
        dispatch({ type: 'paperworkModal/setThreeFormValue', payload: next });
    }, 200, { leading: false, trailing: true });

    return <FormThreeBox style={{ display: visible ? 'flex' : 'none' }}>
        <div className="dev-box">
            <DeviceList
                data={checkedDevices}
                onClick={onDeviceClick} />
        </div>
        <div className="form-three-box">
            <Form
                form={formRef}
                onValuesChange={onFormValueChange}
                disabled={currentDev === undefined}
                layout="vertical">
                <Item
                    name="mobileName"
                    label="检材名称">
                    <Input />
                </Item>
                <Row gutter={16}>
                    <Col flex={1}>
                        <Item
                            name="model"
                            label="检材型号">
                            <Input />
                        </Item>
                    </Col>
                    <Col flex={1}>
                        <Item
                            name="mobileHolder"
                            label="持有人">
                            <Input />
                        </Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col flex={1}>
                        <Item
                            name="imei"
                            label="IMEI/MEID">
                            <Input />
                        </Item>
                    </Col>
                    <Col flex={1}>
                        <Item
                            name="mobileNumber"
                            label="手机号">
                            <Input />
                        </Item>
                    </Col>
                </Row>
            </Form>
            <fieldset className="sample-img">
                <legend>
                    检材图片
                </legend>
                <div className="imgs">
                    <div>
                        <Image
                            width={200}
                            height={200}
                            src={front}
                            fallback={noneImage}
                            preview={front === '' ? false : { mask: '正面照片' }}
                            rootClassName="preview-box" />
                        <Button
                            onClick={() => selectImageHandle('front')}
                            size="small"
                            type="primary">
                            <UploadOutlined />
                            <span>正面</span>
                        </Button>
                    </div>
                    <div>
                        <Image
                            width={200}
                            height={200}
                            fallback={noneImage}
                            src={back}
                            preview={back === '' ? false : { mask: '背面照片' }}
                            rootClassName="preview-box" />
                        <Button
                            onClick={() => selectImageHandle('back')}
                            size="small"
                            type="primary">
                            <UploadOutlined />
                            <span>背面</span>
                        </Button>
                    </div>
                </div>
            </fieldset>
        </div>
    </FormThreeBox>;
};

export { StepThree };