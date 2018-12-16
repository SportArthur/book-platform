import React from 'react';
import ReactDom from 'react-dom';
import SADPage from '@souche-f2e/sad';
import '../../../styles/index.less';

/*
 * 这里声明要引入的组件
 */
import { Popconfirm, Form, Input, Button, Table, Select, Modal,DatePicker,Row, Col} from 'antd';
import { RJAreaCascader ,RJSelect} from '@souche-f2e/sad/components/RJAntd';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;
import {
    convertAuthStatus
} from '../../utils/utils';

const resetAreaCascader = RJAreaCascader.resetAreaCascader

const {  RangePicker } = DatePicker;

const moment = require('moment');

/**
 * 店铺管理
 */
class BookShopIndex extends SADPage {
    constructor() {
        super();
        this.state = {
            query:{
                //authorization:2
            }
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

            this.state.query.id = query.id;
            this.state.query.shopCode = query.shopCode;
            this.state.query.shopName = query.shopName;
            this.state.query.shopPhone = query.shopPhone;
            this.state.query.authStatus = query.authStatus;
            this.state.page = 1;
            this.getList();
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

    handleAuth = (data) => {
        this.state.query.id=data;
        this.state.query.authStatus=1;
        this.handleAuthStatus().then(data => {
            if(data.success){
                this.getList();
            }
        });
    }
    handleCancel = (data) => {
        this.state.query.id=data;
        this.state.query.authStatus=2;
        this.handleAuthStatus().then(data => {
            if(data.success){
                this.getList();
            }
        });
    }

    // To generate mock Form.Item
    getFields() {
        const { getFieldDecorator } = this.props.form;
        const children = [];

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
            <Col span={6} key={'shopPhone'} >
            <FormItem label="店铺手机">
                {
                    getFieldDecorator('shopPhone', {
                    })(
                        <Input style={{ width: 200}} placeholder="店铺手机"/>
                    )
                }

            </FormItem>
            </Col>
        );
        children.push(
            <Col span={6} key={'shopName'} >
            <FormItem label="店铺名称">
                {
                    getFieldDecorator('buyerName', {
                    })(
                        <Input style={{ width: 200}} placeholder="店铺名称"/>
                    )
                }

            </FormItem>
            </Col>
        );
        children.push(
            <Col span={6} key={'authStatus'} >
            <FormItem label="授权状态">
                {
                    getFieldDecorator('authStatus', {
                    })(
                        <Select style={{ width: 200 }} placeholder="授权状态"
                        >
                            <Option key={null}>全部</Option>
                            <Option key={'0'}>未授权</Option>
                            <Option key={'1'}>已授权</Option>
                            <Option key={'2'}>已取消</Option>
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
                title: '店铺编号',
                dataIndex: 'id',
                key: 'id',
                display:false
            },
            {
                title: '店铺名称',
                dataIndex: 'shopName',
                key: 'shopName',
                display:false
            }, {
                title: '店铺地址',
                dataIndex: 'shopAddress',
                key: 'shopAddress',
                display:false
            },
            {
                title: '店铺老板名字',
                dataIndex: 'shopOwnerName',
                key: 'shopOwnerName',
                display:false
            },
            {
                title: '店铺老板电话',
                dataIndex: 'shopPhone',
                key: 'shopPhone',
                display:false
            },
            {
                title: '授权状态',
                dataIndex: 'authStatus',
                key: 'authStatus',
                display:false,
                render: (text, record) => {
                    return convertAuthStatus(record.authStatus);
                }
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
                title: '备注',
                dataIndex: 'remarks',
                key: 'remarks'
            },
            {
                title: '操作',
                dataIndex: 'option',
                width: 100,
                key: 'option',
                render: (text, record) => {
                    let authBtn = <Popconfirm title="确定吗?" onConfirm={() => this.handleAuth(record.id)}><a>授权</a></Popconfirm>;
                    let cancelBtn = <Popconfirm title="确定吗?" onConfirm={() => this.handleCancel(record.id)}><a>取消</a></Popconfirm>;

                    let option =new Array();
                    if(record.authStatus == 0 || record.authStatus == 2){
                        option.push(authBtn);
                    }
                    if(record.authStatus == 1){
                        option.push(cancelBtn);
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
                    <h1>宽带预定-店铺管理</h1>
                    <Form layout="inline"
                        className="ant-advanced-search-form"
                    >
                        <Row gutter={24}>{this.getFields()}</Row>

                        {<Row>
                            <Col span={24} style={{ textAlign: 'right' }}>
                                <FormItem >
                                    <Button type="primary" onClick={this.handSubmit}>搜索</Button>
                                </FormItem>
                                <FormItem >
                                    <Button type="primary" onClick={this.handleReset}>清除</Button>
                                </FormItem>
                                <FormItem >
                                    <Button type="primary">
                                        <a target="_blank" href="/admin/shop/addBookShop.html">新建</a>
                                    </Button>
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

                </div>
            );
        }
        return null;
    }

}

BookShopIndex = Form.create()(BookShopIndex);
ReactDom.render(<div><BookShopIndex></BookShopIndex></div>, document.querySelector("#content"));
