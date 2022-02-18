import styled from 'styled-components';
import React, { FC } from 'react';
import Button from 'antd/lib/button';

const Dashboard: FC<{}> = () => {
	return (
		<div>
			<h2>Dashboard</h2>
			<Button type="primary">Click</Button>
		</div>
	);
};

export default Dashboard;
