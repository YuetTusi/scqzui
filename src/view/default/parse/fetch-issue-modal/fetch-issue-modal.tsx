import { join } from 'path';
import React, { FC, useEffect, useState } from 'react';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import Button from 'antd/lib/button';
import Empty from 'antd/lib/empty';
import Modal from 'antd/lib/modal';
import { helper } from '@/utils/helper';
import { FetchIssueModalProp, IssueData } from './prop';
import { IssueBox } from './styled/style';

const { fetchText } = helper.readConf()!;

/**
 * 采集过程异常弹窗
 */
const FetchIssueModal: FC<FetchIssueModalProp> = ({
    open, phonePath, onCancel
}) => {

    const [issue, setIssue] = useState<IssueData[]>([]);

    useEffect(() => {
        if (open && phonePath) {
            const filePath = join(phonePath, './fetch_issue.json');

            (async () => {
                try {
                    const exist = await helper.existFile(filePath);
                    if (exist) {
                        const fetchIssue: IssueData[] = await helper.readJSONFile(filePath);
                        setIssue(fetchIssue);
                    } else {
                        setIssue([]);
                    }
                } catch (error) {
                    console.warn(error.message);
                    setIssue([]);
                }
            })();
        }
    }, [open, phonePath]);

    const render = () => {
        if (issue.length === 0) {
            return <div className="middle">
                <Empty description="暂无记录" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>;
        }

        return <ul>
            {issue.map((item, index) => {
                return <li key={`FIM_Item_${index}`}>
                    <label>【{item.time}】</label>
                    <span style={{ color: '#ff3333' }}>{item.issue}</span>
                </li>;
            })}
        </ul>;

    }

    return <Modal
        footer={[
            <Button
                onClick={() => onCancel()}
                type="default"
                key="FIM_0">
                <CloseCircleOutlined />
                <span>取消</span>
            </Button>
        ]}
        open={open}
        onCancel={onCancel}
        title={`${fetchText ?? '采集'}异常记录`}
        width={800}
        centered={true}
        maskClosable={false}
        destroyOnClose={true}
        className="zero-padding-body">
        <IssueBox>
            <div className="list-block">
                {render()}
            </div>
        </IssueBox>
    </Modal >
};

export { FetchIssueModal };