import React, { FC } from 'react';
import Button from 'antd/lib/button';
import BoardMenu from '@/component/board-menu';

const Dashboard: FC<{}> = () => {
	return (
		<BoardMenu>
			Dashboard
		</BoardMenu>
	);
};

export default Dashboard;
