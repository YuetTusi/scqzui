import dayjs from 'dayjs';
import { AnyAction } from 'redux';
import { routerRedux, EffectsCommandMap } from 'dva';
import Modal from 'antd/lib/modal';
import message from 'antd/lib/message';
import { StateTree } from '@/type/model';
import { LockTime, PasswordEffectDays, User } from '@/schema/user';
import { TableName } from '@/schema/table-name';
import { getDb } from '@/utils/db';
import { helper } from '@/utils/helper';

export default {
    /**
     * 查询登录用户
     */
    *queryByNameAndPassword({ payload }: AnyAction, { call, put, select }: EffectsCommandMap) {

        const userDb = getDb<User>(TableName.Users);
        const { userName, password } = payload;
        message.destroy();
        yield put({ type: 'setLoading', payload: true });
        try {
            const users: User[] = yield call([userDb, 'all']);

            message.destroy();
            Modal.destroyAll();
            if (users.length === 0) {
                message.info('请配置新用户');
                yield put({ type: 'setRegisterUserModalVisible', payload: true });
                return;
            }
            if (users[0].userName !== userName) {
                message.warn('无此用户，请重新输入');
                return;
            }
            if (dayjs(new Date()).diff(dayjs(users[0].modifyTime), 'day') > PasswordEffectDays) {
                //# 密码时效已过
                Modal.warn({
                    title: '口令失效',
                    content: '因长时间未修改，该用户口令已超时限，请修改口令重新登录',
                    okText: '确定',
                    centered: true
                });
                return;
            }
            if (users[0].isLock && dayjs().diff(users[0].lockTime, 'minute') < LockTime) {
                //# 错5次在时间之内
                Modal.warn({
                    title: '用户锁定',
                    content: `请于${LockTime}分钟后重新登录`,
                    okText: '确定',
                    centered: true
                });
                return;
            }
            if (users[0].isLock && dayjs().diff(users[0].lockTime, 'minute') > LockTime) {
                //# 已超过锁定时限，将记录isLock还原为false
                yield put({ type: 'setMistake', payload: 0 });
                yield call([userDb, 'update'],
                    { _id: users[0]._id },
                    {
                        $set: { isLock: false }
                    });
            }


            if (helper.base64ToString(users[0].password) !== password) {
                const prev: number = yield select((state: StateTree) => state.login.mistake);
                if (prev + 1 >= 5) {
                    Modal.warn({
                        title: '用户锁定',
                        content: `因密码连续输入错误5次，请于${LockTime}分钟后重新登录`,
                        okText: '确定',
                        centered: true
                    });
                    yield call([userDb, 'update'], {
                        _id: users[0]._id
                    }, {
                        $set: {
                            isLock: true,
                            lockTime: new Date()
                        }
                    });
                } else {
                    message.warn('口令不正确，请重新输入');
                }
                yield put({ type: 'setMistake', payload: prev + 1 });
                return;
            }

            yield put({ type: 'setMistake', payload: 0 });
            message.success('登录成功');
            yield put(routerRedux.push('/guide'));
        } catch (error) {
            console.log(error);
        } finally {
            yield put({ type: 'setLoading', payload: false });
        }
    },
    /**
     * 添加/更新用户
     */
    *saveOrUpdateUser({ payload }: AnyAction, { call, put }: EffectsCommandMap) {
        const userDb = getDb<User>(TableName.Users);
        const { userName, password, isLock, modifyTime, lockTime } = payload;
        try {
            const users: User[] = yield call([userDb, 'all']);
            if (users.length === 0) {
                //添加
                const entity = new User();
                entity.userName = userName;
                entity.password = helper.stringToBase64(password);
                entity.isLock = false;
                entity.modifyTime = new Date();
                entity.lockTime = new Date();
                yield call([userDb, 'insert'], entity);
                message.success('新用户配置成功，请登录');
                yield put({ type: 'setRegisterUserModalVisible', payload: false });
            } else {
                //编辑
                const entity = new User();
                entity.userName = userName;
                entity.password = password;
                entity.isLock = isLock;
                entity.modifyTime = dayjs(modifyTime, 'YYYY-MM-DD HH:mm:ss').toDate();
                entity.lockTime = dayjs(lockTime, 'YYYY-MM-DD HH:mm:ss').toDate();
                yield call([userDb, 'update'], { _id: users[0]._id }, entity);
            }
        } catch (error) {
            console.log(error);
        }
    },
    /**
     * 更新密码
     */
    *updatePassword({ payload }: AnyAction, { call, put }: EffectsCommandMap) {
        const userDb = getDb<User>(TableName.Users);
        message.destroy();
        try {
            const users: User[] = yield call([userDb, 'all']);
            if (users.length === 0) {
                message.warn(`口令修改失败，无此用户`);
            } else {
                yield call([userDb, 'update'],
                    { _id: users[0]._id },
                    {
                        $set: {
                            password: helper.stringToBase64(payload),
                            modifyTime: new Date()
                        }
                    });
                yield put({ type: 'setMistake', payload: 0 });
                message.success('口令修改成功');
            }
        } catch (error) {
            message.warn(`口令修改失败 ${error.message}`);
        }
    },
    /**
     * 初始化登录页
     * 如果users表为空，测让用户注册
     */
    *init({ }: AnyAction, { call, put }: EffectsCommandMap) {
        const userDb = getDb<User>(TableName.Users);
        try {
            message.destroy();
            const data: User[] = yield call([userDb, 'all']);
            if (data.length === 0) {
                message.info('请配置新用户');
                yield put({ type: 'setRegisterUserModalVisible', payload: true });
            }
        } catch (error) {
            console.log(error);
        }
    }
};