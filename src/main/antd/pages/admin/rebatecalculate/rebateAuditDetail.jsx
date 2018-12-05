import React from 'react';
import ReactDom from 'react-dom';
import SADPage from '@souche-f2e/sad';
import '../../../styles/index.less';
import { containsResource } from '../../utils/utils';

/**
 * 这里声明要引入的组件
 */
import { Form, Input, Popconfirm, Button, Table, Radio, InputNumber, notification } from 'antd';
import { SubmitButton } from '@souche-f2e/sad/components/RJAntd';
const RadioGroup = Radio.Group;

const FormItem = Form.Item;
const moment = require('moment');
const deleteFromFirst2Second = (ary1,ary2,field)=>{
    const collectFields = ary2.map(ary=>ary[field])
    return ary1.filter(ary=>!collectFields.includes(ary[field]))
}

const union = (ary1,ary2,field)=>{
    const collectFields = ary1.map(ary=>ary[field])
    return ary1.concat(ary2.filter(ary=>!collectFields.includes(ary[field])))
}

/**
 * 返佣审核列表页面
 */
class RebateAuditDetail extends SADPage {
    constructor() {
        super();
        this.state = {
            query:{},
            status: {}
        };
        this.state.orderCodes = [];
    }

    openNotificationWithIcon = (type, title, msg) => {
        notification[type]({
            message: title,
            description: msg,
        });
    };

    /**
     * 切换分页
     * @param pagination
     */
    hanldeTableChange = (pagination) => {
        this.state.pageSize = pagination.pageSize;
        this.state.page = pagination.current;
        this.getRebateOrderList();
    }

    /**
     * 提交审批
     */
    handSubmit = () => {
        this.state.query = this.props.form.getFieldsValue();
        if(this.state.orderCodes.length > 0 && this.state.query.payType == 1 && !this.state.query.invoiceNumber){
            this.openNotificationWithIcon('error', '错误', '线上打款必须输入发票号！');
            return;
        }
        // 判断审核时间
        // if()
        this.handleAudit().then(data => {
            if (data.success) {
                this.openNotificationWithIcon('success', '成功', this.state.msg);
                location.href = `rebateAuditIndex.html`;
                return;
            }
        });
    }

    /**
     * 清除查询条件
     */
    handleReset = () => {
        this.props.form.resetFields();
        this.setState({query: {}});
    }

    /**
     *
     * @returns {*}
     */
    render() {
        const {getFieldDecorator} = this.props.form;
        let pagination = null;
        let that = this;
        let _this = null;
        if (this.props._this) {
            _this = this.props._this;
        }
        if (this.state.rebateOrderlist) {
            pagination = {
                size: 'small',
                total: this.state.rebateOrderlist.totalNumber,
                current: this.state.rebateOrderlist.currentIndex,
                pageSize: this.state.rebateOrderlist.pageSize,
                showSizeChanger: true,
                showQuickJumper: true,
                pageSizeOptions: ['10', '20', '50'],
                onShowSizeChange(current, pageSize) {
                },
                onChange(current, pageSize) {
                },
                showTotal(total) {
                    return '共' + total + '条';
                }
            }
        }

        const rowSelection = {
            onSelect(record, selected, selectedRows) {
                let preOrderCodes = that.state.orderCodes || [];
                if(selected){
                    preOrderCodes.push(record);
                }else{
                    preOrderCodes = preOrderCodes.filter(row=>row.orderCode!==record.orderCode);
                }
                that.setState({
                    orderCodes : preOrderCodes
                });
            },
            onSelectAll(selected, selectedRows, changeRows) {
                let preOrderCodes = that.state.orderCodes || [];
                if(selected){
                    //求并集
                    preOrderCodes = union(preOrderCodes,selectedRows,'orderCode');
                }else{
                    preOrderCodes = deleteFromFirst2Second(preOrderCodes,changeRows,'orderCode');
                }
                that.setState({
                    orderCodes : preOrderCodes
                })
            },
        };

        const columns = [
            {
                title: '订单编号',
                dataIndex: 'orderCode',
                key: 'orderCode'
            },
            {
                title: '店铺名称',
                dataIndex: 'shopName',
                key: 'shopName'
            },
            {
                title: '返佣金额',
                dataIndex: 'rebateAmount',
                key: 'rebateAmount'
            },
            {
                title: '应返佣月',
                dataIndex: 'dateCreate',
                key: 'dateCreate',
                render: (text, record) => {
                    return moment(record.dateCreate).add(1, 'months').format('YYYY-MM');
                }
            },
            {
                title: '返佣类型',
                dataIndex: 'rebateType',
                key: 'rebateType',
                render: (text, record) => {
                    if(record.rebateType == 1 ){
                        return '中规车质保（二手车）';
                    } else {
                        return '平行进口车质保';
                    }
                }
            }
        ]

        // 输入框数字格式化
        const limitInteger = (value) => {
            const reg = /^(\-)*(\d+).*$/;
            // console.log(value);
            if(typeof value === 'string') {
                return !isNaN(Number(value)) ? value.replace(reg, '$2') : '';
            } else if (typeof value === 'number') {
                return !isNaN(value) ? String(value).replace(reg, '$2') : '';
            } else {
                return '';
            }
        };

        /**
         * 搜索框组件
         */
        let submitBtn = <Button type="primary" onClick={this.handSubmit}>搜索</Button>;
        let resetBtn = <Button onClick={this.handleReset}>清除</Button>;

        if (this.stateAlready) {

            let rebateInputeView = (
                <div>
                    <FormItem label="请填写发票号">
                        {
                            getFieldDecorator('invoiceNumber', {
                            })(
                                <InputNumber  style={{ width: 200}} placeholder="请输入" min={0} precision={0} step={1}
                                              formatter={limitInteger} parser={limitInteger}/>
                            )
                        }
                    </FormItem>
                    <br/>
                    <FormItem label="应返佣总金额：">
                        <input value={this.state.totalRebateAmount} style={{border: 0}} disabled={true}/>
                    </FormItem>
                </div>

            );

            return (
                <div>
                    <h1>车商返佣结算详情</h1>
                    <br/><br/>
                    <div>
                        <Form layout="inline">
                            {rebateInputeView}
                        </Form>
                        <FormItem
                            label="结算方式："
                        >
                            {getFieldDecorator(`payType`, {
                                initialValue:1
                            })(
                                <RadioGroup name="payType" >
                                    <Radio value={1}>线上打款</Radio>
                                    {/*<Radio value={2}>线下打款</Radio>*/}
                                </RadioGroup>
                            )}
                        </FormItem>
                        <div>
                            <Table columns={columns} dataSource={this.state.rebateOrderlist.items} rowKey="rebateOrderId" pagination={pagination}
                                   onChange={this.hanldeTableChange}
                                   rowSelection={rowSelection}
                                   bordered/>
                        </div>
                    </div>
                    <div>
                        <Popconfirm title="确定提交审批？" onConfirm={this.handSubmit} okText="Yes" cancelText="No">
                            <Button type="primary" style={{marginLeft: 501, marginRight:10}} >确认审批</Button>
                        </Popconfirm>
                        <Button onClick={() => location.href = `rebateAuditIndex.html`}>返回</Button>
                    </div>
                </div>
            );
        }

        return null;
    }

}


RebateAuditDetail = Form.create()(RebateAuditDetail);
ReactDom.render(<div><RebateAuditDetail></RebateAuditDetail></div>, document.querySelector("#content"));
