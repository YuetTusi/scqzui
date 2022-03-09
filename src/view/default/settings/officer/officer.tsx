import React, { FC, MouseEvent, useEffect } from 'react';
import PlusCircleOutlined from '@ant-design/icons/PlusCircleOutlined'
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined'
import Empty from 'antd/lib/empty';
import Icon from 'antd/lib/icon';
import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';
import { connect, useDispatch, useSelector } from 'dva';
import { routerRedux } from 'dva/router';
import { StateTree } from '@/type/model';
import { Officer as OfficerEntity } from '@/schema/officer';
import policeSvg from './styled/images/police.svg';
import { OfficerProp } from './prop';
import { OfficerState } from '@/model/default/officer';
import { OfficerBox } from './styled/style';
import SubLayout from '@/component/sub-layout';
import { Split } from '@/component/style-tool';
import { MainBox } from '@/component/sub-layout/styled/layout';

/**
 * @description 采集人员信息
 */
const Officer: FC<OfficerProp> = () => {

    const dispatch = useDispatch();
    const { data } = useSelector<StateTree, OfficerState>(state => state.officer);

    useEffect(() => {
        dispatch({ type: 'officer/fetchOfficer' });
    }, []);

    /**
     * 采集人员Click
     * @param e
     * @param current 当前实体
     */
    const policeClick = (e: MouseEvent<HTMLDivElement>, current: OfficerEntity) => {
        const { tagName } = e.target as any;
        if (tagName === 'path' || tagName === 'svg') {
            e.stopPropagation();
        } else {
            dispatch(
                routerRedux.push({
                    pathname: `/settings/officer/${current._id}`
                })
            );
        }
    };

    /**
     * 删除
     */
    const delOfficerClick = (e: MouseEvent<HTMLDivElement>) => {
        const { id, name } = e.currentTarget.dataset;
        Modal.confirm({
            title: '删除',
            content: `确认删除「${name}」？`,
            okText: '是',
            cancelText: '否',
            onOk: () => {
                dispatch({ type: 'officer/delOfficer', payload: id });
            }
        });
    };

    const renderOfficer = (): JSX.Element => {
        if (data && data.length > 0) {
            let $li = data.map((item, i) => (
                <li key={`L_${i}`}>
                    <div
                        className="police"
                        onClick={(event: MouseEvent<HTMLDivElement>) => policeClick(event, item)}>
                        <img src={policeSvg} className="avatar" alt="头像" />
                        <div className="info">
                            <span>姓名：{item.name}</span>
                            <em>编号：{item.no}</em>
                        </div>
                        <div
                            className="drop"
                            data-id={item._id}
                            data-name={item.name}
                            onClick={delOfficerClick}
                            title="删除采集人员">
                            <CloseCircleOutlined style={{ fontSize: '22px' }} />
                        </div>
                    </div>
                </li>
            ));
            return <ul>{$li}</ul>;
        } else {
            return <Empty description="暂无采集人员" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
        }
    };

    return (
        <MainBox>
            <OfficerBox>
                <div className="button-bar">
                    <div></div>
                    <div>
                        <Button
                            onClick={() => dispatch(routerRedux.push('/settings/officer/-1'))}
                            type="primary">
                            <PlusCircleOutlined />
                            <span>新增</span>
                        </Button>
                    </div>
                </div>
                <Split />
                <div className="police-list">{renderOfficer()}</div>
            </OfficerBox>
        </MainBox>
    );
};

export default connect((state: StateTree) => ({ officer: state.officer }))(Officer);
