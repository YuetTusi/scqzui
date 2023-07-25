import React, { FC, MouseEvent } from 'react';
import UndoOutlined from '@ant-design/icons/UndoOutlined';
import Button from 'antd/lib/button';
import { PanelHeaderBox } from './styled/box';

interface PanelHeaderProp {
    /**
     * 移动到按钮上Handle
     */
    onResetButtonHover: (event: MouseEvent) => void;
    /**
     * 还原Click
     */
    onResetClick: (event: MouseEvent) => void;
}

const PanelHeader: FC<PanelHeaderProp> = ({ onResetButtonHover, onResetClick }) => {
    return <PanelHeaderBox>
        <span>高级设置</span>
        <span>
            <Button
                onMouseEnter={onResetButtonHover}
                onClick={onResetClick}
                type="default"
                size="small">
                <UndoOutlined />
                <span>还原默认值</span>
            </Button>
        </span>
    </PanelHeaderBox>;
};

PanelHeader.defaultProps = {
    onResetButtonHover: () => { },
    onResetClick: () => { }
}

export { PanelHeader };
