import React, { FC } from 'react';
import { useDispatch, useSelector } from 'dva';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined'
import SoundOutlined from '@ant-design/icons/SoundOutlined'
import { StateTree } from '@/type/model';
import { AlartMessageState } from '@/model/default/alart-message';
import { AlartMessageBox } from './styled/style';
import { Prop } from './prop';

/**
 * 全局消息组件
 * 仓库数据使用DashboardModel
 */
const AlartMessage: FC<Prop> = () => {

    const dispatch = useDispatch();
    const { alertMessage } = useSelector<StateTree, AlartMessageState>(state =>
        state.alartMessage
    );

    const closeHandle = (id: string) =>
        dispatch({ type: 'alartMessage/removeAlertMessage', payload: id });

    const renderList = (): JSX.Element[] | null => {
        if (alertMessage.length === 0) {
            return null;
        } else {
            return alertMessage.map((item, index) => (
                <li key={`M_${index}`}>
                    <div title={item.msg}>
                        <SoundOutlined className="alarm-message-ico" />
                        <span className="alarm-message-txt">{item.msg}</span>
                    </div>
                    <div className="alarm-message-close-btn" title="关闭">
                        <CloseCircleOutlined onClick={() => closeHandle(item.id)} />
                    </div>
                </li>
            ));
        }
    };

    return (
        <AlartMessageBox
            style={{ display: alertMessage.length === 0 ? 'none' : 'block' }}
            className="alarm-message-root">
            <div className="alarm-message-bg">
                <ul>{renderList()}</ul>
            </div>
        </AlartMessageBox>
    );
};

export default AlartMessage;
