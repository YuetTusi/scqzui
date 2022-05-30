import debounce from 'lodash/debounce';
import React, { FC, useEffect, useRef } from 'react';
import { NavLink } from 'dva/router';
import { Color } from './styled/button';
import { ColorButtonProp } from './prop';

/**
 * 主屏大按钮
 */
const ColorButton: FC<ColorButtonProp> = ({ to, icon, color, description, children }) => {

    const maskRef = useRef<HTMLDivElement>(null);
    const imageBoxRef = useRef<HTMLDivElement>(null);

    const onImageBoxMouseover = debounce((event: MouseEvent) => {
        event.preventDefault();
        maskRef.current!.classList.add('open');
    }, 400, { leading: true, trailing: false });

    const onImageBoxMouseleave = (event: MouseEvent) => {
        event.preventDefault();
        maskRef.current!.classList.remove('open');
    };

    useEffect(() => {
        if (description !== undefined) {
            if (imageBoxRef.current && maskRef.current) {
                imageBoxRef.current.addEventListener('mouseover', onImageBoxMouseover);
                imageBoxRef.current.addEventListener('mouseleave', onImageBoxMouseleave);
            }
        }
        return () => {
            if (description !== undefined && imageBoxRef.current !== null) {
                imageBoxRef.current!.removeEventListener('mouseover', onImageBoxMouseover);
                imageBoxRef.current!.removeEventListener('mouseleave', onImageBoxMouseleave);
            }
        };
    }, []);

    /**
     * 文案遮罩层
     */
    const renderDescMask = () => {
        if (description === undefined) {
            return null;
        }
        return <div ref={maskRef} className="desc-mask">
            {description}
        </div>
    }

    if (typeof to === 'string') {
        return <Color color={color} ref={imageBoxRef}>
            <NavLink to={to} replace={true}>
                <div className="icon-box">{icon}</div>
                <div className="text-box">{children}</div>
            </NavLink>
            {renderDescMask()}
        </Color>;
    } else {
        return <Color onClick={to} color={color} ref={imageBoxRef}>
            <a>
                <div className="icon-box">{icon}</div>
                <div className="text-box">{children}</div>
            </a>
            {renderDescMask()}
        </Color>
    }
};

export default ColorButton;