import React, { FC, memo } from 'react';
import { helper } from '@/utils/helper';
import { caseStore } from '@/utils/local-store';
import { CaseInfoBox } from './styled/case-info-box';
import { CaseInfoProp } from './prop';

/**
 * 案件信息
 */
const CaseInfo: FC<CaseInfoProp> = memo(({ usb }) => {

    let caseName = '';
    let mobileHolder = '';
    let mobileNo = '';

    if (helper.isNullOrUndefined(usb)) {
        return null;
    }
    let caseSession = caseStore.get(usb);
    if (caseSession === null) {
        return null;
    }
    if (!helper.isNullOrUndefinedOrEmptyString(caseSession.spareName)) {
        caseName = caseSession.spareName;
    } else if (!helper.isNullOrUndefined(caseSession.caseName)) {
        caseName = caseSession.caseName.split('_')[0];
    } else {
        caseName = '';
    }
    mobileHolder = caseSession.mobileHolder;
    mobileNo = caseSession.mobileNo;

    return <CaseInfoBox>
        <div>
            <label className="txt">案件名称</label>
            <span title={caseName} className="val">{caseName}</span>
        </div>
        <div>
            <label className="txt">手机持有人</label>
            <span title={mobileHolder} className="val">{mobileHolder}</span>
        </div>
        {!helper.isNullOrUndefinedOrEmptyString(mobileNo) ? (
            <div>
                <label className="txt">手机编号</label>
                <span title={mobileNo} className="val">{mobileNo}</span>
            </div>
        ) : null}
    </CaseInfoBox>;
});

export { CaseInfo };