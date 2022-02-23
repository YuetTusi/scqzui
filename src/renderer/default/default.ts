import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { createHashHistory as createHistory } from 'history';
import dva from 'dva';
import immer from 'dva-immer';
// import 'antd/dist/antd.less';
import 'antd/dist/antd.dark.less';
// import 'antd/dist/antd.compact.less';
import { createRouter } from '@/router/default/create-router';

const port = 65000;

dayjs.locale('zh-cn');

const app = dva({ history: createHistory() });

app.use(immer());
app.router(createRouter);
app.start('#root');
