import { ipcRenderer } from 'electron';
import { FetchData } from '@/schema/fetch-data';

let wait: number = 3;
let timer: NodeJS.Timer | null = null;
let fetchDataReceive: FetchData | null = null;

var $btnAgree = document.getElementById('btnAgree');
var $btnDisagree = document.getElementById('btnDisagree');

ipcRenderer.on('show-protocol', (event, fetchData: FetchData) => {
    fetchDataReceive = fetchData;
});

(function (wait) {
    timer = setInterval(() => {
        if ($btnAgree !== null) {
            if (wait === 1) {
                $btnAgree.removeAttribute('disabled');
                $btnAgree.innerHTML = '已阅读且同意';
                clearInterval(timer!);
                timer = null;
            } else {
                wait--;
                $btnAgree.innerHTML = `已阅读且同意 (${wait})`;
            }
        }
    }, 1000);
})(wait);

if ($btnAgree !== null) {
    $btnAgree.addEventListener('click', (e) => {
        ipcRenderer.send('protocol-read', fetchDataReceive, true);
        fetchDataReceive = null;
    });

}
if ($btnDisagree !== null) {
    $btnDisagree.addEventListener('click', (e) => {
        ipcRenderer.send('protocol-read', fetchDataReceive, false);
        fetchDataReceive = null;
    });
}


