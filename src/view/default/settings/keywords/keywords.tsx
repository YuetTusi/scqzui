import { join } from 'path';
import { mkdir, unlink } from 'fs';
import { readdir } from 'fs/promises';
import debounce from 'lodash/debounce';
import classnames from 'classnames';
import { ipcRenderer, OpenDialogReturnValue, shell } from 'electron';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';
import React, { FC, useEffect, useState, MouseEvent } from 'react';
import EditOutlined from '@ant-design/icons/EditOutlined';
import ImportOutlined from '@ant-design/icons/ImportOutlined';
import PlusCircleOutlined from '@ant-design/icons/PlusCircleOutlined';
import SaveOutlined from '@ant-design/icons/SaveOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import Button from 'antd/lib/button';
import Empty from 'antd/lib/empty';
import Switch from 'antd/lib/switch';
import message from 'antd/lib/message';
import Modal from 'antd/lib/modal';
import { useAppConfig } from '@/hook';
import { helper } from '@/utils/helper';
import { AppJson } from '@/schema/app-json';
import { Split } from '@/component/style-tool';
import { SortPanel } from '@/component/style-tool/split';
import NewCategoryModal from './new-category-modal';
import { MainBox } from '../styled/sub-layout';
import { ExcelList, FormBox } from './styled/style';
import { KeywordsProp } from './prop';


const cwd = process.cwd();
const { Group } = Button;

let armyFolder = cwd;
let saveFolder = cwd;
if (process.env['NODE_ENV'] === 'development') {
    armyFolder = join(cwd, 'data/army');
    saveFolder = join(cwd, 'data/keywords');
} else {
    armyFolder = join(cwd, 'resources/army');
    saveFolder = join(cwd, 'resources/keywords');
}

/**
 * 关键词碰撞设置
 * # 默认模版目录中内置了一些关键词Excel
 * # 用户若想新加关键词可新键分类，并开启验证开关
 */
const Keywords: FC<KeywordsProp> = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [isDefault, setIsDefault] = useState<boolean>(true);//开启默认模版
    const [isUseKeyword, setIsUseKeyword] = useState<boolean>(false); //开启关键词验证
    const [isUseDocVerify, setIsUseDocVerify] = useState<boolean>(false); //开启文档验证
    const [addCategoryModalVisible, setAddCategoryModalVisible] = useState<boolean>(false);
    const [fileList, setFileList] = useState<string[]>([]);
    const appConfig = useAppConfig();

    useEffect(() => {
        setIsDefault(appConfig?.useDefaultTemp ?? true);
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
    // const openFolder = debounce(
    //     () => {
    //         let saveFolder = cwd;
    //         if (process.env['NODE_ENV'] === 'development') {
    //             saveFolder = join(cwd, 'data/keywords');
    //         } else {
    //             saveFolder = join(cwd, 'resources/keywords');
    //         }
    //         shell.openPath(saveFolder);
    //     },
    //     500,
    //     { leading: true, trailing: false }
    // );

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
     * 读取关键词文件列表
     * @returns {string[]} 返回目录下所有的文件
     */
    const readKeywordsList = async () => {
        try {
            const files = await readdir(saveFolder, { encoding: 'utf8' });
            return files;
        } catch (error) {
            throw error;
        }
    };

    /**
     * 读取文件列表
     */
    const loadFileList = async () => {
        try {
            const data = await readKeywordsList();
            const next = data.filter((i) => !/.+\$.+/.test(join(saveFolder, i)));
            setFileList(next);
        } catch (error) {
            setFileList([]);
        }
    };

    /**
     * 保存Click
     */
    const onSaveClick = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const next: AppJson = {
            ...appConfig!,
            useDefaultTemp: isDefault,
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
     * 从army目录中拷贝模版文件并重命名
     * @param newName 新名称（用户输入的分类名）
     */
    const renameTemplate = async (newName: string) => {
        try {
            await helper.copyFiles(join(armyFolder, 'template.xlsx'), saveFolder, {
                rename: () => `${newName}.xlsx`
            })
        } catch (error) {
            throw error;
        }
    };

    /**
     * 保存分类excel
     * @param name 分类名称
     */
    const saveCategoryHandle = async (name: string) => {
        setLoading(true);
        try {
            message.destroy();
            const hasTemp = await helper.existFile(join(armyFolder, 'template.xlsx'));
            if (!hasTemp) {
                message.warn('无模版文件');
                return;
            }
            const list = await readKeywordsList();
            const exist = list.some(item => item === `${name}.xlsx`);
            if (exist) {
                message.warn(`「${name}」分类已存在`);
            } else {
                // await writeExcel(join(saveFolder, `${name}.xlsx`));
                await renameTemplate(name);
                await loadFileList();
                shell.openPath(join(saveFolder, `${name}.xlsx`));
                message.success('分类保存成功，请在Excel文档中添加关键词');

                setAddCategoryModalVisible(false);
            }
        } catch (error) {
            console.warn(error);
        } finally {
            setLoading(false);
        }
    };

    const renderFileList = () => {
        if (fileList.length === 0) {
            return <Empty
                description="暂无关键词配置"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
            />;
        } else {
            return fileList.map((file, index) => <li key={`F_${index}`}>
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
                            <EditOutlined />
                            <span>编辑</span>
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
            </li>);
        }
    };

    return <MainBox>
        <FormBox>
            <ul>
                <li>
                    <label>使用默认模版：</label>
                    <Switch
                        checked={isDefault}
                        onChange={() => {
                            setIsDefault((prev) => !prev);
                        }}
                        size="small"
                    />
                </li>
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
                        onClick={() => setAddCategoryModalVisible(true)}
                        type="primary">
                        <PlusCircleOutlined />
                        <span>新建分类</span>
                    </Button>
                    <Button
                        onClick={() => selectFileHandle(cwd)}
                        type="primary">
                        <ImportOutlined />
                        <span>导入关键词</span>
                    </Button>
                </Group>
            </div>
        </FormBox>
        <Split />
        <SortPanel style={{
            position: 'absolute',
            top: '62px',
            left: '9px',
            right: '9px',
            bottom: '9px',
            backgroundColor: '#141414'
        }}>
            <div className="caption">
                关键词文档列表
            </div>
            <div className="content">
                <ExcelList className={classnames({ nothing: fileList.length === 0 })}>
                    <ul>{renderFileList()}</ul>
                </ExcelList>
            </div>
        </SortPanel>
        <NewCategoryModal
            visible={addCategoryModalVisible}
            loading={loading}
            saveHandle={saveCategoryHandle}
            cancelHandle={() => setAddCategoryModalVisible(false)}
        />
    </MainBox>
};

export default Keywords;