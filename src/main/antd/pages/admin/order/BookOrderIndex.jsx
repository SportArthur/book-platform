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
    convertOrderStatus
} from '../../utils/utils';

const resetAreaCascader = RJAreaCascader.resetAreaCascader

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
            let bookTime=query.bookTime;
            if(bookTime!=null){
                this.state.query.bookTimeStart = bookTime[0].format('YYYY-MM-DD');
                this.state.query.bookTimeEnd = bookTime[1].format('YYYY-MM-DD');
            }

            this.state.query.id = query.id;
            this.state.query.shopCode = query.shopCode;
            this.state.query.buyerName = query.buyerName;
            this.state.query.buyerPhone = query.buyerPhone;
            this.state.query.orderStatus = query.orderStatus;
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

    handleInstall = (data) => {
        this.state.query.id=data;
        this.state.query.orderStatus=1;
        this.handleOrderStatus().then(data => {
            if(data.success){
                this.getList();
            }
        });
    }
    handleCancel = (data) => {
        this.state.query.id=data;
        this.state.query.orderStatus=2;
        this.handleOrderStatus().then(data => {
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
            <Col span={6} key={'id'} >
                <FormItem label="订单编号">
                    {
                        getFieldDecorator('id', {
                        })(
                            <Input style={{ width: 200}} placeholder="订单编号"/>
                        )
                    }
                </FormItem>
            </Col>
        );
        children.push(
            <Col span={6} key={'orderStatus'} >
            <FormItem label="订单状态">
                {
                    getFieldDecorator('orderStatus', {
                    })(
                        <Select style={{ width: 200 }} placeholder="订单状态"
                        >
                            <Option key={null}>全部</Option>
                            <Option key={'0'}>已预定</Option>
                            <Option key={'1'}>已服务</Option>
                            <Option key={'2'}>已关闭</Option>
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
            <Col span={6} key={'bookTime'} >
                <FormItem label="预定时间">

                    {getFieldDecorator('bookTime')(
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
                title: '订单编号',
                dataIndex: 'id',
                key: 'id',
                display:false
            },
            {
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
                title: '预定时间',
                dataIndex: 'bookTime',
                key: 'bookTime',
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
                display:false,
                render: (text, record) => {
                    return convertOrderStatus(record.orderStatus)
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
                    let installBtn = <Popconfirm title="确定吗?" onConfirm={() => this.handleInstall(record.id)}><a>已安装 </a></Popconfirm>;
                    let cancelBtn = <Popconfirm title="确定吗?" onConfirm={() => this.handleCancel(record.id)}><a>取消</a></Popconfirm>;

                    let option =new Array();
                    if(record.orderStatus == 0){
                        option.push(installBtn);
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
                    <h1>宽带预定-订单管理</h1>
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

BookOrderIndex = Form.create()(BookOrderIndex);
ReactDom.render(<div><BookOrderIndex></BookOrderIndex></div>, document.querySelector("#content"));
