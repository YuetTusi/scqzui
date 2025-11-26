import debounce from 'lodash/debounce';
import { clipboard } from 'electron';
import React, { FC, MouseEvent, useRef } from 'react';
import Button from 'antd/lib/button';
import message from 'antd/lib/message';
import CopyOutlined from '@ant-design/icons/CopyOutlined';
/**
 * 可拷贝到剪切板中的文本
 */
const CopyableText: FC<{ text: string }> = ({ text }) => {

    const textRef = useRef<HTMLDivElement>(null);

    /**
     * 拷贝Click
     */
    const onCopyClick = debounce(
        (event: MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            if (textRef.current !== null) {
                clipboard.writeText(textRef.current.innerText);
                message.destroy();
                message.success('文字已拷贝');
            }
        },
        500,
        { leading: true, trailing: false }
    );

    return <span>
        <span ref={textRef}>{text}</span>
        <Button
            onClick={onCopyClick}
            type="link"
            title="拷贝文字"
            size="small">
            <CopyOutlined />
        </Button>
    </span>
};

export { CopyableText };