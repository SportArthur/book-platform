import React from 'react';
import ReactDom from 'react-dom';
import SADPage from '@souche-f2e/sad';
import '../../../styles/index.less';

/*
 * 这里声明要引入的组件
 */
import { Form, Icon, Input,InputNumber, Button, Table, Pagination, Select, Checkbox, Modal, DatePicker, Row, Col, Popconfirm} from 'antd';
import { RJAreaCascader } from '@souche-f2e/sad/components/RJAntd';
import {Component} from 'react';
import { containsResource } from '../../utils/utils';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const { Option, OptGroup } = Select;
const { MonthPicker, RangePicker } = DatePicker;



const moment = require('moment');

/**
 * 维修商管理
 */
class MaintenanceManage extends SADPage {
    constructor() {
        super();
        this.state = {
            productForAdd: {},
            query: {},
            status: {},
            visible: false,
            addVisible: false,
            editingId: '',
            infoAdd: {},
            info: {},
            page: 1,
            pageSize: 10,
        }
    }

    /**
     * 切换分页
     * @param pagination
     */
    handleTableChange = (pagination) => {
        this.state.pageSize = pagination.pageSize;
        this.state.page = pagination.current;
        this.getByFilter();
    }

    /**
     * 搜索查询
     * @param e
     */
    handSubmit = () => {
        this.state.query = this.props.form.getFieldsValue();
        this.getByFilter().then(data => {
            if (data.success) {
                return;
            }
        });
    }

    handleExport = () => {
        var name = this.props.form.getFieldValue('name');
        name = name == undefined ? "" : name;
        var cityArray = this.props.form.getFieldValue('city');
        if(cityArray != null) {
            if(cityArray.length > 1) {
                var province = cityArray[0];
                var city = cityArray[1];
            }else {
                var province = cityArray[0];
            }
        }
        var contacts = this.props.form.getFieldValue('contacts');
        var contactPhone = this.props.form.getFieldValue('contactPhone');
        name = name == undefined ? "" : name;
        province = province == undefined ? "" : province;
        city = city == undefined ? "" : city;
        contacts = contacts == undefined ? "" : contacts;
        contactPhone = contactPhone == undefined ? "" : contactPhone;
        let exportUrl = `${this.baseUri}/admin/export/MaintenanceExcelExport.html?name=${name}&province=${province}`+
        `&city=${city}&contacts=${contacts}&contactPhone=${contactPhone}`
        window.location.href = exportUrl;
    }

    /**
     * 清除查询条件
     */
    handleReset = () => {
        this.props.form.resetFields();
        RJAreaCascader.resetAreaCascader();
        this.setState({query: {}});
    }

    /**
     * 删除选择的维修商
     */
    delete = (record) => {
        this.state.info.id = record.id;
        this.deleteMaintenance().then(data => {
            // 删除完重新加载主页面
            this.getList();
        });
    }

    // 数据筛选
    handleProvinceChange = (value) => {
        this.state.info.province = value.label;
        this.state.info.provinceCode = value.key;
    }

    handleCityChange = (value) => {
        this.state.info.city = value.label;
        this.state.info.cityCode = value.key;
    }

    showModal = (record) => {
        this.state.info.name = record.name;
        var array = new Array();
        array.push(record.provinceCode);
        array.push(record.cityCode);
        this.state.info.province = record.province;
        this.state.info.provinceCode = record.provinceCode;
        this.state.info.city = record.city;
        this.state.info.cityCode = record.cityCode;
        this.state.info.provinceCityCode = array;
        this.state.info.contacts = record.contacts;
        this.state.info.contactPhone = record.contactPhone;
        this.state.info.address = record.address;
        var carTypeArr;
        if(record.carType != null) {
            carTypeArr = record.carType.split(',');
        }
        this.state.info.carType = carTypeArr;
        this.state.info.id = record.id;
        this.setState({
            visible: true,
            showType: '编辑信息'
        });
    }

    handleAdd = () => {
        this.state.info = {};
        // RJAreaCascader.resetAreaCascader(true);
        RJAreaCascader.resetAreaCascader();
        this.setState({
            visible: true,
            showType: '新增',
            resetFields: true
        });
    }

    handleName = (e) => {
        this.state.info.name = e.target.value;
    }

    handleContacts = (e) => {
        this.state.info.contacts = e.target.value;
    }

    handleContactPhone = (e) => {
        this.state.info.contactPhone = e.target.value;
    }

    handleAddress = (e) => {
        this.state.info.address = e.target.value;
    }

    handleCarType = (e) => {
        this.state.info.carType = e;
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

        const columns = [
            {
                title: '序号',
                dataIndex: 'id',
                key: 'id',
                display:false
            },
            {
                title: '省份',
                dataIndex: 'province',
                key: 'province'
            },
            {
                title: '城市',
                dataIndex: 'city',
                key: 'city'
            },
            {
                title: '名称',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: '联系人',
                dataIndex: 'contacts',
                key: 'contacts'
            },{
                title: '联系方式',
                dataIndex: 'contactPhone',
                key: 'contactPhone'
            },{
                title: '联系地址',
                dataIndex: 'address',
                key: 'address'
            },{
                title: '维修车辆类型',
                dataIndex: 'carTypeStr',
                key: 'carTypeStr'
            },{
                title: '操作',
                dataIndex: 'option',
                width: 100,
                key: 'option',
                render: (text, record) => {
                    let editBtn = <a onClick={() => this.showModal(record)} style={{marinRight: 8}}>编辑</a>;
                    let deleteBtn = <Popconfirm title="确定删除吗?" onConfirm={() => this.delete(record)}><a>删除</a></Popconfirm>;

                    return (

                        <div>{containsResource('DSC_ZHIBAO_MAINTAIN_EDIT')?editBtn:''}&nbsp;&nbsp;{containsResource('DSC_ZHIBAO_MAINTAIN_DELETE')?deleteBtn:''}</div>
                    );
                }
            }]

        /**
         * 搜索框组件
         */
        let submitBtn = <Button type="primary" onClick={this.handSubmit}>搜索</Button>;
        let resetBtn = <Button onClick={this.handleReset}>清除</Button>;
        let firstSearchView = (
            <span>
                <FormItem label="名称">
                            {
                                getFieldDecorator('name', {
                                })(
                                    <Input  style={{ width: 200}} placeholder="请输入"/>
                                )
                            }
                 </FormItem>
                 <FormItem label="城市">
                            {
                                getFieldDecorator('city')(
                                    <RJAreaCascader
                                        allowClear={true}
                                        cascaderLevel={2}
                                    ></RJAreaCascader>
                                )
                            }
                 </FormItem>
                <FormItem label="联系人">
                            {
                                getFieldDecorator('contacts', {
                                })(
                                    <Input  style={{ width: 200}} placeholder="请输入"/>
                                )
                            }
                 </FormItem>
                <FormItem label="联系方式">
                            {
                                getFieldDecorator('contactPhone', {
                                })(
                                    <Input  style={{ width: 200}} placeholder="请输入"/>
                                )
                            }
                 </FormItem>
                <FormItem>
                    {submitBtn}
                 </FormItem>
                 <FormItem >
                    {resetBtn}
                 </FormItem>
            </span>
        );

        let thirdSearchView = (
            <div>
                {containsResource('DSC_ZHIBAO_MAINTAIN_ADD')?<Button type="primary" icon="plus" onClick={this.handleAdd}>新增</Button>:''}
                {containsResource('DSC_ZHIBAO_MAINTAIN_INPUT_OUTPUT')?<Button style={{marginLeft: 8}} onClick={this.handleExport}>导出Excel</Button>:''}
            </div>
        );

        if (this.stateAlready) {
            return (
                <div>
                    <h1>质保-维修商管理</h1>
                    <Form layout="inline" style={{"padding":"20px"}}>
                        {firstSearchView}
                    </Form>
                    <Form layout="inline" style={{"padding":"20px"}}>
                        {thirdSearchView}
                    </Form>
                    <MaintenanceDialog _this={this}/>
                    <div>
                        <div className="table-content">
                            <Table columns={columns} dataSource={this.state.list.items} rowKey="productId" pagination={pagination}
                                   onChange={this.handleTableChange}
                                   bordered/>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    }
}

class MaintenanceDialog extends Component {

    // 组件初始化
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
        }
    }

    handleOk = (record) => {
        this.state.openNumber = 0;
        let _this = this.props._this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            let flag = true;
            if(err) {
                for(var i in err) {
                    if(i == 'nameEdit' || i == 'provinceCityEdit' || i == 'contactsEdit' || i == 'contactPhoneEdit' ||
                        i == 'addressEdit' || i == 'carTypeEdit') {
                        flag = false;
                    }
                }
            }
            if(!err || flag) {
                this.state.info = _this.state.info;
                if(_this.state.showType == '新增') {
                    _this.addMaintenance().then(data => {
                        _this.setState({
                            visible: false
                        });
                        _this.getList();
                    });
                }else if(_this.state.showType == '编辑信息') {
                    _this.updateMaintenance().then(data => {
                        _this.setState({
                            visible: false
                        });
                        _this.getList();
                    });
                }
            }
        });
    }

    provinceCityValidator = (rule, value, callback) => {
        console.log(value);
        if (value == null || (value.length < 2)) {
            callback('请输入市');
        }
        callback();
    }

    handleCancel = () => {
        let _this = this.props._this;
        _this.setState({
            visible: false,
        });
        this.props.form.resetFields();
    }

    render() {
        let _this = this.props._this;

        const {getFieldDecorator} = this.props.form;
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
        if(_this.stateAlready) {
            console.log(_this.state);
            if(_this.state.resetFields) {
                this.props.form.resetFields();
                _this.state.resetFields = false;
            }
            return (<Modal title={_this.state.showType}
                           visible={_this.state.visible}
                           onOk={this.handleOk}
                           onCancel={this.handleCancel}>
                <Form>
                    <FormItem label="维修商名称" {...formItemLayout}>
                        {
                            getFieldDecorator('nameEdit', {
                                initialValue: _this.state.info.name,
                                rules: [{
                                    required: true, message: '请输入维修商名称',
                                }]
                            })(
                                <Input style={{ width: 200}} onChange={_this.handleName}/>
                            )
                        }
                    </FormItem>
                    <FormItem label="省市" {...formItemLayout}>
                        {
                            getFieldDecorator('provinceCityEdit', {
                                initialValue: _this.state.info.provinceCityCode,
                                rules:[{
                                    required: true, message: '请输入省'
                                }, {
                                    validator: this.provinceCityValidator
                                }]
                            })(
                                <RJAreaCascader
                                    allowClear
                                    cascaderLevel={2}
                                    onProvinceChange={_this.handleProvinceChange}
                                    onCityChange={_this.handleCityChange}
                                    defaultCode={_this.state.info.provinceCityCode}
                                ></RJAreaCascader>
                            )
                        }
                    </FormItem>
                    <FormItem label="联系人" {...formItemLayout}>
                        {
                            getFieldDecorator('contactsEdit', {
                                initialValue: _this.state.info.contacts,
                                rules:[{
                                    required: true, message: '请输入联系人',
                                }]
                            })(
                                <Input style={{width: 200}} onChange={_this.handleContacts}/>
                            )
                        }
                    </FormItem>
                    <FormItem label="联系方式" {...formItemLayout}>
                        {
                            getFieldDecorator('contactPhoneEdit', {
                                initialValue: _this.state.info.contactPhone,
                                rules: [{
                                    required: true, message: '请输入联系方式',
                                }]
                            })(
                                <Input style={{width: 200}} onChange={_this.handleContactPhone}/>
                            )
                        }
                    </FormItem>
                    <FormItem label="联系地址" {...formItemLayout}>
                        {
                            getFieldDecorator('addressEdit', {
                                initialValue: _this.state.info.address,
                                rules: [{
                                    required: true, message: '请输入联系地址',
                                }]
                            })(
                                <Input style={{width: 200}} onChange={_this.handleAddress}/>
                            )
                        }
                    </FormItem>
                    <FormItem label="维修车辆类别" {...formItemLayout}>
                        {
                            getFieldDecorator('carTypeEdit', {
                                initialValue: _this.state.info.carType,
                                rules: [{
                                    required: true, message: '请输入维修车辆类别',
                                }]
                            })(
                                <Checkbox.Group style={{ width: '100%' }} onChange={_this.handleCarType}>
                                    <Row>
                                        <Col span={4}><Checkbox value="0">低端</Checkbox></Col>
                                        <Col span={4}><Checkbox value="1">中端</Checkbox></Col>
                                        <Col span={4}><Checkbox value="2">高端</Checkbox></Col>
                                        <Col span={4}><Checkbox value="3">BBA及以上车型</Checkbox></Col>
                                    </Row>
                                </Checkbox.Group>
                            )
                        }
                    </FormItem>
                </Form>
            </Modal>);
        }
        return null;
    }
}

MaintenanceManage = Form.create()(MaintenanceManage);
MaintenanceDialog = Form.create()(MaintenanceDialog);
ReactDom.render(<div><MaintenanceManage></MaintenanceManage></div>, document.querySelector("#content"));
