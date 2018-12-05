import React from 'react';
import ReactDom from 'react-dom';
import SADPage from '@souche-f2e/sad';
import '../../../styles/index.less';
import { containsResource } from '../../utils/utils';

/*
 * 这里声明要引入的组件
 */
import { Form, Input, Button, Table, Select, Modal } from 'antd';
import { RJAreaCascader ,RJSelect} from '@souche-f2e/sad/components/RJAntd';
import {Component} from 'react';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;

import AuthorizeModal from '../../../components/shopauthorize/Modal/AuthorizeModal'
import AuthorizeHistoryModal from '../../../components/shopauthorize/Modal/AuthorizeHistoryModal'

const moment = require('moment');

const resetAreaCascader = RJAreaCascader.resetAreaCascader

/**
 * 车商合同管理页面
 */
class ShopAuthorizeIndex extends SADPage {
    constructor() {
        super();
        this.state = {
            productAuthorizeData:{},
            productAuthorizeRecord:{},
            query:{
                //authorization:2
            },
            authorizeVisible:false,
            authorizeHistoryVisible:false,
            productAuthorizeHistoryList:[]
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
            this.state.query.queryCondition = query.queryCondition;
            this.state.query.authorization = query.authorization;
            this.state.query.shopType = query.shopType;
            this.state.page = 1;
            this.getList();
        })
    }
    /**
     * 清除查询条件
     */
    handleReset = () => {
        this.setState({query: {}});
        this.props.form.resetFields();
        resetAreaCascader();
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

    handleCloseHistoryAuthorize =(e)=>{
        this.setState({authorizeHistoryVisible:false});
    }

    openAuth =(record)=>{
        this.state.productAuthorizeRecord=record;
        this.setState({authorizeVisible:true});
    }
    openModAuth =(record)=>{
        this.state.productAuthorizeRecord=record;
        this.setState({authorizeVisible:true});
    }

    cancelAuthorizationCallback =(record)=>{
        this.state.productAuthorizeRecord=record;
        this.cancelAuthorization().then(data => {
            if(data.success){
                this.getList();
            }
        });
    }
    openCancelAuth =(record,callback)=>{
        confirm({
            title: '确认取消店铺授权吗?',
            content: '取消后店铺将无法销售质保',
            onOk() {
                callback(record);
            }
        });
    }


    openMemberCallBack =(record)=>{
        this.state.productAuthorizeRecord=record;
        this.authorizeMember().then(data => {
            if(data.success){
                this.getList();
            }
        });
    }
    cancelMemberCallBack =(record)=>{
        this.state.productAuthorizeRecord=record;
        this.cancelMember().then(data => {
            if(data.success){
                this.getList();
            }
        });
    }
    openMember =(record,callback)=>{
        confirm({
            title: '确认开通店铺会员吗?',
            content: '确认开通店铺会员',
            onOk() {
                callback(record);
            }
        });
    }

    openCancelMember =(record,callback)=>{
        confirm({
            title: '确认取消店铺会员吗?',
            content: '确认取消店铺会员',
            onOk() {
                callback(record);
            }
        });
    }

    openHistAuth =(record)=>{
        //this.setState({authorizeHistoryVisible:true});
        this.state.productAuthorizeRecord=record;
        this.authorizeHistory()

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
                pageSizeOptions: ['10', '15', '20'],
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
                title: '店铺编码',
                dataIndex: 'shopCode',
                key: 'shopCode',
                display:false
            },
            {
                title: '店铺名称',
                dataIndex: 'shopName',
                key: 'shopName',
                display:false
            },
            {
                title: '店铺简称',
                dataIndex: 'shopShortName',
                key: 'shopShortName',
                display:false
            },
            {
                title: '店铺城市',
                dataIndex: 'cityName',
                key: 'cityName',
                display:false
            },
            {
                title: '店铺类型',
                dataIndex: 'shopType',
                key : 'shopType',
                render: (text, render) => {
                    if(render.shopType == 'store') {
                        return ('大风车店铺');
                    }else if(render.shopType == 'che168') {
                        return ('车行168店铺');
                    }
                }
            },
            {
                title: '代理商角色',
                dataIndex: 'shopRole',
                key: 'shopRole',
                display:false,
                render: (text, render) => {
                    if(render.shopRole == 'general') {
                        return ('普通车商');
                    }else if(render.shopRole == 'proxyMerchant') {
                        return ('代理车商');
                    }else{
                        return "-"
                    }
                }
            },
            {
                title: '普通车商折扣%',
                dataIndex: 'generalRoleDiscount',
                key: 'generalRoleDiscount',
                display:false
            },
            {
                title: '代理商折扣%',
                dataIndex: 'proxyMerchantRoleDiscount',
                key: 'proxyMerchantRoleDiscount',
                display:false
            },
            {
                title: '风险系数',
                dataIndex: 'riskRatio',
                key: 'riskRatio',
                display:false
            },
            {
                title: '授权状态',
                dataIndex: 'authStatusDesc',
                key: 'authStatusDesc',
                display:false
            },
            {
                title: '授权时间',
                dataIndex: 'dateCreate',
                key: 'dateCreate',
                display:false
            },
            {
                title: '协议状态(中规车)',
                dataIndex: 'signContractStatus',
                key: 'signContractStatus',
                display:false
            },
            {
                title: '协议状态(平行进口车)',
                dataIndex: 'signContractStatusParallelImportCar',
                key: 'signContractStatusParallelImportCar',
                display:false
            },{
                title: '会员状态',
                dataIndex: 'isMember',
                key: 'isMember',
                display:false,
                render: (text, record) => {
                    if(text==null ||text==''){
                        return "-";
                    }else{
                        if(text=='Y'){
                            return "已开通";
                        }else{
                            return "未开通";
                        }
                    }
                }
            },
            {
                title: '操作',
                dataIndex: 'option',
                width: 150,
                key: 'option',
                render: (text, record) => {
                    console.log(record);
                    let memberBtn=<div></div>;
                    if(record.shopType=='store' && record.isMember=='Y'){
                         memberBtn = <a onClick={this.openCancelMember.bind(null,record,this.cancelMemberCallBack)}>取消会员</a>;
                    }else if(record.shopType=='store' && record.isMember=='N'){
                        memberBtn = <a onClick={this.openMember.bind(null,record,this.openMemberCallBack)}>开通会员</a>;
                    }
                    let authBtn = <a onClick={this.openAuth.bind(null,record)}>授权</a> ;
                    let authModBtn = <a onClick={this.openModAuth.bind(null,record)}>修改</a>;
                    let cancelBtn = <a onClick={this.openCancelAuth.bind(null,record,this.cancelAuthorizationCallback)}>取消授权</a>;
                    let authHistoryBtn = <a onClick={this.openHistAuth.bind(null,record)}>操作历史</a>;
                    let option = ( <div></div>);
                    if(record.id!=null && record.id!=0){
                        option= (<div>
                            <div>{containsResource('DSC_ZHIBAO_AUTH_EDIT')?authModBtn:''}&nbsp;{containsResource('INSURANCE_AUTH_UNAUTH_PRODUCT')?cancelBtn:''}&nbsp;{containsResource('DSC_ZHIBAO_AUTH_QUERY_HISTORY')?authHistoryBtn:''}</div>
                            <div>{containsResource('INSURANCE_AUTH_AUTH_PRODUCT')? memberBtn :''}</div>
                        </div>)
                    }else{
                        option= (<div>
                            <div>{containsResource('INSURANCE_AUTH_AUTH_PRODUCT')? authBtn :''} </div>
                        </div>)
                    }
                    return (<div>{option}</div>)
                }
            }]
        /**
         * 搜索框组件
         */

        let seachView = (
            <span>
                 <FormItem label="店铺类型">
                    {
                        getFieldDecorator('shopType', {
                            initialValue:"store"
                        })(
                            <Select style={{ width: 200 }} placeholder="请选择">
                                <Option key={"store"}>大风车店铺</Option>
                                <Option key={"che168"}>车行168店铺</Option>
                            </Select>
                        )
                    }
                 </FormItem>
                <FormItem label="店铺名称">
                    {
                        getFieldDecorator('queryCondition', {
                        })(
                            <Input  style={{ width: 200}} placeholder="店铺名称"/>
                        )
                    }
                </FormItem>
                <FormItem label="城市">
                    <RJAreaCascader allowClear={true} showSearch={true} cascaderLevel={2}
                      onProvinceChange={(v) => {
                          this.state.query.provinceCode=v.key
                      }}
                      onCityChange={(v) => {this.state.query.cityCode=v.key}}/>
                </FormItem>

                <FormItem label="授权状态">
                    {
                        getFieldDecorator('authorization', {
                        })(
                            <Select style={{ width: 200 }} placeholder="请选择"
                            >
                                <Option key={0}>全部</Option>
                                <Option key={1}>未授权</Option>
                                <Option key={2}>已授权</Option>
                            </Select>
                        )
                    }
                 </FormItem>

                 <FormItem >
                   <Button type="primary" onClick={this.handSubmit}>搜索</Button>
                 </FormItem>
                 <FormItem >
                   <Button type="primary" onClick={this.handleReset}>清除</Button>
                 </FormItem>
            </span>
        );

        if (this.stateAlready) {
            return (
                <div>
                    <h1>质保-店铺授权管理</h1>

                    <Form layout="inline">
                        {seachView}
                    </Form>
                    <Form layout="inline">
                        <FormItem>

                        </FormItem>
                    </Form>
                    <div>
                        <div className="table-content">
                            <Table key="shopCode" columns={columns}
                                   dataSource={this.state.list.items}
                                   rowKey="productId" pagination={pagination}
                                   onChange={this.hanldeTableChange}
                                   bordered/>
                        </div>
                    </div>
                    <AuthorizeModal productAuthorizeRecord={this.state.productAuthorizeRecord}
                                    authorizeVisible={this.state.authorizeVisible}
                                    handleAuthorize={this.handleAuthorize}
                                    handleCancelAuthorize={this.handleCancelAuthorize}/>
                    <AuthorizeHistoryModal authorizeHistoryVisible={this.state.authorizeHistoryVisible}
                                           handleCloseHistoryAuthorize={this.handleCloseHistoryAuthorize}
                                           productAuthorizeHistoryList={this.state.productAuthorizeHistoryList}/>
                </div>
            );
        }
        return null;
    }

}

ShopAuthorizeIndex = Form.create()(ShopAuthorizeIndex);
ReactDom.render(<div><ShopAuthorizeIndex></ShopAuthorizeIndex></div>, document.querySelector("#content"));
