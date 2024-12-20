## Socket 通信文档

目前前后台通讯通过 Socket 来完成，参数使用 JSON 格式。

### Socket 分类

Socket 分类使用枚举区分：

| 类别     | 名称  | 说明                   |
| -------- | ----- | ---------------------- |
| 采集     | fetch | 采集程序的 Socket 名称 |
| 解析     | parse | 解析程序的 Socket 名称 |
| 痕迹查询 | trace | 痕迹查询 Socket 名称   |

所有 Socket 通讯有 3 个固定参数不可缺少，举例：

```json
{
	"type": "fetch",
	"cmd": "connect",
	"msg": "success"
}
```

> 其中`type`表示 Socket 分类，`cmd`表示当前命令，`msg`为命令参数。
> 如果参数为空，使用空字符串代替 null 或 undefined

### 采集通信命令说明

#### 采集程序连入

Fetch 命令：`connect`，无参数。

UI 反馈命令`connect_ok`，参数：

| 参数名 | 类型   | 说明         |
| ------ | ------ | ------------ |
| count  | number | 当前采集路数 |

举例：

```json
{
	"type": "fetch",
	"cmd": "connect_ok",
	"msg": { "count": 8 }
}
```

#### 用户警告

Fetch 命令: `user_alert`

无参数

#### 设备连入

Fetch 命令: `device_in`

Fetch 参数：

| 参数名       | 类型                              | 说明                                   |
| ------------ | --------------------------------- | -------------------------------------- |
| manufacturer | string                            | 手机制造商                             |
| model        | string                            | 型号                                   |
| usb          | number                            | USB 序号                               |
| system       | string                            | 系统                                   |
| fetchState   | enum                              | 采集状态枚举                           |
| serial       | string                            | 设备序列号(点验模式用此字段做唯一区分) |
| osName       | string                            | 操作系统名称                           |
| phoneInfo    | Array<{name:string,value:string}> | 手机相关信息                           |

举例：

```json
{
	"type": "fetch",
	"cmd": "device_in",
	"msg": {
		"manufacturer": "oneplus",
		"model": "T7",
		"usb": 5,
		"system": "android",
		"serial": "99001212143552",
		"phoneInfo": [
			{ "name": "系统版本", "value": "h2os_4" },
			{ "name": "IMEI", "value": "869807032871053" }
		]
	}
}
```

#### 设备断开

Fetch 命令: `device_out`

Fetch 参数：

| 参数名 | 类型   | 说明 |
| ------ | ------ | ---- |
| usb    | number | 序号 |

#### 设备投屏

Fetch 命令：`dev_cast`

Fetch 参数：

| 参数名 | 类型   | 说明   |
| ------ | ------ | ------ |
| id     | number | USB 号 |

#### 设备状态更新

Fetch 命令: `device_change`

Fetch 参数：

| 参数名       | 类型               | 说明         |
| ------------ | ------------------ | ------------ |
| usb          | number             | 序号         |
| fetchState   | enum               | 状态枚举     |
| manufacturer | string             | 设备厂商     |
| mode         | enum               | 模式         |
| cloudAppList | CloudAppMessages[] | 云取应用列表 |

> 当 mode===3 云取证，由 Fetch 推送应用列表，根据应用结果状态来以颜色区分取证成功与失败

#### 接收采集消息

Fetch 命令: `tip_msg`

Fetch 参数：

| 参数名    | 类型   | 说明                              |
| --------- | ------ | --------------------------------- |
| usb       | number | 序号                              |
| type      | enum   | 消息枚举（TipType）               |
| title     | string | 标题                              |
| content   | string | 内容（与 images 二选一传递）      |
| images    | enum   | 图示枚举（与 content 二选一传递） |
| yesButton | object | 是按钮                            |
| noButton  | object | 否按钮                            |

当 type 为**iTunes 密码提示**时 UI 需反馈命令`tip_reply`，参数：

| 参数名   | 类型   | 说明                                                     |
| -------- | ------ | -------------------------------------------------------- |
| usb      | number | 序号                                                     |
| password | string | 密码                                                     |
| type     | number | 用户按钮分类(1:密码确认，2:未知密码放弃，3:未知密码继续) |

当 type 为**联通验证码**时 UI 反馈命令`umagic_code_reply`，参数：

| 参数名 | 类型   | 说明   |
| ------ | ------ | ------ |
| usb    | number | 序号   |
| code   | string | 验证码 |

#### 清空采集消息

Fetch 命令: `tip_clear`

Fetch 参数：

| 参数名 | 类型   | 说明 |
| ------ | ------ | ---- |
| usb    | number | 序号 |

#### 接收云取证验证码详情

Fetch 命令: `sms_msg`

参数：

| 参数名  | 类型   | 说明          |
| ------- | ------ | ------------- |
| usb     | number | 序号          |
| appId   | string | 云取证应用 id |
| message | object | 详情消息      |

message:

| 参数名     | 类型   | 说明     |
| ---------- | ------ | -------- |
| content    | string | 消息内容 |
| type       | enum   | 分类     |
| actionTime | Date   | 消息时间 |

> 消息分类 - 0：黑色 1：红色 2：蓝色
> 说明：fetch 推送来的消息根据 appId 来做区分，显示到对应的应用组件上

#### 发送验证码

Fetch 命令: `sms_send`

参数：

| 参数名 | 类型   | 说明        |
| ------ | ------ | ----------- |
| usb    | number | 序号        |
| code   | string | 短信验证码  |
| appId  | string | 应用 id     |
| key    | string | 应用 key 值 |
| type   | enum   | 类型枚举    |

> 枚举说明： 4-发送； 5-取消；6-重新发送验证码

#### 查询提取方式

Fetch 命令：`extraction`

参数：

| 参数名 | 类型   | 说明 |
| ------ | ------ | ---- |
| usb    | number | 序号 |

#### 向 UI 发送提取方式

Fetch 命令：`extraction`

参数：

| 参数名  | 类型                         | 说明         |
| ------- | ---------------------------- | ------------ |
| usb     | number                       | 序号         |
| methods | {name:string,value:number}[] | 提取方式列表 |

#### 接收云取图形验证码数据（滑块、文字点选）

Fetch 命令：`human_verify`

参数：

| 参数名          | 类型        | 说明     |
| --------------- | ----------- | -------- |
| usb             | number      | 序号     |
| appId           | string      | 应用 id  |
| humanVerifyData | HumanVerify | 图形数据 |

HumanVerify：

| 参数名     | 类型                         | 说明       |
| ---------- | ---------------------------- | ---------- |
| date       | number                       | 时间戳     |
| slider     | {width:number,height:number} | 滑块参数   |
| type       | string                       | 验证类型   |
| jigsaw_img | JigsawImg                    | 缺块参数   |
| back_img   | BackImg                      | 背景图参数 |
| tips       | any                          | 提示说明   |

JigsawImg：

| 参数名 | 类型   | 说明        |
| ------ | ------ | ----------- |
| base64 | string | 图片 base64 |
| width  | number | 宽度        |
| height | number | 高度        |
| style  | any    | 初始样式    |

BackImg：

| 参数名 | 类型   | 说明        |
| ------ | ------ | ----------- |
| base64 | string | 图片 base64 |
| width  | number | 宽度        |
| height | number | 高度        |

#### 发送图形验证码结果

UI 命令：`human_reply`，参数：

参数：

| 参数名 | 类型                           | 说明                |
| ------ | ------------------------------ | ------------------- |
| usb    | number                         | 序号                |
| appId  | string                         | 应用 id             |
| value  | number & {x:number,y:number}[] | 滑块值&文字点选结果 |

> 注：当类型是滑块拼图验证时，value 为数值类型；是文字点选，value 为坐标数组。

#### 开始采集（取证）

UI 命令：`start_fetch`，参数：

| 参数名        | 类型        | 说明                                          |
| ------------- | ----------- | --------------------------------------------- |
| usb           | number      | USB 序号                                      |
| mode          | enum        | 0:标准采集,1:点验,2:广州警综平台,3:短信云取证 |
| caseName      | string      | 案件名称                                      |
| casePath      | string      | 案件存储路径                                  |
| appList       | CParseApp[] | 解析 App                                      |
| cloudAppList  | CloudApp[]  | 短信云取 App                                  |
| mobileName    | string      | 手机名称                                      |
| mobileHolder  | string      | 手机持有人                                    |
| mobileNo      | string      | 手机编号                                      |
| mobileNumber  | string      | 手机号（云取）                                |
| note          | string      | 备注                                          |
| credential    | string      | 证件号码（点验模式传:手机号/军官证号）        |
| unitName      | string      | 检验单位                                      |
| hasReport     | boolean     | 是否生成报告                                  |
| isAuto        | boolean     | 是否自动解析                                  |
| analysisApp   | boolean     | 是否获取应用数据                              |
| sdCard        | boolean     | 是否拉取 SD 卡数据                            |
| cloudTimeout  | number      | 云取超时时间（云取）                          |
| extraction    | number      | 提取方式                                      |
| cloudTimespan | number      | 云取查询间隔（云取）                          |
| isAlive       | boolean     | 是否保活                                      |

> 说明：点验模式(mode==1)下会从 NeDB 数据库中读取记录，若已存在某条设备的记录（用设备序列号来做唯一），则读取数据自动进行采集，免去用户再次手动输入采集信息；警综平台(mode==2)与点验模式是互斥的，开启平台必须关闭点验模式，反之亦是。
> 短信云取 App 与标准解析 App 所传内容不同，标准 App 传应用 id 及包名；云应用传 id、name 和 key

#### 停止采集（取证）

UI 命令：`stop_fetch`，参数：

| 参数名 | 类型   | 说明 |
| ------ | ------ | ---- |
| usb    | number | 序号 |

#### 采集进度

Fetch 命令：`fetch_progress`，参数：

| 参数名 | 类型   | 说明     |
| ------ | ------ | -------- |
| usb    | number | 序号     |
| type   | enum   | 进度分类 |
| info   | string | 进度内容 |

> 进度分类枚举 0:一般消息（黑色标识）1:警告消息（红色标识）2：特殊消息（蓝色标识）

#### 采集进度值

Fetch 命令：`fetch_percent`，参数：

| 参数名 | 类型   | 说明         |
| ------ | ------ | ------------ |
| usb    | number | 序号         |
| value  | number | 进度百分比值 |

#### 发送多用户/隐私空间消息

Fetch 命令：`extra_msg`，参数：

| 参数名  | 类型   | 说明     |
| ------- | ------ | -------- |
| usb     | number | 序号     |
| content | string | 消息内容 |

#### 查询破解设备列表：

Fetch 命令：`crack_query`，无参数

#### 向 UI 发送破解设备列表

Fetch 命令：`crack_list`，参数：

| 参数名 | 类型   | 说明     |
| ------ | ------ | -------- |
| name   | string | 手机名称 |
| value  | string | 值       |

#### 向 UI 发送破解进度

Fetch 命令：`crack_msg`，参数：

| 参数名 | 类型   | 说明     |
| ------ | ------ | -------- |
| msg    | string | 进度消息 |

#### 开始破解

Fetch 命令：`start_crack`，参数：

| 参数名 | 类型   | 说明           |
| ------ | ------ | -------------- |
| id     | string | 所选设备 value |
| type   | enum   | 方式枚举       |

#### 开始恢复

Fetch 命令：`start_recover`，参数：

| 参数名 | 类型   | 说明           |
| ------ | ------ | -------------- |
| id     | string | 所选设备 value |
| type   | enum   | 方式枚举       |

#### 查询安卓 apk 列表

Fetch 命令：`apk_query`，参数：无

#### 向 UI 发送设备列表

Fetch 命令：`apkphone_list`，参数:

| 参数名 | 类型   | 说明   |
| ------ | ------ | ------ |
| id     | string | USB 号 |
| name   | string | 名称   |
| value  | string | 包名   |

> 数组类型 Phone[]

#### 提取 apk

Fetch 命令：`apk_extract`，参数:

| 参数名 | 类型   | 说明     |
| ------ | ------ | -------- |
| id     | string | USB 号   |
| phone  | string | 所选设备 |
| saveTo | string | 存储在   |
| apk    | string | 所选 apk |

#### 查询安卓提权设备列表：

Fetch 命令：`android_auth_query`，无参数

#### 向 UI 发送安卓提权设备列表

Fetch 命令：`android_auth_list`，参数：

| 参数名 | 类型   | 说明     |
| ------ | ------ | -------- |
| name   | string | 手机名称 |
| value  | string | 值       |

#### 向 UI 发送安卓提权消息

Fetch 命令：`android_auth_msg`，参数：

| 参数名 | 类型   | 说明     |
| ------ | ------ | -------- |
| msg    | string | 进度消息 |

#### 开始提权

Fetch 命令：`android_auth_pick`，参数：

| 参数名 | 类型   | 说明           |
| ------ | ------ | -------------- |
| id     | string | 所选设备 value |

#### 关闭提权窗口

Fetch 命令：`android_auth_close`，无参数

#### 设备截屏

Fetch 命令：`dev_snapshot`，参数：

| 参数名 | 类型   | 说明           |
| ------ | ------ | -------------- |
| id     | string | 所选设备 value |
| type   | enum   | 枚举           |
| saveTo | string | 保存位置       |

#### 关闭破解弹框：

Fetch 命令：`close_crack`，无参数

#### 解析程序连入

Parse 命令：`connect`，无参数。

### 解析通信命令说明

#### 开始解析

UI 命令：`start_parse`，参数：

| 参数名       | 类型      | 说明                                                  |
| ------------ | --------- | ----------------------------------------------------- |
| caseId       | string    | 案件 id                                               |
| deviceId     | string    | 设备 id                                               |
| phonePath    | string    | 手机绝对路径                                          |
| hasReport    | boolean   | 是否生成报告                                          |
| analysisApp  | boolean   | 是否获取 App 数据                                     |
| useKeyword   | boolean   | 是否开启过滤敏感词                                    |
| useDocVerify | boolean[] | 文档验证相关配置                                      |
| isDel        | boolean   | 解析后是否删除原数据                                  |
| isAi         | boolean   | 是否开启 AI 分析                                      |
| aiTypes      | any[]     | AI 分类（从 predict.json 中读取）                     |
| tokenAppList | string[]  | Token 云取证应用包名                                  |
| dataMode     | enum      | 模式（0：标准,1：点验,2：广州警综平台,3：短信云取证） |
| category     | enum      | 解析分类(0:标准取证,1:快速点验)                       |

> 手机路径存储格式为： 案件*[时间戳]/持有人/手机*[时间戳]
> useDocVerify 为数组类型，顺序为[文档验证, PDFOCR 识别] 如: useDocVerify:[true,false]

#### 解析进度

Parse 命令：`parse_curinfo`，参数：

| 参数名      | 类型   | 说明                            |
| ----------- | ------ | ------------------------------- |
| caseId      | string | 案件 id                         |
| deviceId    | string | 设备 id                         |
| curinfo     | string | 进度内容                        |
| curprogress | number | 进度百分比(0~100)               |
| category    | enum   | 解析分类(0:标准取证,1:快速点验) |

注意：此参数解析会传为数组类型，每一条对应一部当前正在解析的设备，使用 deviceId 来做区分。举例：

```json
msg: [
	{
		caseId:'NWca882kj59ck',
		deviceId:'Tq39s9lkjl2cj',
		curinfo:'正在解析微信分身数据',
		curprogress:20,
		category:0
	},
	{
		caseId:'NWca882kj59ck',
		deviceId:'Ka30lj7Qcb5b',
		curinfo:'正在解析浏览器',
		curprogress:32,
		category:0
	}
]
```

#### 解析结束

Parse 命令：`parse_end`，参数：

| 参数名            | 类型    | 说明                                      |
| ----------------- | ------- | ----------------------------------------- |
| caseId            | string  | 案件 id                                   |
| deviceId          | string  | 设备 id                                   |
| u64parsestarttime | number  | 解析开始时间（Unix 时间戳），解析失败为-1 |
| u64parseendtime   | number  | 解析结束时间（Unix 时间戳），解析失败为-1 |
| parseapps         | any[]   | 应用数据                                  |
| isparseok         | boolean | 是否解析成功                              |
| category          | enum    | 解析分类（0:标准取证,1:快速点验）         |

parseapps：

| 参数名   | 类型   | 说明     |
| -------- | ------ | -------- |
| appname  | string | 应用名   |
| u64count | number | 解析数量 |

#### 导入第三方数据

Parse 命令：`import_device`，参数：

| 参数名       | 类型     | 说明                              |
| ------------ | -------- | --------------------------------- |
| caseId       | string   | 案件 id                           |
| deviceId     | string   | 设备 id                           |
| dataType     | enum     | 导入数据类型枚举                  |
| mobileHolder | string   | 持有人                            |
| mobileNo     | string[] | 代替传 IMEI                       |
| mobileName   | string   | 手机名称                          |
| model        | string   | 手机品牌                          |
| packagePath  | string   | 第三方数据位置                    |
| sdCardPath   | string   | SD 卡数据位置（安卓数据导入使用） |
| phonePath    | string   | 手机路径                          |
| hasReport    | boolean  | 是否生成报告                      |
| useKeyword   | boolean  | 是否过滤敏感词                    |
| note         | string   | 备注                              |

#### 导入第三方数据失败

Parse 命令：`import_err`, 参数：

| 参数名     | 类型   | 说明     |
| ---------- | ------ | -------- |
| caseId     | string | 案件 id  |
| deviceId   | string | 设备 id  |
| mobileName | string | 手机名称 |
| msg        | string | 错误消息 |

#### 提示用户输入备份密码

Parse 命令：`back_datapass`，参数：

| 参数名     | 类型   | 说明     |
| ---------- | ------ | -------- |
| caseId     | string | 案件 id  |
| deviceId   | string | 设备 id  |
| mobileName | string | 手机名称 |

#### 用户输入备份密码提交

Parse 命令：`confirm_datapass`，参数：

| 参数名     | 类型    | 说明         |
| ---------- | ------- | ------------ |
| caseId     | string  | 案件 id      |
| deviceId   | string  | 设备 id      |
| mobileName | string  | 手机名称     |
| forget     | boolean | 是否忘记密码 |
| password   | string  | 密码         |

#### 通知解析程序平台设置更新

Parse 命令：`plat_change`，参数：

| 参数名      | 类型    | 说明         |
| ----------- | ------- | ------------ |
| ip          | string  | 平台 IP 地址 |
| port        | string  | 平台端口号   |
| usePlatform | boolean | 是否开启     |

### 痕迹查询命令说明(Trace)

#### 用户登录

Trace 命令：`login`, 参数：

| 参数名   | 类型   | 说明   |
| -------- | ------ | ------ |
| username | string | 用户名 |
| password | string | 密码   |

#### 接收登录结果

Trace 命令：`login`，参数：

| 参数名  | 类型    | 说明          |
| ------- | ------- | ------------- |
| success | boolean | 登录成功/失败 |
| message | string  | 消息          |

#### 接收剩余次数

Trace 命令：`limit-result`，参数：

| 参数名    | 类型   | 说明             |
| --------- | ------ | ---------------- |
| app_limit | number | APP 查询剩余次数 |
