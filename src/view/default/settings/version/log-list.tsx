import React, { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListAlt } from '@fortawesome/free-solid-svg-icons';
import { LogListBox } from './styled/style';
import { LogItem, LogListProp } from './prop';

const LogList: FC<LogListProp> = ({ logs }) => {
	const renderLogs = (logs: [string, LogItem][]) =>
		logs.map(([log, item], index) => <div key={`Log_${index}`}>
			<h2>
				<FontAwesomeIcon icon={faListAlt} />
				<span>{log.replace(/\-/g, '.')}</span>
			</h2>
			<div className="details">
				<div>
					<label>日期：</label>
					<span>{item.Date}</span>
				</div>
				<div className="spe">
					<label>ID：</label>
					<span>{item.ID}</span>
				</div>
			</div>
			<ul>
				{item.Item.map((item, index) => <li key={`L_${index}`}>{item}</li>)}
			</ul>
		</div>);
	return <LogListBox>{renderLogs(logs)}</LogListBox>;
};

export default LogList;
