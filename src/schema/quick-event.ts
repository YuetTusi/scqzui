import { BaseEntity } from './base-entity';

/**
 * 快速点验事件
 */
class QuickEvent extends BaseEntity {

    /**
     * 点验名称
     */
    public eventName: string;
    /**
     * 存储位置
     */
    public eventPath: string;
    /**
     * 违规时段起
     */
    public ruleFrom: number;
    /**
     * 违规时段止
     */
    public ruleTo: number;

    constructor(props: any) {
        super();
        this.eventName = props.eventName ?? '';
        this.eventPath = props.eventPath ?? '';
        this.ruleFrom = props.ruleFrom ?? 0;
        this.ruleTo = props.ruleTo ?? 8;
    }
}

export { QuickEvent };