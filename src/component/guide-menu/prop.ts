import { MouseEvent } from 'react';

type clickHandle = (event: MouseEvent<HTMLElement>) => void;

interface GuideMenuProp { }

interface ColorButtonProp {

    /**
     * 跳转路径
     */
    to: string | clickHandle,
    /**
     * 按钮颜色值
     */
    color: string,
    /**
     * 图标DOM
     */
    icon: JSX.Element
}

interface ImageButtonProp {
    /**
     * 跳转路径
     */
    to: string,
    /**
     * 图标DOM
     */
    icon?: JSX.Element,
    /**
     * 图片路径
     */
    src: string,
    /**
     * 描述
     */
    description?: string | JSX.Element
}

export { GuideMenuProp, ColorButtonProp, ImageButtonProp };