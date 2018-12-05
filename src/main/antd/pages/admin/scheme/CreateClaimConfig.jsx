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

import CreateModal from '../../../components/scheme/Modal/CreateModal'

const moment = require('moment');

import { convertSchemeBusinessType } from '../../utils/utils';

/**
 * 车商合同管理页面
 */
class CreateClaimConfig extends SADPage {
    constructor() {
        super();
        this.state = {
            schemeInfo:{},
            claimConfig:{},
            query:{
            },
            createSchemeClaimVisible:false,
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
            this.state.query.productName = query.productName;
            this.state.query.expiresYear = query.expiresYear;
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
    }

    handleSaveCreateSchemeClaim = (data) => {
        this.state.claimConfig=data;
        this.save().then(data => {
            if(data.success){
                this.getList();
            }
        });
    }
    handleCancelCreateSchemeClaim = (e) => {
        this.setState({createSchemeClaimVisible:false});
    }

    openModAuth =(record)=>{
        this.state.schemeInfo=record;
        this.setState({createSchemeClaimVisible:true});
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
                title: '产品类型',
                dataIndex: 'qaName',
                key: 'qaName',
                display:false
            },
            {
                title: '产品名称',
                dataIndex: 'productName',
                key: 'productName',
                display:false
            },
            {
                title: '业务类型',
                dataIndex: 'businessType',
                key: 'businessType',
                display:false,
                render: (text, record) => {
                    return convertSchemeBusinessType(text)
                }
            },
            {
                title: '质保年限',
                dataIndex: 'expiresYear',
                key: 'expiresYear',
                display:false
            },
            {
                title: '基础价格(元)',
                dataIndex: 'basicPrice',
                key: 'basicPrice',
                display:false
            },
            {
                title: '排量下限含(L)	',
                dataIndex: 'engineVolumeDown',
                key: 'engineVolumeDown',
                display:false
            },
            {
                title: '排量上限含(L)	',
                dataIndex: 'engineVolumeUp',
                key: 'engineVolumeUp',
                display:false
            },
            {
                title: '操作',
                dataIndex: 'option',
                width: 150,
                key: 'option',
                render: (text, record) => {
                    let authModBtn = <a onClick={this.openModAuth.bind(null,record)}>创建预警</a>;
                    return (<div>{authModBtn}</div>)
                }
            }]
        /**
         * 搜索框组件
         */

        let seachView = (
            <span>

                <FormItem label="产品名称	">
                    {
                        getFieldDecorator('productName', {
                        })(
                            <Input  style={{ width: 200}} placeholder="产品名称"/>
                        )
                    }
                </FormItem>
                <FormItem label="质保年限">
                    {
                        getFieldDecorator('expiresYear', {
                        })(
                            <Select style={{ width: 200 }} placeholder="请选择"
                            >
                                <Option key={null}>所有</Option>
                                <Option key={"1"}>1年</Option>
                                <Option key={"2"}>2年</Option>
                                <Option key={"3"}>3年</Option>
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
                    <h1>质保-创建报修预警</h1>

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
                    <CreateModal schemeInfo={this.state.schemeInfo}
                                 createSchemeClaimVisible={this.state.createSchemeClaimVisible}
                                    handleSaveCreateSchemeClaim={this.handleSaveCreateSchemeClaim}
                                    handleCancelCreateSchemeClaim={this.handleCancelCreateSchemeClaim}/>

                </div>
            );
        }
        return null;
    }

}

CreateClaimConfig = Form.create()(CreateClaimConfig);
ReactDom.render(<div><CreateClaimConfig></CreateClaimConfig></div>, document.querySelector("#content"));
