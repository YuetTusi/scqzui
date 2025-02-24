interface Prop {
    /**
     * 确定回调
     */
    okHandle?: () => void;
    /**
     * 取消回调
     */
    cancelHandle?: () => void;
};

export { Prop };