import React, { FC } from 'react';
import { CompleteMsgProp } from './prop';
import { CompleteMsgBox } from './styled/style';

const CompleteMsg: FC<CompleteMsgProp> = ({ savePath, fileName, openHandle }) => {
    return <CompleteMsgBox>
        「<em>{fileName}</em>」已保存至目录「
        <a onClick={() => openHandle(savePath)}>{savePath}</a>」
    </CompleteMsgBox>;
};

CompleteMsg.defaultProps = {
    fileName: 'report',
    savePath: '',
    openHandle: () => { }
};

export default CompleteMsg;
