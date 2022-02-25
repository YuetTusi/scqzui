import { ipcRenderer } from 'electron';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { createHashHistory as createHistory } from 'history';
import dva from 'dva';
import immer from 'dva-immer';
import messageBox from 'antd/lib/message';
// import 'antd/dist/antd.less';
import 'antd/dist/antd.dark.less';
// import 'antd/dist/antd.compact.less';
import log from '@/utils/log';
import { helper } from '@/utils/helper';
import server from '@/utils/tcp-server';
import { createRouter } from '@/router/default/create-router';
import receiveModel from '@/model/default/receive';
import deviceModel from '@/model/default/device';
import normalInputModalModel from '@/model/default/normal-input-modal';
import 'jquery';
import '@ztree/ztree_v3/js/jquery.ztree.all.min';
import '@ztree/ztree_v3/css/zTreeStyle/zTreeStyle.css';
// import '../../styled/ztree-overwrite.less';
dayjs.locale('zh-cn');

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
app.model(receiveModel);
app.model(deviceModel);
app.model(normalInputModalModel);
app.router(createRouter);
app.start('#root');
