import React, { FC } from 'react';

/**
 * 错误描述
 */
const ErrorMessage: FC<{ error: Error | undefined }> = ({ error }) => {

    const now = new Date();

    if (error) {
        console.warn('堆栈消息：');
        console.error(error.stack);
        return <div style={{ color: '#f9ca24', paddingTop: '2rem' }}>
            <div>{error.message}</div>
            <div>
                {now.toLocaleString()}
            </div>
        </div>
    } else {
        return <div style={{ color: '#f9ca24' }}>
            <div>
                {now.toLocaleString()}
            </div>
        </div>
    }
}

export { ErrorMessage };