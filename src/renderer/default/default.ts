import { ipcRenderer, IpcRendererEvent } from 'electron';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from "dayjs/plugin/localeData";
import weekday from 'dayjs/plugin/weekday';
import 'dayjs/locale/zh-cn';
import { createHashHistory as createHistory } from 'history';
import dva from 'dva';
import immer from 'dva-immer';
import messageBox from 'antd/lib/message';
import notification from 'antd/lib/notification';
// import 'antd/dist/antd.less';
import 'antd/dist/antd.dark.less';
// import 'antd/dist/antd.compact.less';
import log from '@/utils/log';
import { helper } from '@/utils/helper';
import server from '@/utils/tcp-server';
import { createRouter } from '@/router/default/create-router';
import appSetModel from '@/model/default/app-set';
import alartMessageModel from '@/model/default/alart-message';
import operateDoingModel from '@/model/default/operate-doing';
import receiveModel from '@/model/default/receive';
import deviceModel from '@/model/default/device';
import caseDataModel from '@/model/default/case-data';
import caseAddModel from '@/model/default/case-add';
import caseEditModel from '@/model/default/case-edit';
import checkInputModalModel from '@/model/default/check-input-modal';
import cloudCodeModalModel from '@/model/default/cloud-code-modal';
import officerModel from '@/model/default/officer';
import organizationModel from '@/model/default/organization';
import parseCaseModel from '@/model/default/parse-case';
import parseDevModel from '@/model/default/parse-dev';
import parsingListModel from '@/model/default/parsing-list';
import batchExportReportModalModel from '@/model/default/batch-export-report-modal';
import bcpHistoryModel from '@/model/default/bcp-history';
import exportBcpModalModel from '@/model/default/export-bcp-modal';
import fetchLogTableModel from '@/model/default/fetch-log-table';
import parseLogTableModel from '@/model/default/parse-log-table';
import cloudLogTableModel from '@/model/default/cloud-log-table';
import cloudLogModalModel from '@/model/default/cloud-log-modal';
import checkManageTableModel from '@/model/default/check-manage-table';
import traceLoginModel from '@/model/default/trace-login';
import trailModel from '@/model/default/trail';
import importDataModalModel from '@/model/default/import-data-modal';
import crackModalModel from '@/model/default/crack-modal';
import quickEventListModel from '@/model/default/quick-event-list';
import quickRecordListModel from '@/model/default/quick-record-list';
import editQuickEventModalModel from '@/model/default/edit-quick-event-modal';
import 'jquery';
import '@ztree/ztree_v3/js/jquery.ztree.all.min';
import '@ztree/ztree_v3/css/zTreeStyle/zTreeStyle.css';
dayjs.locale('zh-cn');
dayjs.extend(customParseFormat);
dayjs.extend(localeData);
dayjs.extend(weekday);
dayjs.localeData();

const { tcpPort } = helper.readConf()!;
const app = dva({ history: createHistory() });

(async () => {
    let port = tcpPort;
    try {
        port = await helper.portStat(tcpPort);
        await ipcRenderer.invoke('write-net-json', port);
    } catch (error) {
        port = tcpPort;
    } finally {
        server.listen(port, () => {
            console.log(`TCP服务已启动在端口${port}`);
            ipcRenderer.send('run-service');
        });
    }
})();

ipcRenderer.on('show-notification', (event: IpcRendererEvent, info: any) => {
    //显示notification消息
    let { message, description, type = 'info' } = info;
    switch (type) {
        case 'info':
            notification.info({
                message,
                description
            });
            break;
        case 'error':
            notification.error({
                message,
                description
            });
            break;
        case 'success':
            notification.success({
                message,
                description
            });
            break;
        default:
            notification.info({
                message,
                description
            });
            break;
    }
});

app.use(immer());
app.use({
    // onAction: reduxLogger, //若想查看仓库日志，打开此注释
    onError({ message, stack }: Error) {
        messageBox.destroy();
        messageBox.error(message);
        log.error({ message: `全局异常 @src/index.tsx ${stack}` });
        console.log(`全局异常 @src/index.tsx:${message}`);
    }
});
app.model(appSetModel);
app.model(alartMessageModel);
app.model(operateDoingModel);
app.model(receiveModel);
app.model(deviceModel);
app.model(caseDataModel);
app.model(caseAddModel);
app.model(caseEditModel);
app.model(checkInputModalModel);
app.model(cloudCodeModalModel);
app.model(officerModel);
app.model(organizationModel);
app.model(parseCaseModel);
app.model(parseDevModel);
app.model(parsingListModel);
app.model(batchExportReportModalModel);
app.model(bcpHistoryModel);
app.model(exportBcpModalModel);
app.model(fetchLogTableModel);
app.model(parseLogTableModel);
app.model(cloudLogTableModel);
app.model(cloudLogModalModel);
app.model(checkManageTableModel);
app.model(traceLoginModel);
app.model(trailModel);
app.model(importDataModalModel);
app.model(crackModalModel);
app.model(quickEventListModel);
app.model(quickRecordListModel);
app.model(editQuickEventModalModel);
app.router(createRouter);
app.start('#root');
