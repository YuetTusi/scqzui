//IP地址
export const IP = /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/;
//端口号（0-32768）
export const Port = /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/;
//检验员编号（6位数字）
export const PoliceNo = /^\d{6}$/;
//编号（数字，不限位数）
export const No = /^\d*$/;
//电子邮件
export const EMail = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
//匹配下划线左侧的所有字符
export const LeftUnderline = /.*(?=_)/;
//手机号码
export const MobileNumber = /^(0|86|17951)?(13[0-9]|15[012356789]|16[0-9]|17[0-9]|18[0-9]|14[0-9]|19[0-9])[0-9]{8}$/;
//合法字符（中文、英文、数字）
export const Charactor = /^[a-zA-Z0-9\u4e00-\u9fa5]*$/;
//过滤反斜杠
export const Backslashe = /^(?!.*\\.*$)/;
//过滤下划线
export const UnderLine = /^(?!.*_.*$)/;
//IMEI
export const IMEI = /^\d{15}$/;
//案件允许字符
export const AllowCaseName = /^[a-zA-Z0-9\u4e00-\u9fa5-$#%@~&()（）]*$/;
//无效OAID值
export const InvalidOAID = /[a-z0-9]+-0{4}-0{4}-0{4}-[a-z0-9]+/;
//特殊字符
export const SpecialCharactor = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]+/;
//英文字母
export const Letter = /[a-zA-Z]+/;
//数字
export const OnlyNumber = /\d+/;
//密码位数
export const PasswordDigit = /^.{8,20}$/;