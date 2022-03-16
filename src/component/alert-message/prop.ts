interface Prop {}

/**
 * 全局消息Entity
 */
class AlartMessageInfo {
    /**
     * 消息id（唯一id）
     */
    id: string;
    /**
     * 消息内容
     */
    msg: string

    constructor({ id, msg }: Record<string, string>) {
        this.id = id ?? '';
        this.msg = msg ?? '';
    }
}

export { Prop, AlartMessageInfo };