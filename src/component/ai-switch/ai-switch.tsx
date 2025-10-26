import chunk from 'lodash/chunk';
import { join } from 'path';
import React, { FC, useEffect, FocusEvent, useState } from 'react';
import { useDispatch, useSelector } from 'dva';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Checkbox, { CheckboxChangeEvent } from 'antd/lib/checkbox';
import InputNumber from 'antd/lib/input-number';
import Select from 'antd/lib/select';
import Switch from 'antd/lib/switch';
import Tooltip from 'antd/lib/tooltip';
import { useDestroy } from '@/hook';
import { helper } from '@/utils/helper';
import { StateTree } from '@/type/model';
import { AiSwitchState } from '@/model/default/ai-switch';
import { AiOcrType } from '@/schema/case-info';
import Auth from '../auth';
import { Predict, AiSwitchProp, PredictJson, CaseType } from './prop';

const cwd = process.cwd();
const isDev = process.env['NODE_ENV'] === 'development';

/**
 * AI&OCR下拉选项
 */
const getOptions = (type: CaseType) => {

    if (type === CaseType.Normal) {
        return [
            { value: AiOcrType.Close, label: '关闭' },
            { value: AiOcrType.GlobalOcr, label: 'OCR文字识别' },
            { value: AiOcrType.AiOcr, label: 'AI图片识别' },
            { value: AiOcrType.AiResultOcr, label: 'AI图片识别并对结果OCR文字识别' },
            { value: AiOcrType.GlobalAiOcr, label: 'AI图片识别全部图片OCR' }
        ];
    } else {
        return [
            { value: AiOcrType.Close, label: '关闭' },
            { value: AiOcrType.AiOcr, label: 'AI图片识别' }
        ];
    }
};

/**
 * AI分析开关组件
 */
const AiSwitch: FC<AiSwitchProp> = ({
    casePath, caseType, columnCount
}) => {

    const dispatch = useDispatch();
    const [wired, setWired] = useState<boolean>(false);
    const { data, similarity, aiType } = useSelector<StateTree, AiSwitchState>(state => state.aiSwitch);

    useEffect(() => {
        (async () => {
            try {
                const isWired = await helper.isWired();
                setWired(isWired);
            } catch (error) {
                setWired(false);
            }
        })();
    }, []);

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
                    dispatch({ type: 'aiSwitch/setData', payload: (next as { config: Predict[], similarity: number }).config });
                    dispatch({ type: 'aiSwitch/setSimilarity', payload: (next as { config: Predict[], similarity: number }).similarity });
                    dispatch({ type: 'aiSwitch/setAiType', payload: AiOcrType.Close });
                } else {
                    const aiConfigAt = join(casePath, './predict.json'); //当前案件AI路径
                    const exist = await helper.existFile(aiConfigAt);
                    if (exist) {
                        //案件下存在，读取案件下的predict.json
                        const next: PredictJson = await helper.readJSONFile(aiConfigAt);
                        if (Array.isArray(next)) {
                            //旧版predict.json
                            dispatch({ type: 'aiSwitch/setData', payload: next });
                            dispatch({ type: 'aiSwitch/setSimilarity', payload: 0 });
                            dispatch({ type: 'aiSwitch/setAiType', payload: AiOcrType.Close });
                        } else {
                            dispatch({ type: 'aiSwitch/setData', payload: (next as { config: Predict[], similarity: number }).config });
                            dispatch({ type: 'aiSwitch/setSimilarity', payload: (next as { config: Predict[], similarity: number }).similarity });
                            dispatch({ type: 'aiSwitch/setAiType', payload: AiOcrType.Close });
                        }
                    } else {
                        //不存在，读取模版
                        const next: PredictJson = await helper.readJSONFile(tempAt);
                        dispatch({ type: 'aiSwitch/setData', payload: (next as { config: Predict[], similarity: number }).config });
                        dispatch({ type: 'aiSwitch/setSimilarity', payload: (next as { config: Predict[], similarity: number }).similarity });
                        dispatch({ type: 'aiSwitch/setAiType', payload: AiOcrType.Close });
                    }
                }
            } catch (error) {
                console.warn(`读取predict.json失败, @view/default/case/ai-switch:${error.message}`);
                dispatch({ type: 'aiSwitch/setData', payload: [] });
            }
        })();
    }, [casePath]);


    /**
     * AI开关Change
     * @param checked 选中
     * @param type AI类型
     */
    const onSwitchChange = (checked: boolean, type: string) => {
        const next = data.map((item) => {
            if (item.type === type) {
                return { ...item, use: checked };
            } else {
                return item;
            }
        })
        dispatch({ type: 'aiSwitch/setData', payload: next });
    }

    /**
     * 相似度Change
     * @param value 值
     */
    const onSimilarChange = (value: number | null) =>
        dispatch({ type: 'aiSwitch/setSimilarity', payload: value });

    const onAiOcrTypeChange = (value: AiOcrType) =>
        dispatch({ type: 'aiSwitch/setAiType', payload: value });

    const onSimilarBlur = ({ target }: FocusEvent<HTMLInputElement>) => {
        if (target.value.trim() === '') {
            dispatch({ type: 'aiSwitch/setSimilarity', payload: 0 });
        }
    }

    const renderSwitch = () => {

        if (data.length === 0) {
            return null;
        }
        const last = 24 % columnCount === 0
            ? 24 / columnCount
            : Math.ceil(24 / columnCount) - 1; //最后列
        const rows = chunk(data.filter(i => !i.hide), columnCount);
        return rows.map((row, i) => <Row style={{ padding: '16px 0' }} key={`AIROW_${i}`}>
            {
                row.map((col, j) => {
                    if (!col.hide) {
                        return helper.isNullOrUndefinedOrEmptyString(col.tips)
                            ? <Col span={j === row.length - 1 ? last : Math.ceil(24 / columnCount)} key={`AICOL_${j}`}>
                                <label>{col.title}：</label>
                                <Switch
                                    onChange={(checked: boolean) => onSwitchChange(checked, col.type)}
                                    checked={col.use}
                                    size="small" />
                            </Col>
                            : <Col span={j === row.length - 1 ? last : Math.ceil(24 / columnCount)} key={`AICOL_${j}`}>
                                <Tooltip title={col.tips}>
                                    <label>{col.title}：</label>
                                    <Switch
                                        onChange={(checked: boolean) => onSwitchChange(checked, col.type)}
                                        checked={col.use}
                                        size="small" />
                                </Tooltip>
                            </Col>;
                    }
                })
            }
        </Row>);
    };

    return <>
        <Row align="middle" style={{ margin: '2rem 0' }}>
            <Col flex="none">
                <label style={{ marginLeft: '5rem' }}>AI类型：</label>
            </Col>
            <Col flex="none">
                <Select
                    value={aiType}
                    onChange={onAiOcrTypeChange}
                    options={getOptions(caseType)}
                    style={{ width: '260px' }} />
            </Col>
            <Col flex="none" style={{ marginLeft: '40px' }}>
                <label>设定阈值：</label>
            </Col>
            <Col flex="auto">
                <InputNumber
                    onChange={onSimilarChange}
                    onBlur={onSimilarBlur}
                    value={similarity}
                    disabled={aiType === AiOcrType.Close || aiType === AiOcrType.GlobalOcr}
                    defaultValue={0}
                    min={0}
                    max={100}
                    addonAfter="%"
                    style={{ width: '150px' }} />
            </Col>
        </Row>
        <Auth deny={wired}>
            {renderSwitch()}
        </Auth>
    </>
};

AiSwitch.defaultProps = {
    casePath: undefined,
    columnCount: 5
};

export { Predict };
export default AiSwitch;