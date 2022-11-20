import React, { FC, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faFileZipper } from '@fortawesome/free-solid-svg-icons';
import { faAndroid } from '@fortawesome/free-brands-svg-icons';
import Popover from 'antd/lib/popover';
import Auth from '@/component/auth';
import { Split } from '@/component/style-tool';
import { helper } from '@/utils/helper';
import { SortBox } from '../styled/style';
import ButtonDesc from '../button-desc';
import signalSvg from '../styled/images/signal.svg';
import zipPng from '../styled/images/zip.png';
import tarPng from '../styled/images/tar.png';

const { useFakeButton } = helper.readConf()!;

const ImportBak: FC<{ onClick: () => void }> = memo(
    ({ onClick }) => <Auth deny={!useFakeButton}>
        <SortBox>
            <div className="caption">导入苹果检材</div>
            <Split />
            <div className="t-row">
                <Popover
                    title="苹果文件夹"
                    placement="topRight"
                    content={<ButtonDesc>
                        <ul>
                            <li>描述：包含从苹果手机提取的任何形式的文件夹，（比如从苹果手机上提取的包含微信数据的文件夹）</li>
                            <li>导入方式：路径选择到具体苹果应用文件夹的上一层目录</li>
                        </ul>
                        <em>（如需解析 com.tencent.xin 文件夹，路径选择到 com.tencent.xin 的上一层目录）</em>
                    </ButtonDesc>}>
                    <div className="t-button" onClick={onClick}>
                        <div className="ico">
                            <FontAwesomeIcon icon={faFolder} color="#ffd766" />
                        </div>
                        <div className="name">
                            苹果文件夹
                        </div>
                    </div>
                </Popover>
                <Popover
                    title="iTunes备份"
                    placement="topRight"
                    content={<ButtonDesc>
                        <ul>
                            <li>描述：通过 iTunes 备份对苹果手机进行备份产生的文件夹</li>
                            <li>导入方式：路径选择到 backup 下一层目录，该文件夹默认路径为 C:\Users\[账户名]\AppData\Roaming\Apple Computer\MobileSync\Backup\目录</li>
                        </ul>
                    </ButtonDesc>}>
                    <div className="t-button" onClick={onClick}>
                        <div className="ico">
                            <FontAwesomeIcon icon={faFolder} color="#ffd766" />
                        </div>
                        <div className="name">
                            iTunes备份
                        </div>
                    </div>
                </Popover>
                <Popover
                    title="苹果tar文件"
                    placement="topRight"
                    content={
                        <ButtonDesc>
                            <ul>
                                <li>描述：取证软件对苹果手机文件系统提取的 tar 包</li>
                                <li>导入方式：路径选择到 tar 文件</li>
                            </ul>
                        </ButtonDesc>
                    }>
                    <div className="t-button" onClick={onClick}>
                        <div className="ico">
                            <img src={tarPng} alt="tar" width={50} height={50} />
                        </div>
                        <div className="name">
                            苹果tar文件
                        </div>
                    </div>
                </Popover>
                <Popover
                    title="苹果zip文件"
                    placement="topRight"
                    content={
                        <ButtonDesc>
                            <ul>
                                <li>描述：苹果手机提取的任意文件夹进行不带压缩率制作的 zip 包</li>
                                <li>导入方式：路径选择到 zip 文件</li>
                            </ul>
                        </ButtonDesc>
                    }>
                    <div className="t-button" onClick={onClick}>
                        <div className="ico">
                            <img src={zipPng} alt="tar" width={50} height={50} />
                        </div>
                        <div className="name">
                            苹果zip文件
                        </div>
                    </div>
                </Popover>
            </div>
        </SortBox>
        <SortBox>
            <div className="caption">导入安卓检材</div>
            <Split />
            <div className="t-row">
                <Popover
                    title="安卓物理镜像(dd)"
                    placement="topRight"
                    content={
                        <ButtonDesc>
                            <ul>
                                <li>描述：支持 bin，e01，tar，extx，gpt，exfat，fat，vmdk，ntsf，f2fs，zip 格式的物理镜像，文件后缀名体现为*.dd，*.img 等</li>
                                <li>导入方式：路径选择到 zip 文件</li>
                            </ul>
                        </ButtonDesc>
                    }>
                    <div className="t-button" onClick={onClick}>
                        <div className="ico">
                            <FontAwesomeIcon icon={faAndroid} color="#a6ce3a" />
                        </div>
                        <div className="name">
                            安卓物理镜像(dd)
                        </div>
                    </div>
                </Popover>
                <Popover
                    title="YunOS备份(目录)"
                    placement="topRight"
                    content={
                        <ButtonDesc>
                            <ul>
                                <li>描述：阿里 YunOS 手机操作系统备份出的文件，包含以*.backup, *.backup1, *.backup*命名的文件夹</li>
                                <li>导入方式：路径选择到*.backup, *.backup1, *.backup*命名的文件夹</li>
                            </ul>
                        </ButtonDesc>
                    }>
                    <div className="t-button" onClick={onClick}>
                        <div className="ico">
                            <FontAwesomeIcon icon={faFolder} color="#ffd766" />
                        </div>
                        <div className="name">
                            YunOS备份(目录)
                        </div>
                    </div>
                </Popover>
                <Popover
                    title="小米自备份"
                    placement="topRight"
                    content={
                        <ButtonDesc>
                            <ul>
                                <li>描述：小米手机内置备份 App 产生的备份文件</li>
                                <li>导入方式：路径选择到自备份文件的时间戳目录（如:\20200324_150327）</li>
                            </ul>
                        </ButtonDesc>
                    }>
                    <div className="t-button" onClick={onClick}>
                        <div className="ico">
                            <FontAwesomeIcon icon={faFolder} color="#ffd766" />
                        </div>
                        <div className="name">
                            小米自备份
                        </div>
                    </div>
                </Popover>
                <Popover
                    title="VIVO自备份"
                    placement="topRight"
                    content={
                        <ButtonDesc>
                            <ul>
                                <li>描述：支持 vivo 互传文件的解析</li>
                                <li>导入方式：路径选择到时间戳目录（如：\vivoX23\18601759531-1575426505445）</li>
                            </ul>
                        </ButtonDesc>
                    }>
                    <div className="t-button" onClick={onClick}>
                        <div className="ico">
                            <FontAwesomeIcon icon={faFolder} color="#ffd766" />
                        </div>
                        <div className="name">
                            VIVO自备份
                        </div>
                    </div>
                </Popover>
                <Popover
                    title="OPPO自备份"
                    placement="topRight"
                    content={
                        <ButtonDesc>
                            <ul>
                                <li>描述：OPPO 手机内置的备份 APP 产生的备份文件，通常以文件夹的形式存放的</li>
                                <li>导入方式：路径选择到自备份文件的 Backup 目录（如：\Backup）</li>
                            </ul>
                        </ButtonDesc>
                    }>
                    <div className="t-button" onClick={onClick}>
                        <div className="ico">
                            <FontAwesomeIcon icon={faFolder} color="#ffd766" />
                        </div>
                        <div className="name">
                            OPPO自备份
                        </div>
                    </div>
                </Popover>
                <Popover
                    title="魅族自备份(目录)"
                    placement="topRight"
                    content={
                        <ButtonDesc>
                            <ul>
                                <li>描述：魅族手机内置的备份 APP 产生的备份文件夹</li>
                                <li>导入方式：路径选择到检材目录下的时间戳命名的文件夹</li>
                            </ul>
                        </ButtonDesc>
                    }>
                    <div className="t-button" onClick={onClick}>
                        <div className="ico">
                            <FontAwesomeIcon icon={faFolder} color="#ffd766" />
                        </div>
                        <div className="name">
                            魅族自备份(目录)
                        </div>
                    </div>
                </Popover>
                <Popover
                    title="魅族自备份(zip)"
                    placement="topRight"
                    content={
                        <ButtonDesc>
                            <ul>
                                <li>描述：魅族手机内置的备份 APP 产生的备份 zip 包</li>
                                <li>导入方式：路径选择到检材目录下的时间戳命名的 zip 包</li>
                            </ul>
                        </ButtonDesc>
                    }>
                    <div className="t-button" onClick={onClick}>
                        <div className="ico">
                            <img src={zipPng} alt="tar" width={50} height={50} />
                        </div>
                        <div className="name">
                            魅族自备份(zip)
                        </div>
                    </div>
                </Popover>
                <Popover
                    title="ADB备份文件"
                    placement="topRight"
                    content={
                        <ButtonDesc>
                            <ul>
                                <li>描述：通过 ADB 命令，对安卓手机进行备份生成的备份包。此为安卓手机通用的备份格式，几乎支持所有安卓手机</li>
                                <li>导入方式：路径选择到.ab 文件</li>
                            </ul>
                        </ButtonDesc>
                    }>
                    <div className="t-button" onClick={onClick}>
                        <div className="ico">
                            <img src={tarPng} alt="tar" width={50} height={50} />
                        </div>
                        <div className="name">
                            ADB备份文件
                        </div>
                    </div>
                </Popover>
                <Popover
                    title="安卓文件夹"
                    placement="topRight"
                    content={
                        <ButtonDesc>
                            <ul>
                                <li>描述：支持从安卓手机提取的任何文件的文件夹，如从安卓手机提取的包含微信数据的文件夹</li>
                                <li>导入方式：选择安卓文件夹，路径选择到具体安卓应用文件夹的上一层目录</li>
                            </ul>
                            <em>（如需解析 com.tencent.mm 文件夹，路径选择到 com.tencent.mm 的上一层目录）</em>
                        </ButtonDesc>
                    }>
                    <div className="t-button" onClick={onClick}>
                        <div className="ico">
                            <FontAwesomeIcon icon={faFolder} color="#ffd766" />
                        </div>
                        <div className="name">
                            安卓文件夹
                        </div>
                    </div>
                </Popover>
                <Popover
                    title="华为备份文件夹"
                    placement="topRight"
                    content={
                        <ButtonDesc>
                            <ul>
                                <li>描述：支持从安卓手机提取的任何文件夹，如从安卓手机提取的包含微信数据的文件夹</li>
                                <li>导入方式：选择安卓文件夹，路径选择到具体安卓应用文件夹的上一层目录</li>
                            </ul>
                            <em>（如需解析 com.tencent.mm 文件夹，路径选择到 com.tencent.mm 的上一层目录）</em>
                        </ButtonDesc>
                    }>
                    <div className="t-button" onClick={onClick}>
                        <div className="ico">
                            <FontAwesomeIcon icon={faFolder} color="#ffd766" />
                        </div>
                        <div className="name">
                            华为备份文件夹
                        </div>
                    </div>
                </Popover>
                <Popover
                    title="Signal备份文件"
                    placement="topRight"
                    content={
                        <ButtonDesc>
                            <ul>
                                <li>描述：利用 signal 软件自身的备份</li>
                                <li>导入方式：路径选择时间戳目录</li>
                            </ul>
                        </ButtonDesc>
                    }>
                    <div className="t-button" onClick={onClick}>
                        <div className="ico">
                            <img src={signalSvg} alt="signal" width={50} height={50} />
                        </div>
                        <div className="name">
                            Signal备份文件
                        </div>
                    </div>
                </Popover>
                <Popover
                    title="Signal备份文件(zip)"
                    placement="topRight"
                    content={
                        <ButtonDesc>
                            <ul>
                                <li>描述：利用 signal 软件自身的备份</li>
                                <li>导入方式：路径选择到时间戳目录</li>
                            </ul>
                        </ButtonDesc>
                    }>
                    <div className="t-button" onClick={onClick}>
                        <div className="ico">
                            <img src={zipPng} alt="tar" width={50} height={50} />
                        </div>
                        <div className="name">
                            Signal备份文件(zip)
                        </div>
                    </div>
                </Popover>
                <Popover
                    title="安卓tar文件"
                    placement="topRight"
                    content={
                        <ButtonDesc>
                            <ul>
                                <li>描述：支持安卓手机全盘提取的 tar 包，或者是第三方取证软件对安卓手机文件系统提取的 tar 包</li>
                                <li>导入方式：选择到 tar 包文件</li>
                            </ul>
                        </ButtonDesc>
                    }>
                    <div className="t-button" onClick={onClick}>
                        <div className="ico">
                            <img src={tarPng} alt="tar" width={50} height={50} />
                        </div>
                        <div className="name">
                            安卓tar文件
                        </div>
                    </div>
                </Popover>
                <Popover
                    title="安卓zip文件"
                    placement="topRight"
                    content={
                        <ButtonDesc>
                            <ul>
                                <li>描述：支持安卓手机全盘提取的 zip 包，或者是第三方取证软件安卓手机文件系统提取的 zip 包</li>
                                <li>导入方式：选择到 zip 包文件</li>
                            </ul>
                        </ButtonDesc>
                    }>
                    <div className="t-button" onClick={onClick}>
                        <div className="ico">
                            <img src={zipPng} alt="tar" width={50} height={50} />
                        </div>
                        <div className="name">
                            安卓zip文件
                        </div>
                    </div>
                </Popover>
                <div className="t-button" onClick={onClick}>
                    <div className="ico">
                        <img src={zipPng} alt="tar" width={50} height={50} />
                    </div>
                    <div className="name">
                        SIM卡zip文件
                    </div>
                </div>
            </div>
        </SortBox>
    </Auth>
);

export { ImportBak };