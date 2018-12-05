const moment = require('moment');
export function convertOrderSource(orderSource) {
    if (typeof(orderSource) == "undefined") {
        return '-';
    }
    switch (orderSource) {
        case 0:
            return "地推app";
        case 1:
            return "运营后台";
        case 2:
            return "车牛";
        case 3:
            return "大风车";
        case 4:
            return "弹个车";
        case 5:
            return "卖车管家";
        default:
            return '-'
    }
}


export function convertPlatform(platform) {
    if (typeof(platform) == "undefined") {
        return '-';
    }
    switch (platform) {
        case 1:
            return "车牛";
        case 2:
            return "大风车";
        case 3:
            return "弹个车";
        case 4:
            return "卖车管家";
        default:
            return '-'
    }
}

export function convertBaoyangStatus(status) {
    if (typeof(status) == "undefined") {
        return '-';
    }
    switch (status) {
        case 0:
            return "未激活";
        case 1:
            return "申请中";
        case 2:
            return "已激活";
        case -1:
            return "无保养";
        default:
            return '-'
    }
}
export function convertQaActive(status) {
    if (typeof(status) == "undefined") {
        return '-';
    }
    switch (status) {
        case 0:
            return "未开启";
        case 1:
            return "已开启";
        case 2:
            return "审核不通过";
        case 3:
            return "直接退款";
        case 4:
            return "审核通过"
        default:
            return '-'
    }
}

export function convertQaStatus(status) {
    if (typeof(status) == "undefined") {
        return '-';
    }
    switch (status) {
        case 0:
            return "待支付";
        case 1:
            return "已支付";
        case 2:
            return "订单关闭";
        default:
            return '-'
    }
}

export function convertCommissionStatus(status) {
    if (typeof(status) == "undefined") {
        return '-';
    }
    switch (status) {
        case 0:
            return "待结算";
        case 1:
            return "佣金(冻结)";
        case 2:
            return "佣金(冻结)";
        case 3:
            return "佣金(解冻)";
        default:
            return '-'
    }
}

export function convertOrderWorkflowStatus(status) {
    if (typeof(status) == "undefined") {
        return '-';
    }
    switch (status) {
        case 'WAIT_PAY':
            return "待支付";
        case 'SUBMIT_CUST_INFO':
            return "提交客户资料";
        case 'ADD_SUBMIT_CUST_INFO':
            return "补充客户资料";
        case 'AUDIT_CUST_INFO':
            return "审核客户资料";
        case 'WAIT_SIGN_CONTRACT':
            return "待签署合同";

        case 'ORDER_ACTIVE':
            return "已开启";
        case 'ORDER_CLOSE':
            return "已关闭";
        case 'ORDER_REFUND':
            return "已退款";
        case 'ORDER_CANCEL':
            return "已取消";
        default:
            return '-'
    }

}



export function convertIsFactoryInsurance(status){
    if (typeof(status) == "undefined") {
        return '-';
    }
    switch (status) {
        case 'Y':
            return "支持";
        case 'N':
            return "不支持";
        default:
            return '-'
    }
}

export function convertIsAccdentCar(status){
    console.log(status);
    console.log(typeof(status));
    if (typeof(status) == "undefined") {
        return '-';
    }
    switch (status) {
        case true:
            return "是";
        case false:
            return "否";
        default:
            return '-'
    }
}

export function convertIsFactoryLimitMileage(status){
    if (typeof(status) == "undefined") {
        return '-';
    }
    switch (status) {
        case 'Y':
            return "限制";
        case 'N':
            return "不限制";
        default:
            return '-'
    }
}

/**
 *权限控制，按钮显示控制
 */
let resourcesArr = [];
let authZInfo;
window.AuthZ.init((err, authZ, data) => {
    resourcesArr = authZ.resources;
    authZInfo = authZ;
})
export function containsResource(resource) {
    const collectFields = resourcesArr.map(ary => ary['code']);
    return collectFields.includes(resource);
}

export function getCurrentLoginUserId(handlerId) {
    console.log(authZInfo);
    return handlerId != null ? authZInfo.userId == handlerId : true;
}

export function convertRoleCodeToRoleName(code) {
    if(typeof(code) == 'undefined') {
        return '-';
    }
    switch (code) {
        case 'DSC_ZHIBAO_DIRECTOR':
            return '主管';
        case 'DSC_ZHIBAO_MANAGER':
            return '经理';
        case 'DSC_ZHIBAO_ADMINISTRATOR':
            return '管理员';
        default:
            return '-';
    }
}

export function convertWarrantyAuditConfigStatus(status) {
    if(typeof(status) == 'undefined') {
        return '-';
    }
    switch (status) {
        case '0':
            return '已上架';
        case '1':
            return '已下架';
        default:
            return '-';
    }
}

export function convertClaimeConfigStatus(status) {
    if(typeof(status) == 'undefined') {
        return '';
    }
    switch (status) {
        case 'INIT':
            return '未上架';
        case 'ON':
            return '已上架';
        case 'OFF':
            return '已下架';
        default:
            return status;
    }
}



export function convertWarrantyStatus(status) {
    if(typeof(status) == 'undefined') {
        return '-';
    }
    switch (status) {
        case '0':
            return '开始理赔';
        case '1':
            return '待审核';
        case '2':
            return '审核不通过';
        case '3':
            return '金额待审核';
        case '4':
            return '待结算';
        case '5':
            return '结案';
        default:
            return status;
    }
}


export function convertWarrantyRepairMode(mode) {
    if(typeof(mode) == 'undefined') {
        return '-';
    }
    switch (mode) {
        case '0':
            return '待查定';
        case '1':
            return '正常理赔';
        case '2':
            return '拒赔';
        case '3':
            return '免赔';
        default:
            return mode;
    }
}


export function convertSchemeBusinessType(businessType) {
    if(typeof(businessType) == 'undefined') {
        return '-';
    }
    switch (businessType) {
        case 'lease':
            return '弹个车';
        case 'dafengche':
            return '大风车';
        default:
            return businessType;
    }
}

export function convertCarType(carType) {
    if(typeof(carType) == 'undefined') {
        return '-';
    }
    switch (carType) {
        case '1':
            return '中规车';
        case '2':
            return '平行进口车';
        default:
            return '-';
    }
}

export function convertCarSourceType(carSourceType) {
    if(typeof(carSourceType) == 'undefined') {
        return '-';
    }
    switch (carSourceType) {
        case '0':
            return '国产';
        case '1':
            return '中规';
        case '2':
            return '美规';
        case '3':
            return '中东';
        case '4':
            return '加版';
        case '5':
            return '欧版';
        case '6':
            return '墨版';
        default:
            return '-';
    }
}

export function convertCarUseType(useType) {
    if(typeof(useType) == 'undefined') {
        return '-';
    }
    switch (useType) {
        case '1':
            return '营运';
        case '2':
            return '非营运';
        case '3':
            return '营转非';
        case '4':
            return '租赁';
        case '5':
            return '租赁非营运';
        default:
            return '-';
    }
}

export function convertCarriages(type) {
    if(typeof(type) == 'undefined') {
        return '-';
    }
    switch (type) {
        case '1':
        return 'SUV';
        case '2':
            return 'MPV';
        case '3':
            return '敞篷';
        case '4':
            return '跑车';
        case '5':
            return '两厢车';
        case '6':
            return '三厢车';
        case '7':
            return '旅行车';
        case '8':
            return '皮卡车';
        case '9':
            return '其他';
        case '12':
            return '单厢车';
        case '13':
            return '两厢半';
        default:
            return '-';
    }
}

// 订单延保状态
export function convertExtInsureStatus(status) {
    if(typeof(status) == 'undefined') {
        return '-';
    }
    switch (status) {
        case '0':
            return '待开启';
        case '1':
            return '已开启';
        case '2':
            return '已关闭';
        default:
            return '-';
    }
}

// 租后处置类型枚举(融租信息)
export function convertLeaseAfterStatus(status) {
    if(typeof(status) == 'undefined') {
        return '-';
    }
    switch (status) {
        case '1':
            return '退车';
        case '2':
            return '买断';
        case '3':
            return '分期';
        case '4':
            return '续租';
        case '5':
            return '拍卖';
        case '11':
            return '主动提前买断';
        case '12':
            return '主动提前退车';
        case '13':
            return '收车后提前买断';
        case '14':
            return '收车后提前退车';
        case '15':
            return '收车后异常退车';
        case '16':
            return '提前拍卖';
        default:
            return '-';
    }
}

// 车辆类型枚举
export function convertQaType(status) {
    if(typeof(status) == 'undefined') {
        return '-';
    }
    switch (status) {
        case '1':
            return '中规车（二手车）';
        case '2':
            return '平行进口车';
        default:
            return '-';
    }
}

// 时间格式化
export function formatTime(time, pattern) {
    let style = 'YYYY年MM月DD日';
    if(typeof(time) == 'undefined') {
        return '-';
    }
    if(typeof(pattern) != 'undefined'){
        style = pattern;
    }
    return moment(time).format(style);
}

// 延保生效里程
export function convertExtTableMileage(start, end) {
    if(typeof(start) == 'undefined' || typeof(end) == 'undefined') {
        return '-';
    }
    return (end - start) / 1000;
}


