const moment = require('moment');

// 订单状态
export function convertOrderStatus(status) {
    if(typeof(status) == 'undefined') {
        return '-';
    }
    switch (status) {
        case 0:
            return '已预定';
        case 1:
            return '已服务';
        case 2:
            return '已关闭';
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


