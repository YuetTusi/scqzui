import debounce from 'lodash/debounce';
import { clipboard } from 'electron';
import React, { FC, MouseEvent, useRef } from 'react';
import CopyOutlined from '@ant-design/icons/CopyOutlined';
import Button from 'antd/lib/button';
import message from 'antd/lib/message';
import { QuickCopyBox } from './styled/style';

/**
 * 拷贝内容到剪贴板
 */
const QuickCopy: FC<{ desc?: string }> = ({ desc, children }) => {
	const childRef = useRef<HTMLDivElement>(null);

	/**
	 * 拷贝Click
	 */
	const onCopyClick = debounce(
		(event: MouseEvent<HTMLButtonElement>) => {
			event.preventDefault();
			if (childRef.current !== null) {
				clipboard.writeText(childRef.current.innerText);
				message.destroy();
				message.success('序列号已拷贝');
			}
		},
		500,
		{ leading: true, trailing: false }
	);

	return <QuickCopyBox>
		<span className="float-cpy">
			<Button onClick={onCopyClick} title={desc} size="small">
				<CopyOutlined />
			</Button>
		</span>
		<span ref={childRef}>{children}</span>
	</QuickCopyBox>;
};

export default QuickCopy;
