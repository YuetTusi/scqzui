import React, { FC, useEffect, useState } from 'react';
import { helper } from '@/utils/helper';
import DragBar from '../drag-bar';
import { Center } from './styled/center';

/**
 * @description 布局页
 */
const LayoutPanel: FC<{}> = ({ children }) => {

    const [title, setTitle] = useState<string>('');

    useEffect(() => {
        (async () => {
            try {
                const { materials_name, materials_software_version } = await helper.readManufaturer();
                setTitle(`${materials_name} ${materials_software_version}`);
            } catch (error) {
                console.warn(error);
                setTitle('');
            }
        })();
    }, []);

    return <>
        <DragBar>
            {(title ?? '').replace(/\-/g, '.')}
        </DragBar>
        <Center>
            {children}
        </Center>
    </>
};

export default LayoutPanel;
