import React, { FC, MouseEvent } from 'react';
import RollbackOutlined from '@ant-design/icons/RollbackOutlined';
import { routerRedux, useDispatch, useLocation, useParams, useSelector } from 'dva';
import Button from 'antd/lib/button';
import { StateTree } from '@/type/model';
import { TrailState } from '@/model/default/trail';
import SubLayout from '@/component/sub-layout';
import { Split } from '@/component/style-tool';
import { ButtonBar, TrailBox } from './styled/style';

/**
 * 云点验
 */
const Trail: FC<{}> = () => {

    const dispatch = useDispatch();
    const { } = useSelector<StateTree, TrailState>(state => state.trail);
    const { cid, did } = useParams<{ cid: string, did: string }>();
    const { search } = useLocation<{ cp: string, dp: string }>();

    /**
     * 返回handle
     */
    const onGoBackClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const params = new URLSearchParams(search);
        dispatch(
            routerRedux.push(`/parse?cid=${cid}&did=${did}&cp=${params.get('cp')}&dp=${params.get('dp')}`)
        );
    };

    return <SubLayout title="云点验">
        <TrailBox>
            <ButtonBar>
                <Button onClick={onGoBackClick} type="primary">
                    <RollbackOutlined />
                    <span>返回</span>
                </Button>
            </ButtonBar>
            <Split />
        </TrailBox>
    </SubLayout>
}

export default Trail;