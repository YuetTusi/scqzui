import { basename, join } from 'path';
import { readdir, readFile } from 'fs/promises';
import dayjs from 'dayjs';
import React, { FC, MouseEvent, useEffect, useRef, useState } from 'react';
import RollbackOutlined from '@ant-design/icons/RollbackOutlined';
import { routerRedux, useDispatch, useLocation, useParams, useSelector } from 'dva';
import Button from 'antd/lib/button';
import log from '@/utils/log';
import { StateTree } from '@/type/model';
import { TrailState } from '@/model/default/trail';
import SubLayout from '@/component/sub-layout';
import { Split } from '@/component/style-tool';
import { ButtonBar, ListBox, TrailBox } from './styled/style';
import Empty from 'antd/lib/empty';
import { helper } from '@/utils/helper';
import { InvalidOAID } from '@/utils/regex';
import ButtonList from './button-list';
import InstallTab from './install-tab';
import CommandType, { SocketType } from '@/schema/command';
import { send } from '@/utils/tcp-server';
import Modal from 'antd/lib/modal';
import DeviceInfo from '@/component/device-info';

const queryTimeout = 30; //查询超时时间
const { Trace } = SocketType;

/**
 * 查询最近一次JSON文件
 * @param phonePath 设备目录
 * @param value (IMEI/OAID)值
 * @return 存在返回文件名，否则返回Promise<undefined>
 */
const getPrevJson = async (phonePath: string, value: string) => {
    try {
        const dir = await readdir(join(phonePath, 'AppQuery', value));
        if (dir.length > 0) {
            const [target] = dir.sort((m, n) => n.localeCompare(m)); //按文件名倒序，取最近的文件
            return target;
        } else {
            return undefined;
        }
    } catch (error) {
        console.log(error.message);
        return undefined;
    }
};

const toButtonList = (imei: string[], oaid: string) => {
    const buttons: Array<{ name: string; value: string; type: 'IMEI' | 'OAID' }> = [];

    if (!helper.isNullOrUndefined(imei)) {
        for (let i = 0; i < imei.length; i++) {
            if (!helper.isNullOrUndefinedOrEmptyString(imei[i])) {
                buttons.push({
                    name: `IMEI（${imei[i]}）`,
                    value: imei[i],
                    type: 'IMEI'
                });
            }
        }
    }

    if (!helper.isNullOrUndefinedOrEmptyString(oaid) && !InvalidOAID.test(oaid)) {
        buttons.push({
            name: `OAID（${oaid}）`,
            value: oaid,
            type: 'OAID'
        });
    }

    return buttons;
};


/**
 * 云点验
 */
const Trail: FC<{}> = () => {

    const dispatch = useDispatch();
    const { deviceData, installData } = useSelector<StateTree, TrailState>(state => state.trail);
    const { cid, did } = useParams<{ cid: string, did: string }>();
    const { search } = useLocation<{ cp: string, dp: string }>();
    const queryValue = useRef<string>(); //当前查询的值（因为一次只能查一个，后台反馈结果后使用此值读取JSON展示数据）
    const [imei, setImei] = useState<string[]>([]);
    const [oaid, setOaid] = useState<string>('');

    useEffect(() => {
        dispatch({ type: 'trail/queryDeviceAndCaseById', payload: did });
    }, []);

    useEffect(() => {
        dispatch({ type: 'trail/setLoading', payload: true });
        (async () => {
            try {
                if (deviceData !== null) {
                    const fetchDetailString: string = await readFile(
                        join(deviceData.phonePath!, 'Data/fetch_detail.json'),
                        { encoding: 'utf8' }
                    );
                    const {
                        device: { imei, oaid }
                    } = JSON.parse(fetchDetailString);
                    setImei(imei);
                    setOaid(oaid);
                }
            } catch (error) {
                log.error(`查询设备失败@view/default/trail/trail.tsx: ${error.message}`);
            } finally {
                dispatch({ type: 'trail/setLoading', payload: false });
            }
        })();
        return () => {
            setImei([]);
            setOaid('');
        };
    }, [deviceData]);

    /**
     * 返回handle
     */
    const onGoBackClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const params = new URLSearchParams(search);
        dispatch(
            routerRedux.push(`/parse?cid=${cid}&did=${did}&cp=${params.get('cp')}&dp=${params.get('dp')}`)
        );
    };

    /**
     * 查询Search
     * @param value 值
     * @param type 类型
     */
    const onSearch = async (value: string, type: 'IMEI' | 'OAID') => {
        queryValue.current = value;

        const prevJson = await getPrevJson(deviceData?.phonePath ?? '', value);

        if (prevJson) {
            const prevTime = dayjs
                .unix(Number(basename(prevJson, '.json')))
                .format('YYYY-MM-DD HH:mm:ss');
            Modal.confirm({
                onOk() {
                    dispatch({ type: 'appSet/setReading', payload: true });
                    send(Trace, {
                        type: Trace,
                        cmd: CommandType.AppRec,
                        msg: {
                            deviceId: deviceData?._id ?? '',
                            phonePath: deviceData?.phonePath ?? '',
                            value,
                            type,
                            timeout: queryTimeout
                        }
                    });
                    setTimeout(
                        () => dispatch({ type: 'appSet/setReading', payload: false }),
                        queryTimeout * 1000
                    );
                },
                onCancel() {
                    dispatch({
                        type: 'trail/readHistoryAppJson',
                        payload: join(
                            deviceData?.phonePath ?? '',
                            'AppQuery',
                            value,
                            prevJson
                        )
                    });
                },
                content: <div>
                    <div>
                        本次操作将<strong style={{ color: '#e90000' }}>使用1次</strong>查询，
                    </div>

                    <div>
                        可展示
                        <strong style={{ color: '#e90000' }}>{prevTime}</strong>
                        历史数据，请选择
                    </div>
                </div>,
                centered: true,
                title: '查询确认',
                okText: '查询',
                cancelText: '查看历史'
            });
        } else {
            Modal.confirm({
                onOk() {
                    dispatch({ type: 'appSet/setReading', payload: true });
                    send(Trace, {
                        type: Trace,
                        cmd: CommandType.AppRec,
                        msg: {
                            deviceId: deviceData?._id ?? '',
                            phonePath: deviceData?.phonePath ?? '',
                            value,
                            type,
                            timeout: queryTimeout
                        }
                    });
                    setTimeout(
                        () => dispatch({ type: 'appSet/setReading', payload: false }),
                        queryTimeout * 1000
                    );
                },
                content: <div>
                    本次操作将<strong style={{ color: '#e90000' }}>使用1次</strong>
                    查询，确认吗？
                </div>,
                centered: true,
                title: '查询确认',
                okText: '是',
                cancelText: '否'
            });
        }
    };

    /**
     * 渲染功能区
     */
    const render = () => {
        if (imei.length === 0 && helper.isNullOrUndefinedOrEmptyString(oaid)) {
            return <Empty description="暂无数据" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
        } else {
            return <>
                <div>
                    <ButtonList buttonList={toButtonList(imei, oaid)} onSearch={onSearch} />
                </div>
                <InstallTab installData={installData} />
            </>;
        }
    };

    return <SubLayout title="云点验">
        <TrailBox>
            <ButtonBar>
                <Button onClick={onGoBackClick} type="primary">
                    <RollbackOutlined />
                    <span>返回</span>
                </Button>
            </ButtonBar>
            <Split />
            <ListBox>
                <div className="title">
                    设备信息
                </div>
                <div className="content">
                    <DeviceInfo caseId={cid} deviceId={did} />
                </div>
            </ListBox>
            <Split />
            <ListBox>
                <div className="panel">
                    {render()}
                </div>
            </ListBox>
        </TrailBox>
    </SubLayout>
}

export default Trail;