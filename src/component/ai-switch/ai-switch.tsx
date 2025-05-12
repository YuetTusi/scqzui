import { join } from 'path';
import React, { FC, useEffect, FocusEvent } from 'react';
import { useDispatch, useSelector } from 'dva';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Checkbox, { CheckboxChangeEvent } from 'antd/lib/checkbox';
import InputNumber from 'antd/lib/input-number';
import Tooltip from 'antd/lib/tooltip';
import { useDestroy } from '@/hook';
import { helper } from '@/utils/helper';
import { StateTree } from '@/type/model';
import { AiSwitchState } from '@/model/default/ai-switch';
import { Predict, AiSwitchProp, PredictJson } from './prop';

const cwd = process.cwd();
const isDev = process.env['NODE_ENV'] === 'development';

/**
 * AI分析开关组件
 */
const AiSwitch: FC<AiSwitchProp> = ({
    casePath
}) => {

    const dispatch = useDispatch();
    const {
        similarity,
        disableOcr,
        // ocr
    } = useSelector<StateTree, AiSwitchState>(state => state.aiSwitch);

    useEffect(() => {
        if (disableOcr) {
            dispatch({ type: 'aiSwitch/setOcr', payload: false });
        }
    }, [disableOcr]);

    useDestroy(() => dispatch({ type: 'aiSwitch/setData', payload: [] }));

    useEffect(() => {
        const tempAt = isDev
            ? join(cwd, './data/predict.json')
            : join(cwd, './resources/config/predict.json'); //模版路径
        (async () => {
            try {
                if (casePath === undefined) {
                    //无案件目录，是新增，读模版
                    const next: PredictJson = await helper.readJSONFile(tempAt);
                    dispatch({ type: 'aiSwitch/setSimilarity', payload: next.similarity });
                    dispatch({ type: 'aiSwitch/setOcr', payload: next.ocr });
                } else {
                    const aiConfigAt = join(casePath, './predict.json'); //当前案件AI路径
                    const exist = await helper.existFile(aiConfigAt);
                    if (exist) {
                        //案件下存在，读取案件下的predict.json
                        const next: PredictJson = await helper.readJSONFile(aiConfigAt);
                        dispatch({
                            type: 'aiSwitch/setSimilarity',
                            payload: next.similarity
                        });
                        dispatch({
                            type: 'aiSwitch/setOcr',
                            payload: next.ocr
                        });
                    } else {
                        //不存在，读取模版
                        const next: PredictJson = await helper.readJSONFile(tempAt);
                        dispatch({
                            type: 'aiSwitch/setSimilarity',
                            payload: next.similarity
                        });
                        dispatch({
                            type: 'aiSwitch/setOcr',
                            payload: next.ocr
                        });
                    }
                }
            } catch (error) {
                console.warn(`读取predict.json失败, @view/default/case/ai-switch:${error.message}`);
            }
        })();
    }, [casePath]);

    /**
     * 相似度Change
     * @param value 值
     */
    const onSimilarChange = (value: number | null) =>
        dispatch({ type: 'aiSwitch/setSimilarity', payload: value });

    /**
     * OCR识别Change
     * @param value 值
     */
    // const onOcrChange = (event: CheckboxChangeEvent) =>
    //     dispatch({ type: 'aiSwitch/setOcr', payload: event.target.checked });

    const onSimilarBlur = ({ target }: FocusEvent<HTMLInputElement>) => {
        if (target.value.trim() === '') {
            dispatch({ type: 'aiSwitch/setSimilarity', payload: 0 });
        }
    };

    return <Row align="middle" style={{ margin: '2rem 0' }}>
        <Col offset={2}>
            <label>设定阈值：</label>
        </Col>
        <Col>
            <InputNumber
                onChange={onSimilarChange}
                onBlur={onSimilarBlur}
                value={similarity}
                defaultValue={0}
                min={0}
                max={100}
                addonAfter="%" />
        </Col>
        {/* <Col>
            <label style={{ marginLeft: '5rem' }}>AI图片识别违规分析：</label>
        </Col>
        <Col>
            <Tooltip title={disableOcr ? '使用此功能请关闭「图片违规分析」' : '开启将识别图片中文字违规信息'}>
                <Checkbox
                    onChange={onOcrChange}
                    checked={ocr}
                    disabled={disableOcr} />
            </Tooltip>
        </Col> */}
    </Row>
};

AiSwitch.defaultProps = {
    casePath: undefined
};

export { Predict };
export default AiSwitch;