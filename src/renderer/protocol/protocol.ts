import dva from 'dva';
import { createHashHistory as createHistory } from 'history';
import { createRouter } from '@/router/protocol';
import 'antd/dist/antd.dark.less';

const app = dva({
    history: createHistory(),
    namespacePrefixWarning: false
});

app.router(createRouter);
app.start('#root');