import React from 'react';
import ReactDom from 'react-dom';
import SADPage from '@souche-f2e/sad';
import '../../../styles/index.less';
import { RJExportExcelButton } from '@souche-f2e/sad/components/RJAntd';

/*
 * 这里声明要引入的组件
 */
import { Icon, Form, Input, Button, Table, Select, Modal,DatePicker,Row, Col ,message} from 'antd';
import { RJAreaCascader ,RJSelect} from '@souche-f2e/sad/components/RJAntd';
import {Component} from 'react';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;
import {
    convertOrderSource,
    convertBaoyangStatus,
    convertQaActive,
    convertQaStatus,
    convertCommissionStatus,
    containsResource,
    convertOrderWorkflowStatus,
    convertQaType,
    convertExtInsureStatus
} from '../../utils/utils';

const resetAreaCascader = RJAreaCascader.resetAreaCascader

import EditOrderCustModal from '../../../components/order/Modal/EditOrderCustModal'
const {  RangePicker } = DatePicker;

const moment = require('moment');

/**
 * 订单管理
 */
class BookOrderIndex extends SADPage {
    constructor() {
        super();
        this.state = {
            orderCustomerInfoData:{},
            orderInfo:{},
            query:{
                //authorization:2
            },
            editCustVisible:false,
        }
    }
    setInitProps() {
        super.setInitProps();
    }
    /**
     * 切换分页
     * @param pagination
     */
    hanldeTableChange = (pagination) => {
        this.state.pageSize = pagination.pageSize;
        this.state.page = pagination.current;
        this.getList();
    }
    /**
     * 搜索查询
     * @param e
     */
    handSubmit = (e) => {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                return;
            }
            let query = this.props.form.getFieldsValue();
            let dateCreate=query.dateCreate;
            if(dateCreate!=null){
                this.state.query.dateCreateStart = dateCreate[0].format('YYYY-MM-DD');
                this.state.query.dateCreateEnd = dateCreate[1].format('YYYY-MM-DD');
            }
            let signContractDate=query.signContractDate;
            if(signContractDate!=null){
                this.state.query.signContractDateStart = signContractDate[0].format('YYYY-MM-DD');
                this.state.query.signContractDateEnd = signContractDate[1].format('YYYY-MM-DD');
            }
            let payTime=query.payTime;
            if(payTime!=null){
                this.state.query.payTimeStart = payTime[0].format('YYYY-MM-DD');
                this.state.query.payTimeDateEnd = payTime[1].format('YYYY-MM-DD');
            }

            this.state.query.vin = query.vin;
            this.state.query.orderCode = query.orderCode;
            this.state.query.shopCode = query.shopCode;
            this.state.query.sellerPhone = query.sellerPhone;
            this.state.query.buyerName = query.buyerName;
            this.state.query.buyerIdentityId = query.buyerIdentityId;
            this.state.query.buyerPhone = query.buyerPhone;
            this.state.query.contractStatus = query.contractStatus;
            this.state.query.qaStatus = query.qaStatus;
            this.state.query.qaActive = query.qaActive;
            this.state.query.orderSource = query.orderSource;
            this.state.query.baoyangStatus = query.baoyangStatus;
            this.state.query.isRebateOrder = query.isRebateOrder;
            this.state.query.isMember = query.isMember;
            this.state.query.qaType = query.qaType;
            this.state.query.extInsureChanceStatus = query.extInsureChanceStatus;
            this.state.query.paymentOrderCode = query.paymentOrderCode;
            this.state.query.workflowStatusCode = query.workflowStatusCode;
            this.state.page = 1;
            this.getList();
        })
    }
    handleExport = (e) => {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                return;
            }
            let query = this.props.form.getFieldsValue();
            let dateCreate=query.dateCreate;
            if(dateCreate!=null){
                this.state.query.dateCreateStart = dateCreate[0].format('YYYY-MM-DD');
                this.state.query.dateCreateEnd = dateCreate[1].format('YYYY-MM-DD');
            }
            let signContractDate=query.signContractDate;
            if(signContractDate!=null){
                this.state.query.signContractDateStart = signContractDate[0].format('YYYY-MM-DD');
                this.state.query.signContractDateEnd = signContractDate[1].format('YYYY-MM-DD');
            }
            let payTime=query.payTime;
            if(payTime!=null){
                this.state.query.payTimeStart = payTime[0].format('YYYY-MM-DD');
                this.state.query.payTimeDateEnd = payTime[1].format('YYYY-MM-DD');
            }

            this.state.query.vin = query.vin;
            this.state.query.orderCode = query.orderCode;
            this.state.query.shopCode = query.shopCode;
            this.state.query.sellerPhone = query.sellerPhone;
            this.state.query.buyerName = query.buyerName;
            this.state.query.buyerIdentityId = query.buyerIdentityId;
            this.state.query.buyerPhone = query.buyerPhone;
            this.state.query.contractStatus = query.contractStatus;
            this.state.query.qaStatus = query.qaStatus;
            this.state.query.qaActive = query.qaActive;
            this.state.query.orderSource = query.orderSource;
            this.state.query.baoyangStatus = query.baoyangStatus;
            this.state.query.paymentOrderCode = query.paymentOrderCode;
            this.state.query.qaType = query.qaType;
            this.state.query.extInsureChanceStatus = query.extInsureChanceStatus;
            this.state.query.workflowStatusCode = query.workflowStatusCode;

            if( this.state.query.orderSource==null || this.state.query.orderSource==''){
                message.error('请选择订单来源');
                return ;
            }
            let queryJson= encodeURIComponent(JSON.stringify(this.state.query));
            let exportUrl = `${this.baseUri}/admin/export/OrderExcelExport.html?query=${queryJson}`
            window.location.href = exportUrl;
        })
    }

    /**
     * 清除查询条件
     */
    handleReset = () => {
        this.setState({query: {}});
        resetAreaCascader();
        this.props.form.resetFields();
    }

    handleChangeSearchShow = () => {
        if(typeof this.state.showStr == 'undefined' || this.state.showStr == 'hidden'){
            this.setState({
                showStr:'visible'
            })
        }else{
            this.setState({
                showStr:'hidden'
            })
        }
    }

    handleCustomerSubmit = (data) => {
        this.state.orderCustomerInfoData=data;
        this.saveCustomerInfo().then(data => {
            if(data.success){
                this.getList();
            }
        });
    }
    handleCustomerCancel = (e) => {
        this.setState({editCustVisible:false});
    }


    editCustomer =(record)=>{
        this.state.orderInfo=record;
        this.setState({editCustVisible:true});
    }

    // To generate mock Form.Item
    getFields() {
        const { getFieldDecorator } = this.props.form;
        const children = [];
        children.push(
            <Col span={6} key={'vin'} >
                <FormItem label="VIN 码">
                    {
                        getFieldDecorator('vin', {
                        })(
                            <Input style={{ width: 200}} placeholder="VIN码"/>
                        )
                    }
                </FormItem>
            </Col>
        );
        children.push(
            <Col span={6} key={'orderCode'} >
                <FormItem label="订单编号">
                    {
                        getFieldDecorator('orderCode', {
                        })(
                            <Input style={{ width: 200}} placeholder="订单编号"/>
                        )
                    }
                </FormItem>
            </Col>
        );
        children.push(
            <Col span={6} key={'shopCode'} >
                <FormItem label="店铺编码">
                    {
                        getFieldDecorator('shopCode', {
                        })(
                            <Input style={{ width: 200}} placeholder="店铺编码"/>
                        )
                    }
                </FormItem>
            </Col>
        );
        children.push(
            <Col span={6} key={'buyerPhone'} >
            <FormItem label="客户手机">
                {
                    getFieldDecorator('buyerPhone', {
                    })(
                        <Input style={{ width: 200}} placeholder="客户手机"/>
                    )
                }

            </FormItem>
            </Col>
        );
        children.push(
            <Col span={6} key={'contractStatus'} >
                <FormItem label="合同状态">
                    {
                        getFieldDecorator('contractStatus', {
                        })(
                            <Select style={{ width: 200 }} placeholder="合同状态"
                            >
                                <Option key={null}>全部</Option>
                                <Option key={true}>已签署</Option>
                                <Option key={false}>未签署</Option>
                            </Select>
                        )
                    }

                </FormItem>
            </Col>
        );


        children.push(
            <Col span={6} key={'workflowStatusCode'} >
            <FormItem label="订单状态">
                {
                    getFieldDecorator('workflowStatusCode', {
                    })(
                        <Select style={{ width: 200 }} placeholder="订单状态"
                        >
                            <Option key={null}>全部</Option>
                            <Option key={'WAIT_PAY'}>待支付</Option>
                            <Option key={'SUBMIT_CUST_INFO'}>提交客户资料</Option>
                            <Option key={'ADD_SUBMIT_CUST_INFO'}>补充客户资料</Option>
                            <Option key={'AUDIT_CUST_INFO'}>审核客户资料</Option>
                            <Option key={'WAIT_SIGN_CONTRACT'}>待签署合同</Option>
                            <Option key={'ORDER_ACTIVE'}>已开启</Option>
                            <Option key={'ORDER_CLOSE'}>已关闭</Option>
                            <Option key={'ORDER_REFUND'}>已退款</Option>
                            <Option key={'ORDER_CANCEL'}>已取消</Option>
                        </Select>
                    )
                }
            </FormItem>
            </Col>
        );

        children.push(
            <Col span={6} key={'qaActive'} >
            <FormItem label="开启状态">
                {
                    getFieldDecorator('qaActive', {
                    })(
                        <Select style={{ width: 200 }} placeholder="质保开启状态"
                        >
                            <Option key={null}>全部</Option>
                            <Option key={0}>未开启</Option>
                            <Option key={1}>已开启</Option>
                            <Option key={2}>审核不通过</Option>
                            <Option key={4}>审核通过</Option>
                            <Option key={3}>直接退款</Option>
                        </Select>
                    )
                }
            </FormItem>
            </Col>
        );
        children.push(
            <Col span={6} key={'orderSource'} >
            <FormItem label="订单来源">
                {
                    getFieldDecorator('orderSource', {
                    })(
                        <Select style={{ width: 200 }} placeholder="订单来源"
                        >
                            <Option key={null}>全部</Option>
                            <Option key={3}>大风车</Option>
                            <Option key={4}>弹个车</Option>
                            <Option key={5}>卖车管家</Option>
                            <Option key={2}>车牛</Option>
                            <Option key={1}>运营后台手工录入</Option>
                            <Option key={0}>地推app</Option>

                        </Select>
                    )
                }
            </FormItem>
            </Col>
        );
        children.push(
            <Col span={6} key={'qaStatus'} >
                <FormItem label="支付状态">
                    {
                        getFieldDecorator('qaStatus', {
                        })(
                            <Select style={{ width: 200 }} placeholder="支付状态"
                            >
                                <Option key={null}>全部</Option>
                                <Option key={0}>待支付</Option>
                                <Option key={1}>已支付</Option>
                                <Option key={2}>已关闭</Option>
                            </Select>
                        )
                    }
                </FormItem>
            </Col>
        );

        children.push(
            <Col span={6} key={'isMemeber'} >
                <FormItem label="会员订单">
                    {
                    getFieldDecorator('isMember', {
                    })(
                        <Select style={{ width: 200 }} placeholder="会员订单"
                        >
                            <Option key={null}>全部</Option>
                            <Option key={"Y"}>是</Option>
                            <Option key={"N"}>否</Option>

                        </Select>
                    )
                }
                </FormItem>
            </Col>
        );

        children.push(
            <Col span={6} key={'qaType'} >
                <FormItem label="车辆类型">
                    {
                    getFieldDecorator('qaType', {
                    })(
                        <Select style={{ width: 200 }} placeholder="车辆类型"
                        >
                            <Option key={null}>全部</Option>
                            <Option key={1}>中规车（二手车）</Option>
                            <Option key={2}>平行进口车</Option>

                        </Select>
                    )
                }
                </FormItem>
            </Col>
        );

        children.push(
            <Col span={6} key={'extInsureChanceStatus'} >
                <FormItem label="延保状态">
                    {
                    getFieldDecorator('extInsureChanceStatus', {
                    })(
                        <Select style={{ width: 200 }} placeholder="延保状态"
                        >
                            <Option key={null}>全部</Option>
                            <Option key={0}>待开启</Option>
                            <Option key={1}>已开启</Option>
                            <Option key={2}>已关闭</Option>

                        </Select>
                    )
                }
                </FormItem>
            </Col>
        );

        children.push(
            <Col span={6} key={'dateCreate'} >
                <FormItem label="创建时间">

                    {getFieldDecorator('dateCreate')(
                        <RangePicker style={{ width: 200 }} format="YYYY-MM-DD" />
                    )}

                </FormItem>
            </Col>
        );
        children.push(
            <Col span={6} key={'payTime'} >
                <FormItem label="支付时间">

                    {getFieldDecorator('payTime')(
                        <RangePicker style={{ width: 200 }} format="YYYY-MM-DD" />
                    )}

                </FormItem>
            </Col>
        );
        children.push(
            <Col span={6} key={'signContractDate'} >
                <FormItem label="签署时间">

                    {getFieldDecorator('signContractDate')(
                        <RangePicker style={{ width: 200 }} format="YYYY-MM-DD" />
                    )}

                </FormItem>
            </Col>
        );
        children.push(
            <Col span={6}>
                <Button onClick={this.handleChangeSearchShow}>更多搜索条件</Button>
            </Col>
        );
        return children;
    }

    getFieldsMore() {
        if(typeof this.state.showStr == 'undefined' || this.state.showStr == 'hidden'){
            return '';
        }
        const { getFieldDecorator } = this.props.form;
        const children = [];
        children.push(
            <Col span={6} key={'sellerPhone'} >
                <FormItem label="车商电话">
                    {
                        getFieldDecorator('sellerPhone', {
                        })(
                            <Input style={{ width: 200}} placeholder="车商电话"/>
                        )
                    }
                </FormItem>
            </Col>
        );
        children.push(
            <Col span={6} key={'buyerName'} >
                <FormItem label="客户姓名">
                    {
                        getFieldDecorator('buyerName', {
                        })(
                            <Input style={{ width: 200}} placeholder="客户姓名"/>
                        )
                    }
                </FormItem>
            </Col>
        );
        children.push(
            <Col span={6} key={'buyerIdentityId'} >
                <FormItem label="身份证号">
                    {
                        getFieldDecorator('buyerIdentityId', {
                        })(
                            <Input style={{ width: 200}} placeholder="客户身份证号"/>
                        )
                    }
                </FormItem>
            </Col>
        );
        children.push(
            <Col span={6} key={'baoyangStatus'} >
                <FormItem label="激活状态">
                    {
                        getFieldDecorator('baoyangStatus', {
                        })(
                            <Select style={{ width: 200 }} placeholder="保养激活状态"
                            >
                                <Option key={null}>全部</Option>
                                <Option key={0}>未激活</Option>
                                <Option key={1}>申请中</Option>
                                <Option key={2}>已激活</Option>
                                <Option key={-1}>无保养</Option>
                            </Select>
                        )
                    }
                </FormItem>
            </Col>
        );
        children.push(
            <Col span={6} key={'paymentOrderCode'} >
                <FormItem label="支付单号">
                    {
                        getFieldDecorator('paymentOrderCode', {
                        })(
                            <Input style={{ width: 200}} placeholder="支付单号"/>
                        )
                    }

                </FormItem>
            </Col>
        );
        children.push(
            <Col span={6} key={'isRebateOrder'} >
                <FormItem label="活动订单">
                    {
                        getFieldDecorator('isRebateOrder', {
                        })(
                            <Select style={{ width: 100 }} placeholder="是否活动订单"
                            >
                                <Option key={null}>全部</Option>
                                <Option key={1}>是</Option>
                                <Option key={0}>否</Option>
                            </Select>
                        )
                    }
                </FormItem>
            </Col>
        );
        children.push(
            <Col span={6} key={'city'} >
                <FormItem label="车辆所在地">
                    <RJAreaCascader  allowClear={true} showSearch={true} cascaderLevel={2}
                                     onProvinceChange={(v) => {
                                         this.state.query.provinceCode=v.label
                                     }}
                                     onCityChange={(v) => {this.state.query.cityCode=v.label}}/>
                </FormItem>
            </Col>
        );

        return children;
    }

    /**
     *
     * @returns {*}
     */
    render() {
        const {getFieldDecorator} = this.props.form;
        let pagination = null;
        let _this = null;
        if (this.props._this) {
            _this = this.props._this;
        }
        if (this.state.list) {
            pagination = {
                size: 'small',
                total: this.state.list.totalNumber,
                current: this.state.list.currentIndex,
                pageSize: this.state.list.pageSize,
                showSizeChanger: true,
                showQuickJumper: true,
                pageSizeOptions: ['5', '10'],
                onShowSizeChange(current, pageSize) {
                },
                onChange(current, pageSize) {
                },
                showTotal(total) {
                    return '共' + total + '条';
                }
            }
        }

        const columns = [
            {
                title: '编号',
                dataIndex: 'id',
                key: 'id',
                display:false
            },
            {
                title: '订单编号',
                dataIndex: 'orderCode',
                key: 'orderCode',
                width:200,
                display:false,
                render: (text, record) => {
                    // 中规车详情页
                    let detailUrl=`/admin/order/OrderDetailIndex.html?orderCode=${record.orderCode}`;
                    return <div>
                        <div>订单编号：<a target="_blank" href={detailUrl}>{record.orderCode}</a>
                            </div>
                        <div>城市:{record.area}</div>
                        <div>创建时间:{record.dateCreate}</div>
                        <div>支付状态:{convertQaStatus(record.qaStatus)}</div>
                        <div>支付时间:{record.payTime}</div>
                    </div>;
                }
            },{
                title: '买家姓名',
                dataIndex: 'buyerName',
                key: 'buyerName',
                display:false
            }, {
                title: '买家电话',
                dataIndex: 'buyerPhone',
                key: 'buyerPhone',
                display:false
            },
            {
                title: 'bookTime',
                dataIndex: '预定时间',
                key: '预定时间',
                display:false
            },
            {
                title: '产品名称',
                dataIndex: 'productName',
                key: 'productName',
                display:false
            },
            {
                title: '产品价格',
                dataIndex: 'productPrice',
                key: 'productPrice',
                display:false
            },
            {
                title: '订单状态',
                dataIndex: 'orderStatus',
                key: 'orderStatus',
                display:false
            },
            {
                title: '创建时间',
                dataIndex: 'dateCreate',
                key: 'dateCreate',
                display:false
            },
            {
                title: '修改时间',
                dataIndex: 'dateUpdate',
                key: 'dateUpdate'
            },
            {
                title: '店铺编码',
                dataIndex: 'shopCode',
                key: 'shopCode',
                display:false
            },
            {
                title: '操作',
                dataIndex: 'option',
                width: 100,
                key: 'option',
                render: (text, record) => {
                    let showAudit= record.qaStatus===1 && record.qaActive===0 && record.platform!==3;
                    let auditUrl=`/admin/order/OrderDetailIndex.html?orderCode=${record.orderCode}&from=list`;
                    let custAudit = <a onClick={this.editCustomer.bind(null,record)}>编辑</a>;

                    let option =new Array();

                    if(record.qaStatus!=2 && containsResource('DSC_ZHIBAO_TRADE_EDIT_CUSTOMERINFO')){
                        option.push (
                            <div>{custAudit}</div>
                       )
                    }
                    if(showAudit && containsResource('INSURANCE_TRADE_ACTIVE')){
                        option.push (<div>
                            <a target="_blank" href={auditUrl}>资料审核</a>
                        </div>)
                    }

                    return (<div>{option}</div>)
                }
            }]
        /**
         * 搜索框组件
         */


        if (this.stateAlready) {
            return (
                <div>
                    <h1>宽带预定-订单管理</h1>
                    <Form layout="inline"
                        className="ant-advanced-search-form"
                    >
                        <Row gutter={24}>{this.getFields()}</Row>

                        <Row gutter={24}>{this.getFieldsMore()}</Row>


                        {<Row>
                            <Col span={24} style={{ textAlign: 'right' }}>
                                <FormItem >
                                    <Button type="primary" onClick={this.handSubmit}>搜索</Button>
                                </FormItem>
                                <FormItem >
                                    <Button type="primary" onClick={this.handleReset}>清除</Button>
                                </FormItem>
                                <FormItem >
                                    <Button type="primary" onClick={this.handleExport}>导出</Button>
                                </FormItem>
                            </Col>
                        </Row>}
                    </Form>
                    <div>
                        <div className="table-content">
                            <Table key="shopCode" columns={columns}
                                   dataSource={this.state.list.items}
                                   rowKey="qaId" pagination={pagination}
                                   onChange={this.hanldeTableChange}
                                   bordered/>
                        </div>
                    </div>
                    <EditOrderCustModal editCustVisible={this.state.editCustVisible}
                                        handleCustomerSubmit={this.handleCustomerSubmit}
                                        handleCustomerCancel={this.handleCustomerCancel}
                                        orderInfo={this.state.orderInfo}/>

                </div>
            );
        }
        return null;
    }

}

BookOrderIndex = Form.create()(BookOrderIndex);
ReactDom.render(<div><BookOrderIndex></BookOrderIndex></div>, document.querySelector("#content"));
