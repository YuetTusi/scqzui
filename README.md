## 终端取证 UI（市场版本）

### 运行前准备工作

-   安装 node 环境版本 v16.x 以上
-   安装 yarn

从版本库中拉下源码然后进入项目所在目录，使用 yarn 进行安装：

```bash
cd [你的项目目录]
yarn install
```

### 命令说明

| yarn 命令             | 说明                                |
| --------------------- | ----------------------------------- |
| `yarn run start`      | 运行项目                            |
| `yarn run build`      | 开发编译                            |
| `yarn run build:prod` | 生产编译                            |
| `yarn run dist`       | 发布项目（发布最终安装包和 zip 包） |

### 发布

发布前若 ui.yaml 配置文件有变动，则使用命令行进行加密。

使用 npm 安装命令行工具：

```bash
npm install -g azjm
```

然后进入项目的`src/config`目录，使用命令进行加密，加密算法使用默认`rc4`：

```bash
azjm
```

成功后会在`src/config`目录中生成`conf`文件。将新 conf 文件拷贝到发布应用的`resources\config`下即可。

ui.yaml 无变化不需要上述操作

#### Windows

在命令行使用 yarn 命令来发布：

```bash
yarn run dist
```

打包成功后即可在 dist 目录找到 zip 包及 Windows 安装包。

> 后续升级中，如果只改动了渲染进程代码（`renderer/default`和`renderer/protocol`），那么打包发布不需要全量更新，只需发布`app.asar.unpacked\dist\renderer`下的相关文件即可。

#### KylinLinux

在银河麒麟平台上首次发布前要安装 fpm

```bash
sudo apt update
sudo apt install ruby -y
sudo gem install fpm
export USE_SYSTEM_FPM=true
```

全局安装`node-pre-gyp`包：

```bash
sudo npm install node-pre-gyp -g
```

然后使用`yarn run dist`打包即可，如果出现拉取 electron 包错误，使用国内镜像源：

```bash
export ELECTRON_BUILDER_BINARIES_MIRROR=https://mirrors.huaweicloud.com/electron-builder-binaries
```

### 可能出现的错误

如果在使用 yarn 命令打包中报找不到 electron，是因为在墙国无法下载可翻墙解决，也可使用淘宝镜像，方法如下：

在[淘宝镜像](https://npm.taobao.org/mirrors/electron)页面中找到对应的 electron 版本，下载对应平台的 electron 包，解压到项目`node_modules/electron/dist`目录下。

之后在`node_modules/electron`目录中新建一个文本文件`path.txt`，写入：

```txt
electron.exe
```

并保存之后即可打包运行应用

第一次在使用`yarn run dist`发布时也有可能报找不到 electron.x.x.zip 包，方法也是先手动下载对应的版本，然后拷到：

```txt
C:\Users\[你的用户名]\AppData\Local\electron\Cache
```

再次执行`yarn run dist`命令，即可成功发布应用

如果还有其他问题，Google 大法好 ;-)

### ui.yaml 配置说明

| 参数            | 类型    | 说明                      |
| --------------- | ------- | ------------------------- |
| max             | number  | 采集路数（建议 1~20）     |
| useFetch        | boolean | 是否启用采集功能          |
| useServerCloud  | boolean | 是否启用云取证功能        |
| useBcp          | boolean | 是否启用 BCP 相关功能     |
| useToolBox      | boolean | 是否启用工具箱            |
| useFakeButton   | boolean | 是否启用工具箱演示按钮    |
| useAi           | boolean | 是否启用 AI 功能          |
| useQuickFetch   | boolean | 是否启用快速取证          |
| useLogin        | boolean | 是否启用登录              |
| useTraceLogin   | boolean | 是否启用云点验            |
| caseText        | string  | 案件文案                  |
| fetchText       | string  | 取证文案                  |
| devText         | string  | 设备文案                  |
| parseText       | string  | 解析文案                  |
| fetchButtonText | string  | 取证按钮文字              |
| cloudButtonText | string  | 云取证按钮文字            |
| cloudAppUrl     | string  | 云取应用查询接口地址      |
| cloudAppMd5     | string  | 云取应用 MD5 校验接口地址 |
| logo            | string  | 应用 LOGO 文件名          |
| windowHeight    | number  | 窗口默认高度              |
| windowWidth     | number  | 窗口默认宽度              |
| minHeight       | number  | 窗口最小高度              |
| minWidth        | number  | 窗口最小宽度              |
| center          | boolean | 窗口是否居中              |
| tcpPort         | number  | TCP 通讯端口              |
| httpPort        | number  | HTTP 端口                 |
| fetchPath       | string  | 采集程序路径              |
| fetchExe        | string  | 采集程序名称              |
| parsePath       | string  | 解析程序路径              |
| parseExe        | string  | 解析程序名称              |
| yqPath          | string  | 云取程序路径              |
| yqExe           | string  | 云取程序名称              |
| appQueryPath    | string  | 应用查询程序路径          |
| appQueryExe     | string  | 应用查询程序名称          |
| logFile         | string  | 程序 LOGO 路径            |
| devPageUrl      | string  | 开发页 URL                |
