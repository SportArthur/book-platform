import React from 'react';
import ReactDom from 'react-dom';
import SADPage from '@souche-f2e/sad';
import '../../../styles/index.less';
/*
 * 这里声明要引入的组件
 */
import { Form, Input,InputNumber, Button, Table, Pagination, Select, Modal, DatePicker } from 'antd';
import { RJAreaCascader } from '@souche-f2e/sad/components/RJAntd';
import {containsResource} from "../../utils/utils";
import AuthorizeModal from '../../../components/shopauthorize/Modal/AuthorizeModal'

const FormItem = Form.Item;


/**
 * 车商合同管理页面
 */
class ShopContractIndex extends SADPage {
    constructor() {
        super();
        this.state = {
            productForAdd:{},
            query:{},
            status: {}
        }
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
            this.state.query = query;
            this.state.page = 1;
            this.getList();
        })
    }
    /**
     * 清除查询条件
     */
    handleReset = () => {
        this.props.form.resetFields();
        this.setState({query: {}});
    }

    openAuth =(record)=>{
        this.state.productAuthorizeRecord=record;
        this.setState({authorizeVisible:true});
    }
    handleAuthorize = (data) => {
        this.state.productAuthorizeData=data;
        this.authorize().then(data => {
            if(data.success){
                this.getList();
            }
        });
    }
    handleCancelAuthorize = (e) => {
        this.setState({authorizeVisible:false});
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

        const columns = [
            {
                title: '合同编号',
                dataIndex: 'contractSerialNumber',
                key: 'contractSerialNumber',
                display:false
            },
            {
                title: '店铺类型',
                render: (text, record) => {
                    if(record.shopType == 'che168'){
                        return '车行168';
                    } else {
                        return '大风车';
                    }
                }
            },
            {
                title: '车商名称',
                dataIndex: 'shopName',
                key: 'shopName',
                display:false
            },
            {
                title: '签署电话',
                dataIndex: 'signPhone',
                key: 'signPhone',
                display:false
            },
            {
                title: '签署日期',
                dataIndex: 'dateCreate',
                key: 'dateCreate',
                display:false
            },
            {
                title: '授权状态',
                render: (text, record) => {
                    if(record.shopAuthStatus =='1'){
                        return <span>已授权</span>
                    }else{
                        return <span>未授权</span>
                    }
                }
            },
            {
                title: '操作',
                dataIndex: 'option',
                width: 100,
                key: 'option',
                render: (text, record) => {
                    let authBtn = <a onClick={this.openAuth.bind(null,record)}>授权</a>;
                    let downloadBtn = <a onClick={() => location.href = `http://zhibao.souche-inc.com/api/app/contract/orderContractView.html?contractNo=${record.contractSerialNumber}`}>下载</a>;
                    let financeProductBtn = <a onClick={() => location.href = `shopContractDetail.html?contractSerialNumber=${record.contractSerialNumber}`}>查看</a>;
                    let option = ( <div></div>);
                    if(record.shopAuthStatus!=null && record.shopAuthStatus==1){
                        option= (<div>
                            <div>{financeProductBtn}&nbsp;{downloadBtn}</div>
                        </div>)
                    }else{
                        option= (<div>
                            <div>{financeProductBtn}&nbsp;{containsResource('INSURANCE_AUTH_AUTH_PRODUCT')?authBtn:''}</div>
                        </div>)
                    }
                    return (<div>{option}</div>)
                }
            }]
        /**
         * 搜索框组件
         */
        let submitBtn = <Button type="primary" onClick={this.handSubmit}>搜索</Button>;
        let resetBtn = <Button type="primary" onClick={this.handleReset}>清除</Button>;
        let seachView = (
            <span>
                 <FormItem label="合同编号">
                            {
                                getFieldDecorator('contractSerialNumber', {
                                })(
                                    <Input  style={{ width: 200}} placeholder="请输入合同编号"/>
                                )
                            }
                 </FormItem>
                <FormItem label="车商名称">
                            {
                                getFieldDecorator('shopName', {
                                })(
                                    <Input  style={{ width: 200}} placeholder="请输入车商名称"/>
                                )
                            }
                 </FormItem>
                <FormItem label="签署电话">
                            {
                                getFieldDecorator('signPhone', {
                                })(
                                    <InputNumber  style={{ width: 200}} placeholder="请输入签署电话"/>
                                )
                            }
                 </FormItem>
                <FormItem label="店铺类型">
                    {
                        getFieldDecorator('shopType', {
                        })(
                            <Select style={{ width: 200 }} placeholder="请选择"
                            >
                                <Option key={null}>全部</Option>
                                <Option key={'store'}>大风车</Option>
                                <Option key={'che168'}>车行168</Option>
                            </Select>
                        )
                    }
                 </FormItem>
                <FormItem label="合同类型">
                    {
                        getFieldDecorator('contractType', {
                        })(
                            <Select style={{ width: 200 }} placeholder="请选择"
                            >
                                <Option key={null}>全部</Option>
                                <Option key={1}>中规车合同</Option>
                                <Option key={2}>平行进口车合同</Option>
                            </Select>
                        )
                    }
                 </FormItem>
                <FormItem label="签署时间">
                    {getFieldDecorator('start')(
                        <DatePicker placeholder="开始时间" format="YYYY-MM-DD" />
                    )}
                    {getFieldDecorator('end')(
                        <DatePicker placeholder="截止时间" format="YYYY-MM-DD" />
                    )}
                </FormItem>
                <FormItem label="授权状态">
                    {
                        getFieldDecorator('shopAuthStatus', {
                        })(
                            <Select style={{ width: 200 }} placeholder="请选择"
                            >
                                <Option key={null}>全部</Option>
                                <Option key={0}>未授权</Option>
                                <Option key={1}>已授权</Option>
                                <Option key={2}>授权已取消</Option>
                            </Select>
                        )
                    }
                 </FormItem>
                 <FormItem >
                    {submitBtn}
                 </FormItem>
                 <FormItem >
                    {resetBtn}
                 </FormItem>
            </span>

        );


        if (this.stateAlready) {
            return (
                <div>
                    <h1>车商合同管理</h1>
                    <br/><br/>
                    <Form layout="inline">
                        {seachView}
                    </Form>
                    <div>
                        <div className="table-content">
                            <Table columns={columns} dataSource={this.state.list.items} rowKey="productId" pagination={pagination}
                                   onChange={this.hanldeTableChange}
                                   bordered/>
                        </div>
                    </div>
                    <AuthorizeModal productAuthorizeRecord={this.state.productAuthorizeRecord}
                                    authorizeVisible={this.state.authorizeVisible}
                                    handleAuthorize={this.handleAuthorize}
                                    handleCancelAuthorize={this.handleCancelAuthorize}/>
                </div>
            );
        }
        return null;
    }

}

ShopContractIndex = Form.create()(ShopContractIndex);
ReactDom.render(<div><ShopContractIndex></ShopContractIndex></div>, document.querySelector("#content"));
