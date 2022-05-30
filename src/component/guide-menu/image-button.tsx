import debounce from 'lodash/debounce';
import React, { FC, useEffect, useRef } from 'react';
import { routerRedux, useDispatch } from 'dva';
import { Image } from './styled/button';
import { ImageButtonProp } from './prop';

/**
 * 图片大按钮
 */
const ImageButton: FC<ImageButtonProp> = ({ to, icon, src, description, children }) => {

    const dispatch = useDispatch();
    const imageBoxRef = useRef<HTMLDivElement>(null);
    const maskRef = useRef<HTMLDivElement>(null);

    const onImageBoxMouseover = debounce((event: MouseEvent) => {
        event.preventDefault();
        maskRef.current!.classList.add('open');
    }, 400, { leading: true, trailing: false });

    const onImageBoxMouseleave = (event: MouseEvent) => {
        event.preventDefault();
        maskRef.current!.classList.remove('open');
    };

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

    return <Image ref={imageBoxRef}>
        <div onClick={() => dispatch(routerRedux.push(to))} className="push-img" style={{ backgroundImage: `url(${src})` }}>
            <a>
                <div className="icon-box">{icon}</div>
                <div className="text-box">{children}</div>
            </a>
            {renderDescMask()}
        </div>
    </Image>;
};

export default ImageButton;