import noneImage from './styled/image/bsdMkMger8.png';
import { basename } from 'path';
import { debounce, throttle } from 'lodash';
import { OpenDialogReturnValue, ipcRenderer } from 'electron';
import React, { FC, useEffect, useRef, useState, memo } from 'react';
import { useDispatch, useSelector } from 'dva';
import UploadOutlined from '@ant-design/icons/UploadOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import { Col, Row, Card, Empty, Input, Image, Button, Form } from 'antd';
import { StateTree } from '@/type/model';
import { PaperworkModalState } from '@/model/default/paperwork-modal';
import { StepProp } from './prop';
import { EmptyBox, FormFourBox } from './styled/box';

const { Item } = Form;
const { TextArea } = Input;

/**
 * 第4步 
 */
const StepFour: FC<StepProp> = ({ formRef, visible }) => {

    const dispatch = useDispatch();
    const picturesPath = useRef<string>();
    const documentsPath = useRef<string>();

    const {
        fourFormValue
    } = useSelector<StateTree, PaperworkModalState>((state) => state.paperworkModal);

    useEffect(() => {
        const initValues = {
            checkStep: '',
            summary: '本次电子证据检查过程制作、生产的文件存放在附卷的光盘中。 \r\n至此检查过程结束。',
            attachments: [],
            reportCapture: ''
        };
        dispatch({
            type: 'paperworkModal/setFourFormValue', payload: initValues
        });
        formRef.setFieldsValue(initValues);
    }, []);


    useEffect(() => {
        ipcRenderer
            .invoke('get-path', 'pictures')
            .then(value => picturesPath.current = value);
        ipcRenderer
            .invoke('get-path', 'documents')
            .then(value => documentsPath.current = value);
    }, []);

    /**
     * 选择图片/压缩包
     */
    const selectFileHandle = debounce((type: 'image' | 'file') => {
        ipcRenderer
            .invoke('open-dialog', {
                title: '请选择照片',
                properties: type === 'image' ? ['openFile'] : ['multiSelections', 'openFile'],
                filters: [{
                    name: type === 'image' ? '图片文件' : '压缩包',
                    extensions: type === 'image' ? ['jpg', 'jpeg', 'png'] : ['zip', '7z', 'rar']
                }],
                defaultPath: type === 'image' ? picturesPath.current : documentsPath.current
            })
            .then(({ filePaths }: OpenDialogReturnValue) => {
                if (filePaths && filePaths.length > 0) {
                    switch (type) {
                        case 'file':
                            let prev = fourFormValue?.attachments ?? [];
                            let next = new Set([...prev, ...filePaths]);
                            dispatch({
                                type: 'paperworkModal/setFourFormValue', payload: {
                                    ...fourFormValue,
                                    attachments: Array.from(next)
                                }
                            });
                            break;
                        case 'image':
                            dispatch({
                                type: 'paperworkModal/setFourFormValue', payload: {
                                    ...fourFormValue,
                                    reportCapture: filePaths[0]
                                }
                            });
                            break;
                    }
                }
            }).catch((error) => {
                console.error(error);
            });
    }, 600, { leading: true, trailing: false });

    const onDrop = (path: string) => {
        const prev = fourFormValue?.attachments ?? [];
        const next = prev.filter(i => i !== path);
        dispatch({
            type: 'paperworkModal/setFourFormValue', payload: {
                ...fourFormValue,
                attachments: next
            }
        });
    };

    /**
     * 渲染附件列表
     */
    const renderAttach = () => {
        const attaches = fourFormValue?.attachments ?? [];
        return attaches.map((item, index) => <p
            key={`Attach_${index}`}>
            <Button
                onClick={() => onDrop(item)}
                data-path={item}
                size="small"
                type="primary"
                danger={true}
                title="删除"
                style={{ marginTop: '5px' }}>
                <DeleteOutlined />
            </Button>
            <span className="file-name">{basename(item)}</span>
        </p>);
    };

    /**
     * 表单项Change后更新对应值到store中
     */
    const onFormValueChange = throttle((changedValues: Record<string, any>) => {
        const next = { ...fourFormValue, ...changedValues };
        dispatch({ type: 'paperworkModal/setFourFormValue', payload: next });
    }, 200, { leading: false, trailing: true });

    return <FormFourBox style={{ display: visible ? 'block' : 'none' }}>
        <Form
            onValuesChange={onFormValueChange}
            form={formRef}
            layout="vertical">
            <Item
                name="checkStep"
                label="检查步骤"
                tooltip="可根据实际情况修改">
                <TextArea rows={5} />
            </Item>
            <Item
                name="summary"
                label="结语">
                <TextArea />
            </Item>
        </Form>
        <Row gutter={16}>
            <Col flex={1}>
                <fieldset className="sample-img">
                    <legend>
                        附件压缩包
                    </legend>
                    <div className="attaches">
                        {
                            fourFormValue?.attachments?.length === 0
                                ?
                                <EmptyBox>
                                    <Empty
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        description="暂无附件" />
                                </EmptyBox>
                                : <Card
                                    bordered={true}
                                    size="small"
                                    className="attach-card"
                                    style={{ width: '100%' }}>
                                    {renderAttach()}
                                </Card>
                        }
                        <Button
                            onClick={() => selectFileHandle('file')}
                            size="small"
                            type="primary">
                            <UploadOutlined />
                            <span>上传</span>
                        </Button>
                    </div>
                </fieldset>
            </Col>
            <Col flex={1}>
                <fieldset className="sample-img">
                    <legend>
                        取证报告截图
                    </legend>
                    <div className="imgs">
                        <div>
                            <Image
                                width={200}
                                height={200}
                                src={fourFormValue.reportCapture}
                                fallback={noneImage}
                                preview={fourFormValue.reportCapture === '' ? false : { mask: '取证报告截图' }}
                                rootClassName="preview-box" />
                            <Button
                                onClick={() => selectFileHandle('image')}
                                size="small"
                                type="primary">
                                <UploadOutlined />
                                <span>上传</span>
                            </Button>
                        </div>
                    </div>
                </fieldset>
            </Col>
        </Row>
    </FormFourBox>
};

export { StepFour };