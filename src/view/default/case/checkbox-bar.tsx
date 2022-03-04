import React, { FC, useState } from 'react';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Tooltip from 'antd/lib/tooltip';
import Form from 'antd/lib/form';
import Checkbox from 'antd/lib/checkbox';
import { helper } from '@/utils/helper';
import { FormProp } from './case-add/prop';

const config = helper.readConf()!;
const { Item } = Form;

/**
 * 功能Checkbox行（根据conf配置文件来隐藏部分功能）
 */
const CheckboxBar: FC<{}> = () => {

	const [sdCard, setSdCard] = useState<boolean>(false);
	const [hasReport, setHasReport] = useState<boolean>(false);
	const [autoParse, setAutoParse] = useState<boolean>(false);
	const [generateBcp, setGenerateBcp] = useState<boolean>(false);
	const [attachment, setAttachment] = useState<boolean>(false);
	const [isDel, setIsDel] = useState<boolean>(false);
	const [isAi, setIsAi] = useState<boolean>(false);

	return (
		<Item label="拉取SD卡">
			<Row>
				<Col span={1}>
					<Checkbox onChange={(event) => setSdCard(event.target.checked)} checked={sdCard} />
				</Col>,
				<Col span={3}>
					<span>生成报告：</span>
					<Checkbox onChange={(event) => setHasReport(event.target.checked)} checked={hasReport} />
				</Col>,
				<Col span={3}>
					<span>自动解析：</span>
					<Tooltip title="勾选后, 取证完成将自动解析应用数据">
						<Checkbox onChange={(event) => setAutoParse(event.target.checked)} checked={autoParse} />
					</Tooltip>
				</Col>
			</Row>
		</Item>
	);
};

export { CheckboxBar };
