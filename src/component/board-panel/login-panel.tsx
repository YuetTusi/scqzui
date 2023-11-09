import React, { FC, useEffect, useState } from 'react';
import { helper } from '@/utils/helper';
import Auth from '../auth';
import DragBar from '../drag-bar';
import { Copyright } from './copyright';
import { BackgroundBox, Header } from './styled/header';
import { Center } from './styled/center';
import { Footer } from './styled/footer';

const { max } = helper.readConf()!;

/**
 * 过滤-字符
 */
const filterCharactor = (text?: string) =>
    text === undefined ? '' : text.replaceAll('-', '.');


/**
 * @description 用户登录页面板
 */
const LoginPanel: FC<{}> = ({ children }) => {

    const [title, setTitle] = useState<string>('');
    const [version, setVersion] = useState<string>('');
    const [manu, setManu] = useState<string>('');
    const [isDebug, setIsDebug] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            try {
                const {
                    manufacturer, materials_name, materials_software_version
                } = await helper.readManufaturer();
                setManu(manufacturer ?? '北京万盛华通科技有限公司');
                setTitle(materials_name ?? '智能终端取证系统');
                setVersion(materials_software_version ?? 'v0.0.1');
            } catch (error) {
                console.warn(error);
                setTitle('');
                setVersion('');
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            setIsDebug(await helper.isDebug());
        })();
    }, []);

    return <>
        <BackgroundBox>
            <DragBar />
            <Header>
                <div className="header-caption">
                    <span>{title}</span>
                    <Auth deny={!isDebug}>
                        <span style={{ color: '#f9ca24' }}>{max}路</span>
                    </Auth>
                    <em style={{ cursor: 'default' }}>
                        {filterCharactor(version)}
                    </em>
                </div>
            </Header>
            <Center>
                {children}
            </Center>
            <Footer>
                <Copyright>{manu}</Copyright>
            </Footer>
        </BackgroundBox>
    </>
};

export { LoginPanel };