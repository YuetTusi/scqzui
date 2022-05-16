import { join } from 'path';
import { mkdir, readdir, unlink } from 'fs';
import debounce from 'lodash/debounce';
import classnames from 'classnames';
import { ipcRenderer, OpenDialogReturnValue, shell } from 'electron';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';
import React, { FC, useEffect, useState, MouseEvent } from 'react';
import ImportOutlined from '@ant-design/icons/ImportOutlined';
import FolderOpenOutlined from '@ant-design/icons/FolderOpenOutlined';
import SaveOutlined from '@ant-design/icons/SaveOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import Button from 'antd/lib/button';
import Empty from 'antd/lib/empty';
import Switch from 'antd/lib/switch';
import message from 'antd/lib/message';
import Modal from 'antd/lib/modal';
import { useAppConfig } from '@/hook';
import { AppJson } from '@/schema/app-json';
import { Split } from '@/component/style-tool';
import { SortPanel } from '@/component/style-tool/split';
import { helper } from '@/utils/helper';
import { MainBox } from '../styled/sub-layout';
import { ExcelList, FormBox } from './styled/style';
import { KeywordsProp } from './prop';


const cwd = process.cwd();
const { Group } = Button;

let saveFolder = cwd;
let defaultWordsPath = cwd; //部队关键词模版目录
if (process.env['NODE_ENV'] === 'development') {
    saveFolder = join(cwd, 'data/keywords');
    defaultWordsPath = join(cwd, 'data/army');
} else {
    saveFolder = join(cwd, 'resources/keywords');
    defaultWordsPath = join(cwd, 'resources/army');
}

const Keywords: FC<KeywordsProp> = () => {

    const [isUseKeyword, setIsUseKeyword] = useState<boolean>(false); //开启关键词验证
    const [isUseDocVerify, setIsUseDocVerify] = useState<boolean>(false); //开启文档验证
    const [fileList, setFileList] = useState<string[]>([]);
    const appConfig = useAppConfig();

    useEffect(() => {
        setIsUseKeyword(appConfig?.useKeyword ?? false);
        setIsUseDocVerify(appConfig?.useDocVerify ?? false);
    }, [appConfig]);

    useEffect(() => {
        (async () => {
            let exist = await helper.existFile(saveFolder);
            if (!exist) {
                mkdir(saveFolder, (err) => {
                    if (!err) {
                        loadFileList();
                    }
                });
            } else {
                loadFileList();
            }
        })();
    }, []);

    /**
     * 打开文件
     */
    const openFileHandle = debounce(
        (file: string) => {
            let openPath = join(saveFolder, file);
            shell.openPath(openPath);
        },
        500,
        { leading: true, trailing: false }
    );

    /**
     * 选择模版文件
     */
    const selectFileHandle = debounce(
        (defaultPath?: string) => {
            ipcRenderer
                .invoke('open-dialog', {
                    defaultPath,
                    title: '选择Excel文件',
                    properties: ['openFile', 'multiSelections'],
                    filters: [{ name: 'Office Excel文档', extensions: ['xlsx'] }]
                })
                .then((val: OpenDialogReturnValue) => {
                    if (val.filePaths.length > 0) {
                        copyExcels(val.filePaths);
                    }
                });
        },
        500,
        { leading: true, trailing: false }
    );

    /**
     * 打开关键词目录
     */
    const openFolder = debounce(
        () => {
            let saveFolder = cwd;
            if (process.env['NODE_ENV'] === 'development') {
                saveFolder = join(cwd, 'data/keywords');
            } else {
                saveFolder = join(cwd, 'resources/keywords');
            }
            shell.openPath(saveFolder);
        },
        500,
        { leading: true, trailing: false }
    );

    /**
     * 删除文件handle
     */
    const delFileHandle = (file: string) => {
        Modal.confirm({
            title: '删除',
            content: `确认删除「${file}」？`,
            okText: '是',
            cancelText: '否',
            centered: true,
            onOk() {
                let rmPath = join(saveFolder, file);
                unlink(rmPath, (err) => {
                    if (err) {
                        console.log(rmPath);
                        console.log(err);
                        message.destroy();
                        message.error('删除失败');
                    } else {
                        message.destroy();
                        message.success('删除成功');
                        loadFileList();
                    }
                });
            }
        });
    };

    /**
     * 拷贝Excel文件
     */
    const copyExcels = (sources: string[]) => {
        helper.copyFiles(sources, saveFolder).then((data) => {
            message.success('导入成功');
            loadFileList();
        });
    };

    /**
     * 保存Click
     */
    const onSaveClick = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const next: AppJson = {
            ...appConfig!,
            useKeyword: isUseKeyword,
            useDocVerify: isUseDocVerify,
        };
        message.destroy();
        try {
            const success = await helper.writeAppJson(next);
            if (success) {
                message.success('保存成功');
            } else {
                message.error('保存失败');
            }
        } catch (error) {
            console.warn(error);
            message.error('保存失败');
        }
    };

    /**
     * 读取文件列表
     */
    const loadFileList = () => {
        readdir(saveFolder, { encoding: 'utf8' }, (err, data) => {
            if (!err) {
                const next = data.filter((i) => !/.+\$.+/.test(join(saveFolder, i)));
                setFileList(next);
            }
        });
    };

    const renderFileList = () => {
        if (fileList.length === 0) {
            return (
                <Empty
                    description="暂无关键词配置"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            );
        } else {
            return fileList.map((file, index) => (
                <li key={`F_${index}`}>
                    <a
                        onClick={() => openFileHandle(file)}>
                        <FontAwesomeIcon icon={faFileExcel} />
                        <span>{file}</span>
                    </a>
                    <div>
                        <Group>
                            <Button
                                onClick={() => openFileHandle(file)}
                                size="small"
                                type="default">
                                <FolderOpenOutlined />
                                <span>打开</span>
                            </Button>
                            <Button
                                onClick={() => delFileHandle(file)}
                                size="small"
                                type="default">
                                <DeleteOutlined />
                                <span>删除</span>
                            </Button>
                        </Group>
                    </div>
                </li>
            ));
        }
    };

    return <MainBox>
        <FormBox>
            <ul>
                <li>
                    <label>关键词验证：</label>
                    <Switch
                        onChange={(checked: boolean) => setIsUseKeyword(checked)}
                        checked={isUseKeyword}
                        size="small" />
                </li>
                <li>
                    <label>文档验证：</label>
                    <Switch
                        onChange={(checked: boolean) => setIsUseDocVerify(checked)}
                        checked={isUseDocVerify}
                        size="small" />
                </li>
                <li>
                    <Button
                        onClick={onSaveClick}
                        type="primary">
                        <SaveOutlined />
                        <span>保存</span>
                    </Button>
                </li>
            </ul>
            <div>
                <Group>
                    <Button
                        onClick={() => selectFileHandle(cwd)}
                        type="primary">
                        <ImportOutlined />
                        <span>导入数据</span>
                    </Button>
                    <Button
                        onClick={() => selectFileHandle(defaultWordsPath)}
                        type="primary">
                        <ImportOutlined />
                        <span>导入模版</span>
                    </Button>
                    <Button
                        onClick={() => openFolder()}
                        type="primary">
                        <FolderOpenOutlined />
                        <span>打开位置</span>
                    </Button>
                </Group>
            </div>
        </FormBox>
        <Split />
        <SortPanel>
            <div className="caption">
                关键词文档列表
            </div>
            <div className="content">
                <ExcelList className={classnames({ nothing: fileList.length === 0 })}>
                    <ul>{renderFileList()}</ul>
                </ExcelList>
            </div>
        </SortPanel>
    </MainBox>
};

export default Keywords;