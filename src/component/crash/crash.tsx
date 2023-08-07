import { ipcRenderer } from 'electron';
import React, { Component, ErrorInfo } from 'react';
import SyncOutlined from '@ant-design/icons/SyncOutlined';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import Button from 'antd/lib/button';
import Result from 'antd/lib/result';
import log from '@/utils/log';
import { ErrorMessage } from './error-message';
import { CrashViewBox } from './styled/style';
import { CrashProp, CrashState } from './prop';

/**
 * 崩溃页
 */
class Crash extends Component<CrashProp, CrashState> {
	constructor(props: CrashProp) {
		super(props);
		this.state = { hasError: false };
	}
	static getDerivedStateFromError() {
		return { hasError: true };
	}
	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		log.error(`页面崩溃: ${error.message}`);
		log.error('Error Stack:', error.stack);
		log.error('Component Stack:', errorInfo.componentStack);
		this.setState({ err: error, errInfo: errorInfo });
	}
	render() {
		if (this.state.hasError) {
			//降级渲染
			return <CrashViewBox>
				<Result
					title="程序错误，请重启或退出应用"
					subTitle={<ErrorMessage error={this.state.err} />}
					extra={
						<>
							<Button
								onClick={() => ipcRenderer.send('do-relaunch')}
								type="primary">
								<SyncOutlined />
								<span>重启</span>
							</Button>
							<Button
								onClick={() => ipcRenderer.send('do-close')}
								type="primary">
								<CloseCircleOutlined />
								<span>退出</span>
							</Button>
						</>
					}
				/>
			</CrashViewBox>
		} else {
			return <>{this.props.children}</>;
		}
	}
}

export default Crash;
