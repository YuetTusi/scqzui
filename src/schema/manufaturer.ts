
/**
 * 设备软硬件信息
 * # 生成BCP会使用到
 */
class Manufaturer {
    /**
     * 开发方（制造商名称）
     */
    public manufacturer?: string;
    /**
     * 客服电话
     */
    public hotline?: string;
    /**
     * 联系电话
     */
    public telephone?: string;
    /**
     * 邮箱
     */
    public email?: string;
    /**
     * 论坛
     */
    public forum?: string;
    /**
     * 地址
     */
    public address?: string;
    /**
     * 厂商组织机构代码
     */
    public security_software_orgcode?: string;
    /**
     * 产品名称（采集设备名称）
     */
    public materials_name?: string;
    /**
     * 产品型号
     */
    public materials_model?: string;
    /**
     * 设备硬件版本
     */
    public materials_hardware_version?: string;
    /**
     * 设备软件版本
     */
    public materials_software_version?: string;
    /**
     * 设备序列号
     */
    public materials_serial?: string;
    /**
     * 采集点IP地址
     */
    public ip_address?: string;
}

export { Manufaturer };
export default Manufaturer;