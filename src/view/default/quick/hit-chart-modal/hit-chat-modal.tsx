import { join } from 'path';
import { execFile } from 'child_process';
import { shell, ipcRenderer, OpenDialogReturnValue } from 'electron';
import React, { FC, MouseEvent, useEffect } from 'react';
import * as echars from 'echarts/core';
import { PieChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers';
import {
    TitleComponent,
    LegendComponent,
    TooltipComponent
} from 'echarts/components';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import DownloadOutlined from '@ant-design/icons/DownloadOutlined';
import Button from 'antd/lib/button';
import Empty from 'antd/lib/empty';
import Modal from 'antd/lib/modal';
import message from 'antd/lib/message';
import { useQuickEvent, useQuickHit } from '@/hook';
import { helper } from '@/utils/helper';
import { EmptyBox } from './styled/style';
import { HitChartModalProp } from './prop';

const cwd = process.cwd();
const { caseText } = helper.readConf()!;
let charts: echars.ECharts | null = null;

echars.use([
    TitleComponent,
    LegendComponent,
    TooltipComponent,
    PieChart,
    CanvasRenderer
]);


const openFileInBrowser = (target: string) => {
    shell.openPath(target);
};

/**
 * 命中数量饼图展示
 */
const HitChartModal: FC<HitChartModalProp> = ({
    visible, record, exportHandle, closeHandle
}) => {

    const eventData = useQuickEvent(record?.caseId!);
    const data = useQuickHit(record);

    useEffect(() => {
        return () => {
            if (charts !== null) {
                charts.dispose();
                charts = null;
            }
        };
    }, []);

    useEffect(() => {
        const $target = document.getElementById('hit-dom');
        if ($target !== null) {
            if (charts === null) {
                charts = echars.init($target, 'dark');
            }
            charts.setOption({
                tooltip: {
                    trigger: 'item'
                },
                backgroundColor: '#1f1f1f',
                legend: {
                    type: 'scroll',
                    orient: 'vertical',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    pageTextStyle: {
                        color: '#fff'
                    },
                    formatter: (name: string) => {
                        const next = (data?.items ?? []).find((item: any) => item.name === name);
                        return `${name}(${next?.value ?? '0'})`;
                    }
                },
                series: [
                    {
                        name: '命中统计',
                        type: 'pie',
                        center: ['40%', '50%'],
                        data: data?.items ?? [],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            });
        }
    }, [data, visible]);

    const onDirSelect = async (event: MouseEvent<HTMLButtonElement>) => {

        const exeDir = join(cwd, '../tools/create_excel_report');

        event.preventDefault();

        if (eventData === undefined) {
            message.destroy();
            message.warn(`读取${caseText ?? '案件'}数据失败，无法导出报表`);
            return;
        }

        const selectVal: OpenDialogReturnValue = await ipcRenderer.invoke('open-dialog', {
            title: '请选择目录',
            properties: ['openDirectory', 'createDirectory']
        });

        if (selectVal.filePaths && selectVal.filePaths.length > 0) {
            const [saveTarget] = selectVal.filePaths; //用户所选目标目录
            const casePath = join(eventData!.eventPath, eventData!.eventName);

            // console.log(casePath);
            // console.log(device?.phonePath);
            // console.log(saveTarget);

            const handle = Modal.info({
                title: '导出',
                content: '正在导出Excel报表，请稍等...',
                okText: '确定',
                centered: true,
                icon: <LoadingOutlined />,
                okButtonProps: { disabled: true }
            });

            const proc = execFile(join(exeDir, 'create_excel_report.exe'),
                [
                    casePath,
                    record!.phonePath!,
                    saveTarget,
                    '1'
                ],
                {
                    cwd: exeDir,
                    windowsHide: true
                });
            proc.once('error', () => {
                handle.update({
                    title: '导出',
                    content: `报表导出失败`,
                    okText: '确定',
                    centered: true,
                    icon: <CheckCircleOutlined />,
                    okButtonProps: { disabled: false }
                });
            });
            proc.once('exit', () => {
                handle.update({
                    onOk() {
                        openFileInBrowser(saveTarget);
                    },
                    title: '导出',
                    content: `报表导出成功`,
                    okText: '确定',
                    centered: true,
                    icon: <CheckCircleOutlined />,
                    okButtonProps: { disabled: false }
                });
                exportHandle();
            });
            proc.once('close', () => {
                handle.update({
                    onOk() {
                        openFileInBrowser(saveTarget);
                    },
                    title: '导出',
                    content: `报表导出成功`,
                    okText: '确定',
                    centered: true,
                    icon: <CheckCircleOutlined />,
                    okButtonProps: { disabled: false }
                });
                exportHandle();
            });
        }
    };

    return <Modal
        footer={[
            <Button onClick={onDirSelect}
                type="primary"
                key="HCM_0">
                <DownloadOutlined />
                <span>导出Excel报表</span>
            </Button>,
            <Button onClick={() => {
                closeHandle();
            }}
                key="HCM_1"
                type="default">
                <CloseCircleOutlined />
                <span>取消</span>
            </Button>
        ]}
        onCancel={() => {
            closeHandle();
        }}
        visible={visible}
        width={800}
        centered={true}
        destroyOnClose={true}
        maskClosable={false}
        forceRender={true}
        title={`命中统计（${data?.totalcount ?? 0}）`}>
        <div
            id="hit-dom"
            style={{
                width: '752px',
                height: '400px',
                display: data === undefined ? 'none' : 'block'
            }} />
        {
            data === undefined
                ? <EmptyBox><Empty description="暂无数据" image={Empty.PRESENTED_IMAGE_SIMPLE} /></EmptyBox>
                : null}
    </Modal>;
}

HitChartModal.defaultProps = {
    visible: false,
    exportHandle: () => { },
    closeHandle: () => { }
}

export default HitChartModal;