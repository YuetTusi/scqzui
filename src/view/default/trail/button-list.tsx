import React, { FC } from 'react';
import SearchOutlined from '@ant-design/icons/SearchOutlined'
import Button from 'antd/lib/button';
import { ButtonListProp } from './prop';

const { Group } = Button;

const ButtonList: FC<ButtonListProp> = ({ buttonList, onSearch }) => (
    <Group style={{ flexWrap: 'wrap' }}>
        {buttonList.map(({ name, value, type }) => (
            <Button
                onClick={() => onSearch(value, type)}
                key={`Q_${value}`}
                type="primary">
                <SearchOutlined />
                <span>{name}</span>
            </Button>
        ))}
    </Group>
);

ButtonList.defaultProps = {
    buttonList: [],
    onSearch: () => { }
};

export default ButtonList;
