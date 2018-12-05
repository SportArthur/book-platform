import React from 'react';
import ReactDom from 'react-dom';
import SADPage from '@souche-f2e/sad';
import '../../../styles/index.less';
import { containsResource } from '../../utils/utils';

/*
 * 这里声明要引入的组件
 */
import { Form, Input, Button, Table, Select, Modal, DatePicker, Popconfirm} from 'antd';
import { RJAreaCascader } from '@souche-f2e/sad/components/RJAntd';

const FormItem = Form.Item;
const { Option } = Select;

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
 * 质保返佣规则页面
 */
class RebateRuleIndex extends SADPage {
    constructor() {
        super();
        this.state = {
            operation:{},
            query:{},
            status: {},
            page: 1,
            pageSize: 10,
            shopPage: 1,
            shopPageSize: 10,
            addShopVisible: false,
            shopList: {}
        }
    }

    /**
     * 切换分页
     * @param pagination
     */
    hanldeTableChange = (pagination) => {
        this.state.pageSize = pagination.pageSize;
        this.state.page = pagination.current;
        this.getByFilter();
    }

    /**
     * 搜索查询
     */
    handSubmit = () => {
        this.state.query = this.props.form.getFieldsValue();
        this.getByFilter().then(data => {
            if (data.success) {
                return;
            }
        });
    }

    /**
     * 上下架
     */
    changeStatus = (record, status) => {
        this.state.operation.id = record.id;
        this.state.operation.startTime = record.startTime;
        this.state.operation.endTime = record.endTime;
        this.state.operation.shopType = record.shopType;
        this.state.operation.shopModelList = record.shopModelList;
        this.state.operation.status = status;
        this.updateStatus().then(data => {
            this.getByFilter();
        });
    }

    /**
     * 清除查询条件
     */
    handleReset = () => {
        this.props.form.resetFields();
        this.setState({query: {}});
    }

    openAddShopDialog = (record) => {
        this.state.addShopVisible = true;
        this.state.currentActivity = record;
        this.getShopByFilter();
    }

    /**
     * 车商搜索查询
     */
    handleShopSearch = () => {
        let query = this.props.form.getFieldsValue();
        this.state.query.shopName = query.shopName;

        this.getShopByFilter().then(data => {
            if (data.success) {
                return;
            }
        });
    }

    handleShopCancel = () => {
        this.setState({
            addShopVisible: false,
            shops: []
        });
    }

    handleShopOk = () => {
        this.addShop().then(() => {
            this.setState({
                addShopVisible: false,
                shops: []
            });
        });
    }

    /**
     * 切换车商分页
     * @param pagination
     */
    handleShopTableChange = (pagination) => {
        this.state.shopPageSize = pagination.pageSize;
        this.state.shopPage = pagination.current;
        this.getShopByFilter();
    }

    /**
     *
     * @returns {*}
     */
    render() {
        const {getFieldDecorator} = this.props.form;
        let pagination = null;
        let shopPagination = null;
        let _this = null;
        let that = this;
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

        if (this.state.shopList) {
            shopPagination = {
                size: 'small',
                total: this.state.shopList.totalNumber,
                current: this.state.shopList.currentIndex,
                pageSize: this.state.shopList.pageSize,
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

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            }
        };

        const shopColumns = [
            {
                title: '车商名称',
                dataIndex: 'shopName',
                key: 'shopName'
            },
            {
                title: '店铺编号',
                dataIndex: 'shopCode',
                key: 'shopCode'
            },
            {
                title: '城市',
                dataIndex: 'cityName',
                key: 'cityName'
            }
        ];

        const rowSelection = {
            onSelect(record, selected, selectedRows) {
                // console.log(record);
                // console.log(selected);
                // console.log(selectedRows);
                let preShops = that.state.shops || [];

                if(selected){
                    preShops.push(record)
                }else{
                    preShops = preShops.filter(shop=>shop.shopCode!==record.shopCode)
                }

                that.setState({
                    shops : preShops
                });
            },
            onSelectAll(selected, selectedRows, changeRows) {
                // console.log(selected);
                // console.log(selectedRows);
                // console.log(changeRows);
                let preShops = that.state.shops || []
                // debugger
                if(selected){
                    //求并集
                    preShops = union(preShops,selectedRows,'shopCode')
                    // preShops = [...preShops,...selectedRows]
                }else{
                    preShops = deleteFromFirst2Second(preShops,changeRows,'shopCode')
                }
                that.setState({
                    shops : preShops
                })
            },
        };

        const columns = [
            {
                title: '活动名称',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: '图标',
                dataIndex: 'iconUrl',
                key: 'iconUrl',
                render: (record) => (<img style={{ width: 20}} src={record} />)
            },
            {
                title: '有效期',
                render: (text, record) => {
                    console.log(record);
                    return <span>{record.startTime.split(' ')[0]}到{record.endTime.split(' ')[0]}</span>
                }
            },
            {
                title: '促销类型',
                render: (text, record) => {
                    if(record.type =='0'){
                        return <span>满单折</span>
                    }else{
                        return <span>满额返</span>
                    }
                }
            },
            {
                title: '返佣内容',
                render: (text, record) => {
                    let returnDiv = <div></div>;
                    let list = record.activityDetailModelList;
                    for(var i = 0; i< list.length; i++){
                        if(record.type =='0'){
                            returnDiv = (<div>{returnDiv} {list[i].min}单-{list[i].max}单,打{list[i].discount}折<br/></div>);
                        }else{
                            returnDiv = (<div>{returnDiv} {list[i].min}元-{list[i].max}元,返{list[i].discount}元<br/></div>);
                        }
                    }
                    return returnDiv;
                }
            },
            {
                title: '创建时间',
                dataIndex: 'dateCreate',
                key: 'dateCreate'
            },
            {
                title: '状态',
                render: (text, record) => {
                    if(record.status =='0'){
                        return <span>未上架</span>
                    }else if(record.status == '1') {
                        return <span>已上架</span>
                    }else if(record.status == '2') {
                        return <span>已下架</span>
                    }
                }
            },
            {
                title: '操作',
                dataIndex: 'option',
                width: 150,
                key: 'option',
                render: (text, record) => {
                    let showDetailBtn = <a onClick={() => location.href = `rebateRuleInfo.html?id=${record.id}`}>查看</a>;
                    let onShelfBtn = <Popconfirm title="确定上架吗?" onConfirm={() => this.changeStatus(record, '1')}><a>上架</a></Popconfirm>
                    let offShelfBtn = <Popconfirm title="确定下架吗?" onConfirm={() => this.changeStatus(record, '2')}><a>下架</a></Popconfirm>
                    let addShopBtn = <a onClick={() => this.openAddShopDialog(record)}>添加车商</a>;
                    let option = null;
                    if(record.status == '0') {
                        option = (<div> {containsResource('DSC_ZHIBAO_REBATE_ONOFFSHELF')?onShelfBtn:''}
                                    &nbsp;{showDetailBtn} {record.shopType == '1' ? addShopBtn : ''}</div>);
                    }else if(record.status == '1'){
                        option = (<div> {containsResource('DSC_ZHIBAO_REBATE_ONOFFSHELF')?offShelfBtn:''}
                                    &nbsp;{showDetailBtn} {record.shopType == '1' ? addShopBtn : ''}</div>);
                    }else if(record.status == '2') {
                        let currentTime = moment();
                        let startTime = moment(record.startTime);
                        let canOn = startTime.valueOf() >= currentTime.valueOf() ? true : false;
                        // console.log(currentTime.valueOf());
                        // console.log(canOn);
                        option = (<div> {(containsResource('DSC_ZHIBAO_REBATE_ONOFFSHELF') && canOn) ? onShelfBtn : ''}
                                    &nbsp;{showDetailBtn} {(containsResource('DSC_ZHIBAO_REBATE_ONOFFSHELF') && canOn && record.shopType == '1') ? addShopBtn : ''}</div>);
                    }

                    return (<div>{option}</div>)
                }
            }]

        /**
         * 搜索框组件
         */
        let submitBtn = <Button type="primary" onClick={this.handSubmit}>搜索</Button>;
        let resetBtn = <Button type="primary" onClick={this.handleReset}>清除</Button>;
        let addBtn = <Button type="primary" size="large">
                        <a onClick={() => location.href = 'addRebateRule.html'}>新建</a>
                    </Button>;

        const addShopDialog = (
            <Modal title="选择车商"
                   width={700}
                   visible={this.state.addShopVisible}
                   onOk={this.handleShopOk}
                   onCancel={this.handleShopCancel}>
                <Form layout="inline">
                    <span>
                        <FormItem {...formItemLayout} label="车商名称">
                        {
                            getFieldDecorator('shopName')(
                                <Input placeholder="请输入车商名称" style={{marginLeft: 8}}/>
                            )
                        }
                    </FormItem>
                        <FormItem style={{marginLeft: 30}} label="省市">
                            <RJAreaCascader allowClear={true} showSearch={true} cascaderLevel={2}
                                            onProvinceChange={(v) => {
                                                this.state.query.provinceCode=v.key
                                            }}
                                            onCityChange={(v) => {
                                                this.state.query.cityCode=v.key
                                            }}/>
                        </FormItem>
                        <Button type="primary" onClick={this.handleShopSearch}>搜索</Button>
                    </span>
                    <div className="table-content">
                        <Table columns={shopColumns} dataSource={this.state.shopList.items} rowKey='shopCode'  pagination={shopPagination}
                               onChange={this.handleShopTableChange}
                               rowSelection={rowSelection}
                               bordered/>
                    </div>
                </Form>
            </Modal>);

        let firstSearchView = (
            <span>
                <FormItem label="活动名称">
                            {
                                getFieldDecorator('name', {
                                })(
                                    <Input  style={{ width: 200}} placeholder="请输入"/>
                                )
                            }
                 </FormItem>
                 <FormItem label="状态">
                            {
                                getFieldDecorator('status', {
                                })(
                                    <Select placeholder="全部" style={{ width: 200 }}>
                                        <Option value="">全部</Option>
                                        <Option value="0">未上架</Option>
                                        <Option value="1">已上架</Option>
                                        <Option value="2">已下架</Option>
                                    </Select>
                                )
                            }
                 </FormItem>
                 <FormItem label="规则类型">
                            {
                                getFieldDecorator('type', {
                                })(
                                    <Select placeholder="全部" style={{ width: 200 }}>
                                        <Option value="">全部</Option>
                                        <Option value="0">满单折</Option>
                                        <Option value="1">满额返</Option>
                                    </Select>
                                )
                            }
                 </FormItem>
                 <FormItem>
                    {submitBtn}
                 </FormItem>
                 <FormItem >
                    {resetBtn}
                 </FormItem>
                 <FormItem >
                     {containsResource('DSC_ZHIBAO_REBATE_ADD') ? addBtn : ''}
                 </FormItem>
            </span>

        );


        if (this.stateAlready) {
            return (
                <div>
                    <h1>质保-促销活动</h1>
                    <br/><br/>
                    <Form layout="inline">
                        {firstSearchView}
                    </Form>
                    {addShopDialog}
                    <div>
                        <div className="table-content">
                            <Table columns={columns} dataSource={this.state.list.items} rowKey="salesId" pagination={pagination}
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


RebateRuleIndex = Form.create()(RebateRuleIndex);
ReactDom.render(<div><RebateRuleIndex></RebateRuleIndex></div>, document.querySelector("#content"));
