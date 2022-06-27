import React, { FC, useEffect, useState, MouseEvent } from 'react';
import { useDispatch, useParams, routerRedux } from 'dva';
import RollbackOutlined from '@ant-design/icons/RollbackOutlined'
import SaveOutlined from '@ant-design/icons/SaveOutlined'
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import { Split } from '@/component/style-tool';
import { TableName } from '@/schema/table-name';
import Officer from '@/schema/officer';
import { getDb } from '@/utils/db';
import EditForm from './edit-form';
import { MainBox } from '../styled/sub-layout';
import { EditBox } from './styled/style';
import policeSvg from './styled/images/police.svg';

const { useForm } = Form;

/**
 * 编辑采集人员
 */
const Edit: FC<{}> = () => {

    const dispatch = useDispatch();
    const [formRef] = useForm<Officer>();
    const [editData, setEditData] = useState<Officer>();
    const { id } = useParams<{ id: string }>();

    useEffect(() => {

        if (id !== '-1') {
            (async () => {
                const db = getDb<Officer>(TableName.Officer);
                try {
                    const data = await db.findOne({ _id: id });
                    setEditData(data);
                } catch (error) {
                    console.log(error);
                }
            })();
        }
    }, []);

    /**
     * 保存Click
     */
    const onSaveClick = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const { validateFields } = formRef;
        try {
            const values = await validateFields();
            if (id === '-1') {
                //add
                dispatch({ type: 'officer/insertOfficer', payload: values });
            } else {
                //edit
                dispatch({
                    type: 'officer/editOfficer', payload: {
                        ...values,
                        _id: id
                    }
                });
            }
        } catch (error) {
            console.clear();
            console.warn(error);
        }
    }

    return <MainBox>
        <EditBox>
            <div className="button-bar">
                <div>
                    <Button
                        onClick={() => dispatch(routerRedux.push('/settings/officer'))}
                        type="primary">
                        <RollbackOutlined />
                        <span>返回</span>
                    </Button>
                </div>
                <div>
                    <Button
                        onClick={onSaveClick}
                        type="primary">
                        <SaveOutlined />
                        <span>保存</span>
                    </Button>
                </div>
            </div>
            <Split />
            <div className="form-box">
                <img src={policeSvg} />
                <EditForm formRef={formRef} data={editData} />
            </div>
        </EditBox>

    </MainBox>
}

export default Edit;