import { ipcRenderer, IpcRendererEvent } from 'electron';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
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
import receiveModel from '@/model/default/receive';
import deviceModel from '@/model/default/device';
import caseDataModel from '@/model/default/case-data';
import 'jquery';
import '@ztree/ztree_v3/js/jquery.ztree.all.min';
import '@ztree/ztree_v3/css/zTreeStyle/zTreeStyle.css';
dayjs.locale('zh-cn');
dayjs.extend(customParseFormat);

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
app.model(receiveModel);
app.model(deviceModel);
app.model(caseDataModel);
app.router(createRouter);
app.start('#root');
