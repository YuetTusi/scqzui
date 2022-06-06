import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/zh-cn';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { helper } from '@/utils/helper';

dayjs.extend(customParseFormat);

const { max } = helper.readConf()!;
const list: string[] = [];
const timerMap = new Map();

for (let i = 0; i < max; i++) {
    list.push('00:00:00');
}

ipcRenderer.on('time', (event: IpcRendererEvent, usb: number, isStart: boolean) => {
    if (isStart) {
        if (timerMap.get(`timer_${usb}`) === undefined) {
            timerMap.set(
                `timer_${usb}`,
                setInterval(() => {
                    let next = dayjs(list[usb], 'HH:mm:ss', 'zh-cn').add(1, 's').format('HH:mm:ss');
                    list[usb] = next;
                    ipcRenderer.send('receive-time', usb, list[usb]);
                }, 986)
            );
        }
    } else {
        clearInterval(timerMap.get(`timer_${usb}`));
        timerMap.delete(`timer_${usb}`);
        list[usb] = '00:00:00';
        //发送消息还原Clock时间
        ipcRenderer.send('receive-time', usb, '00:00:00');
    }

    console.log(list);
});
