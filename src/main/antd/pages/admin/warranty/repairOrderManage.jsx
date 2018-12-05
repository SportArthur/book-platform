import React from 'react';
import ReactDom from 'react-dom';
import SADPage from '@souche-f2e/sad';
import '../../../styles/index.less';
import {
    containsResource,
    getCurrentLoginUserId,
    convertWarrantyStatus,
    convertWarrantyRepairMode,
    convertPlatform,
    convertQaStatus,
    convertCarType,
    convertExtInsureStatus
} from '../../utils/utils';

/*
 * 这里声明要引入的组件
 */
import { Form, Icon, Input,InputNumber, Button, Table, Pagination, Select,Col,Row, Checkbox, Modal, DatePicker} from 'antd';
import { RJAreaCascader, RJImgUploader } from '@souche-f2e/sad/components/RJAntd';
import {Component} from 'react';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const { Option, OptGroup } = Select;
const { MonthPicker, RangePicker } = DatePicker;

const moment = require('moment');

/**
 * 质保报修管理
 */
class RepairOrderManage extends SADPage {
    constructor() {
        super();
        this.state = {
            productForAdd:{},
            query:{},
            status: {},
            visible: false,
            addVisible: false,
            addInfoVisible: false,
            endAuditVisible: false,
            addSearch: '',
            editingKey: '',
            creator: '',
            infoAdd: {},
            selectedId: '',
            page: 1,
            pageSize: 10
        }
    }

    /**
     * 切换分页
     * @param pagination
     */
    hanldeTableChange = (pagination) => {
        this.state.pageSize = pagination.pageSize;
        this.state.page = pagination.current;
        this.state.query = this.props.form.getFieldsValue();
        this.getByFilter().then(data => {
            if (data.success) {
                return;
            }
        });
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

    /**
     * 清除查询条件
     */
    handleReset = () => {
        this.props.form.resetFields();
        this.setState({query: {}});
    }

    // 数据筛选
    handleProvinceChange = (value) => {
        this.state.infoAdd.province = value.label;
        this.state.infoAdd.provinceCod = value.key;
    }
    handleCityChange = (value) => {
        this.state.infoAdd.city = value.label;
        this.state.infoAdd.cityCode = value.key;
    }

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }

    showModal = (record) => {
        this.setState({
            visible: true,
            editingKey: record.key
        });
    }

    handleOk = (record) => {
        this.setState({
            visible: false
        });
    }

    handleAddCancel = () => {
        this.setState({
            addVisible: false,
        });
    }

    handleAddInfoCancel = () => {
        this.setState({
            addInfoVisible: false,
        });
    }

    handleAddOk = (record) => {
        this.setState({
            addVisible: false
        });
    }

    handleAddInfoOk = () => {
        const { getFieldsValue } = this.props.form;
        this.state.infoAdd.customerName = getFieldsValue().addName;
        this.state.infoAdd.customerPhone = getFieldsValue().addPhone;
        this.state.infoAdd.mileage = getFieldsValue().addMileage;
        this.state.infoAdd.carAddr = getFieldsValue().addCarAddr;
        this.state.infoAdd.malfunctionInfo = getFieldsValue().addMalfunctionInfo;
        this.props.form.validateFieldsAndScroll(err => {
            if(err) {
                for(var i in err) {
                    if(i == 'addName' || i == 'addPhone' || i == 'addMileage' || i == 'addProvinceCity' ||
                        i == 'addMalfunctionInfo') {
                        return;
                    }
                }
            }
            this.review().then(() => {
                this.state.addInfoVisible = false;
                this.state.addVisible = false;
                RJAreaCascader.resetAreaCascader();
                this.props.form.resetFields();
                this.getByFilter();
            });
        });
    }

    onChangeCustomer = (e) => {
        this.setState({
            creator: e.target.value
        });
    }

    openCreateWarrantyDialog = () => {
        this.setState({
            addVisible: true
        });
    }

    openCreateWarrantyInfoDialog = (e) => {
        this.state.infoAdd.qaId = e+'';
        this.setState({
            addInfoVisible: true
        });
    }

    onChangeAddSearch = (e) => {
        this.setState({
           addSearch: e.target.value
        });
    }

    handleAddSearch = () => {
        this.queryListByVinOrPhone();
    }

    handleExport = () => {
        const {getFieldValue} = this.props.form;
        let type = getFieldValue('type');
        let vin = getFieldValue('vin');
        let customerName = getFieldValue('customerName');
        let buyerPhone = getFieldValue('buyerPhone');
        let validTime = getFieldValue('validTime');
        let start = validTime == undefined ? '' : validTime[0];
        let end = validTime == undefined ? '' : validTime[1];
        let status = getFieldValue('status');
        let extInsureChanceStatus = getFieldValue('extInsureChanceStatus');
        let repairResult = getFieldValue('repairResult');
        let isMember=getFieldValue('isMember');
        isMember = isMember == undefined ? '' : isMember;
        vin = vin == undefined ? '' : vin;
        customerName = customerName == undefined ? '' : customerName;
        buyerPhone = buyerPhone == undefined ? '' : buyerPhone;
        let exportUrl = `${this.baseUri}/admin/export/WarrantyExcelExport.html?vin=${vin}&customerName=${customerName}&type=${type}` +
            `&buyerPhone=${buyerPhone}&start=${start}&end=${end}&status=${status}&repairResult=${repairResult}&isMember=${isMember}&extInsureChanceStatus=${extInsureChanceStatus}`
        window.location.href = exportUrl;
    }

    handleEndAudit = (id) => {
        this.setState({
            endAuditVisible: true,
            selectedId: id
        });
    }

    handleEndAuditOk = () => {
        const { getFieldValue } = this.props.form;
        this.props.form.validateFieldsAndScroll((errors => {
            if(errors) {
                for(var i in errors) {
                    if(i == 'settlementAmount' || i == 'uploadProofImages') {
                        return;
                    }
                }
            }
            this.state.settlementAmount = getFieldValue('settlementAmount');
            this.state.uploadProofImages = getFieldValue('uploadProofImages');
            this.state.remark = getFieldValue('remark');
            if(typeof this.state.uploadProofImages == 'string' && this.state.uploadProofImages.length > 0) {
                this.state.uploadProofImages = new Array(this.state.uploadProofImages);
            }
            this.state.uploadProofImages = this.state.uploadProofImages.join(',');
            this.finishReview().then(data => {
                this.setState({
                    endAuditVisible: false
                });
                this.getList();
            });
        }));
    }

    handleEndAuditCancel = () => {
        this.setState({
            endAuditVisible: false
        });
    }

    provinceCityValidator = (rule, value, callback) => {
        if (value == null || (value.length < 2)) {
            callback('请输入市');
        }
        callback();
    }

    onChangeCover = (images) => {
        this.props.form.setFieldsValue({
            uploadProofImages: images
        });
    }

    getFields()
    {
        const {getFieldDecorator} = this.props.form;
        const children = [];
        children.push(
            <Col span={6} key={'vin'} >
                <FormItem label="VIN码">
                    {
                        getFieldDecorator('vin', {
                        })(
                            <Input  style={{ width: 200}} placeholder="请输入"/>
                        )
                    }
                </FormItem>
            </Col>
        );
        children.push(
            <Col span={6} key={'customerName'} >
                <FormItem label="姓名">
                    {
                        getFieldDecorator('customerName', {
                        })(
                            <Input style={{ width: 200}} placeholder="请输入"/>
                        )
                    }
                </FormItem>
            </Col>
        );
        children.push(
            <Col span={6} key={'buyerPhone'} >
                <FormItem label="联系方式">
                    {
                        getFieldDecorator('buyerPhone', {
                        })(
                            <Input  style={{ width: 200}} placeholder="请输入"/>
                        )
                    }
                </FormItem>
            </Col>
        );

        children.push(
            <Col span={6} key={'type'} >
                <FormItem label="订单类型">
                    {
                        getFieldDecorator('type', {
                            initialValue: ''
                        })(
                            <Select style={{ width: 200 }}>
                                <Option value="">全部</Option>
                                <Option value="2">大风车</Option>
                                <Option value="1">车牛</Option>
                                <Option value="3">弹个车</Option>
                                <Option value="4">卖车管家</Option>
                            </Select>
                        )
                    }
                </FormItem>
            </Col>
        );
        children.push(
            <Col span={6} key={'isMemeber'} >
                <FormItem label="会员报修">
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
            <Col span={6} key={'status'} >
                <FormItem label="报修状态">
                    {
                        getFieldDecorator('status',{
                            initialValue: ''
                        })(
                            // 报修状态 保养理赔审核流程状态 0开始理赔","1待审核","2审核不通过","3金额待审核","4,金额审核通过","5结案"
                            <Select placeholder="请选择" style={{ width: 200 }}>
                                <Option value="">全部</Option>
                                <Option value="0">处理中</Option>
                                <Option value="1">待审核</Option>
                                <Option value="2">审核不通过</Option>
                                <Option value="3">金额待审核</Option>
                                <Option value="4">待结算</Option>
                                <Option value="5">结案</Option>
                            </Select>
                        )
                    }
                </FormItem>
            </Col>
        );

        children.push(
            <Col span={6} key={'repairResult'}>
                <FormItem label="理赔结果">
                    {
                        getFieldDecorator('repairResult',{
                            initialValue: ''
                        })(
                            // 保修模式0待查定1正常理赔， 3免赔，2拒赔
                            <Select placeholder="请选择" style={{ width: 200 }}>
                                <Option value="">全部</Option>
                                <Option value="0">待查定</Option>
                                <Option value="1">正常理赔</Option>
                                <Option value="2">拒赔</Option>
                                <Option value="3">免赔</Option>
                            </Select>
                        )
                    }
                </FormItem>
            </Col>
        );

        children.push(
            <Col span={6} key={'qaType'}>
                <FormItem label="车辆类型">
                    {
                        getFieldDecorator('qaType',{
                            initialValue: ''
                        })(
                            <Select placeholder="请选择" style={{ width: 200 }}>
                                <Option value="">全部</Option>
                                <Option value="1">中规车</Option>
                                <Option value="2">平行进口车</Option>
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
            <Col span={8} key={'validTime'} >
                <FormItem label="报案日期">
                    {
                        getFieldDecorator('validTime')(
                            <RangePicker format="YYYY-MM-DD" />
                        )
                    }
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
                title: '报案日期',
                dataIndex: 'dateCreate',
                key: 'dateCreate',
                display:false
            }, {
                title: '订单类型',
                dataIndex: 'platform',
                key: 'platform',
                width:100,
                render: (text, record) => {
                    return (<div>{convertPlatform(record.orderModel.platform)}</div>);
                }
            },{
                title: '车型',
                dataIndex: 'carName',
                key: 'carName',
                width:100,
                render: (text, record) => {
                    return (<div>{record.orderModel.carName}</div>);
                }
            },
            {
                title: '车辆类型',
                dataIndex: 'carType',
                key: 'carType',
                width: 100,
                render: (text, record) => {
                    return (<div>{convertCarType(record.orderModel.qaType)}</div>);
                }
            },
            {
                title: 'VIN码',
                dataIndex: 'vin',
                key: 'vin',
                render: (text, record) => {
                    return (<div>{record.orderModel.vin}</div>);
                }
            }, {
                title: '报修所在地',
                dataIndex: 'province',
                key: 'province',
                width:200,
                render: (text, record) => {
                    return (<div>{record.province}&nbsp;{record.city}&nbsp;{record.carAddr}</div>);
                }
            }, {
                title: '会员报修',
                dataIndex: 'isMember',
                key: 'isMember',
                width:100,
                render: (text, record) => {
                    if (record.orderModel.isMember == 'Y') {
                        return "是";
                    } else {
                        return "否";
                    }
                }
            }, {
                title: '报案人',
                dataIndex: 'buyer',
                key: 'buyer',
                render: (text, record) => {
                    return (<div>{record.customerName}<br/>{record.phone}</div>);
                }
            }, {
                title: '故障部位',
                dataIndex: 'breakDownsShow',
                key: 'breakDownsShow',
                render: (text, record) => {
                    let breakDownsShow = record.breakDownsShow.join(',');
                    return (<div>{breakDownsShow}</div>);
                }
            }, {
                title: '理赔结果',
                dataIndex: 'repairMode',
                key: 'repairMode',
                render: (text, record) => {
                    return (<div>{convertWarrantyRepairMode(text)}</div>);
                }
            }, {
                title: '报修状态',
                dataIndex: 'status',
                key: 'status',
                render: (text, record) => {
                    return (<div>{convertWarrantyStatus(text)}</div>);
                }
            },  {
                title: '结案时间',
                dataIndex: 'finishTime',
                key: 'finishTime'

            }, {
                title: '延保状态',
                dataIndex: 'orderModel.extInsureChanceStatus',
                key: 'orderModel.extInsureChanceStatus',
                display:false,
                render: (text, record) => {
                    return <div>
                        <div>{convertExtInsureStatus(text)}</div>
                    </div>;
                }
            }, {
                title: '操作',
                dataIndex: 'option',
                width: 100,
                key: 'option',
                render: (text, record) => {
                    let showBtn;

                    if((record.status == 0 || record.status == 2) && containsResource('INSURANCE_WARRANTY_SCHAME_FORMULATION') &&
                            getCurrentLoginUserId(record.handlerId)) {
                        showBtn = <a onClick={() => location.href = `claims.html?id=${record.id}`}>理赔</a>;
                    }else if(record.status == 1 && containsResource('INSURANCE_WARRANTY_SCHAME_AUDIT') && record.showAuditButton) {
                        showBtn = <a onClick={() => location.href = `claimOrderCheck.html?id=${record.id}`}>方案审核</a>;
                    }else if(record.status == 3 && containsResource('INSURANCE_WARRANTY_MONEY_AUDIT') && record.showAuditButton) {
                        showBtn = <a onClick={() => location.href = `claimOrderCheck.html?id=${record.id}`}>金额审核</a>;
                    }else if(record.status == 4 && containsResource('INSURANCE_WARRANTY_SCHAME_FORMULATION')) {
                        showBtn = <a onClick={() => this.handleEndAudit(record.id)}>上传凭证</a>;
                    }
                    let catBtn = <a onClick={() => location.href = `viewWarranty.html?id=${record.id}`}>查看</a>;

                    let option = (<div>
                        <div>{showBtn} {catBtn}</div>
                    </div>);
                    return (
                        <div>{option}</div>
                    );
                }
            }]

        const addColumns = [
            {
                title: '客户信息',
                dataIndex: 'buyerInfo',
                key: 'buyerInfo',
                render: (text, record) => {
                    return (<div>{record.buyerName}<br/>{record.buyerPhone}</div>);
                }
            },
            {
                title:'车辆信息',
                dataIndex:'carInfo',
                key: 'carInfo',
                render: (text, record) => {
                    return (<div>{record.carName}<br/>VIN码:{record.vin}</div>);
                }
            },
            {
                title: '质保信息',
                dataIndex: 'insuranceInfo',
                key: 'insuranceInfo',
                render: (text, record) => {
                    let schemePrice = (<div>{record.insuranceOrderSchemeInfo ? record.insuranceOrderSchemeInfo.basicPrice : ''}元</div>);
                    if(record.insuranceOrderSchemeInfo) {
                        return (<div>{convertQaStatus(record.qaActive)}<br/>{record.insuranceOrderSchemeInfo ? record.insuranceOrderSchemeInfo.productName : ''}<br/>
                            {schemePrice}</div>);
                    }
                    return (<div>{convertQaStatus(record.qaActive)}<br/>{record.insuranceOrderSchemeInfo ? record.insuranceOrderSchemeInfo.productName : ''}<br/>
                        </div>);
                }
            },
            {
                title: '操作',
                dataIndex: 'option',
                key: 'option',
                render: (text, record) => {
                    if(record.qaActive == 1) {
                        return (<div><a onClick={() => this.openCreateWarrantyInfoDialog(record.qaId)}>创建报修</a></div>);
                    }else {
                        return (<div>-</div>);
                    }
                }
            }
        ]

        /**
         * 搜索框组件
         */
        let createWarrantyInfo = <Button type="primary" onClick={this.openCreateWarrantyDialog}>创建报修信息</Button>;
        let warrantyDialog;
        let warrantyInfoDialog;
        let uploadProofDialog;
        let imgUploadUrl = `${this.baseUri}/api/CommonApi/uploadNew.json`;
        if(this.stateAlready) {
            warrantyDialog = (
                <Modal title="创建报修"
                       width={600}
                       visible={this.state.addVisible}
                       onOk={this.handleAddOk}
                       onCancel={this.handleAddCancel}>
                    <Form>
                        <FormItem {...formItemLayout}>
                            {
                                <Input style={{ width: 400}} onChange={this.onChangeAddSearch}
                                       placeholder={'请输入：客户电话/质保合同号/VIN码后六位，任意一种匹配质保信息'}/>
                            }
                            <Button type="primary" onClick={this.handleAddSearch}>查询</Button>
                        </FormItem>
                        <div className="table-content">
                            <Table columns={addColumns} dataSource={this.state.addList.items} size={"small"}
                                   bordered/>
                        </div>
                    </Form>
                </Modal>);

            warrantyInfoDialog = (
                <Modal title={'报修信息'}
                       width={600}
                       visible={this.state.addInfoVisible}
                       onOk={this.handleAddInfoOk}
                       onCancel={this.handleAddInfoCancel}>
                    <Form>
                        <FormItem label={'报修人姓名'} {...formItemLayout}>
                            {
                                getFieldDecorator('addName', {
                                    rules: [{
                                        required: true, message: '请输入报修人姓名',
                                        min: 2, max: 10
                                    }]
                                })(
                                    <Input style={{ width: 200}}/>
                                )
                            }
                        </FormItem>
                        <FormItem label={'报修人电话'} {...formItemLayout}>
                            {
                                getFieldDecorator('addPhone', {
                                    rules: [{
                                        required: true, message: '请输入报修人电话',
                                        pattern: '((\\d{11})|^((\\d{7,8})|(\\d{4}|\\d{3})-(\\d{7,8})|(\\d{4}|\\d{3})-(\\d{7,8})-(\\d{4}|\\d{3}|\\d{2}|\\d{1})|(\\d{7,8})-(\\d{4}|\\d{3}|\\d{2}|\\d{1}))$)'
                                    }]
                                })(
                                    <Input style={{ width: 200}}/>
                                )
                            }
                        </FormItem>
                        <FormItem label={'车辆所在地'} {...formItemLayout}>
                            {
                                getFieldDecorator('addProvinceCity', {
                                    rules:[{
                                        required: true, message: '请输入省'
                                    }, {
                                        validator: this.provinceCityValidator
                                    }]
                                })(
                                    <RJAreaCascader
                                        allowClear
                                        cascaderLevel={2}
                                        onProvinceChange={this.handleProvinceChange}
                                        onCityChange={this.handleCityChange}
                                    ></RJAreaCascader>
                                )
                            }
                            {
                                getFieldDecorator('addCarAddr')(
                                    <Input placeholder={'详细街道'}></Input>
                                )
                            }
                        </FormItem>
                        <FormItem label={'当前表显里程'} {...formItemLayout}>
                            {
                                getFieldDecorator('addMileage', {
                                    rules: [{
                                        required: true, message: '请输入当前表显里程'
                                    }]
                                })(
                                    <InputNumber min={0}/>
                                )
                            }
                            公里
                        </FormItem>
                        <FormItem label={'故障现象描述'} {...formItemLayout}>
                            {
                                getFieldDecorator('addMalfunctionInfo', {
                                    rules: [{
                                        required: true, message: '请输入故障现象描述',
                                        max: 200
                                    }]
                                })(
                                    <Input type='textarea' style={{width: 300}}/>
                                )
                            }
                        </FormItem>
                    </Form>
                </Modal>);

            const limitDecimals = (value) => {
                const reg = /^(\-)*(\d+)\.(\d\d).*$/;
                // console.log(value);
                if(typeof value === 'string') {
                    return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : '';
                } else if (typeof value === 'number') {
                    return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : '';
                } else {
                    return '';
                }
            };

            uploadProofDialog = (
                <Modal title={'上传凭证'}
                       width={600}
                       visible={this.state.endAuditVisible}
                       onOk={this.handleEndAuditOk}
                       onCancel={this.handleEndAuditCancel}>
                   <Form>
                       <FormItem {...formItemLayout} label={'结算金额'}>
                           {
                               getFieldDecorator('settlementAmount', {
                                   rules: [{
                                       required: true, message: '请输入结算金额'
                                   }]
                               })(
                                   <InputNumber min={0} formatter={limitDecimals} parser={limitDecimals}/>
                               )
                           }元
                       </FormItem>
                       <FormItem {...formItemLayout} label={'上传凭证'}>
                           {
                               getFieldDecorator('uploadProofImages', {
                                   rules: [{
                                       required: true, message: '请上传凭证图片'
                                   }]
                               })(
                                   <RJImgUploader
                                       action={imgUploadUrl}
                                       beforeUpload={this.beforeUpload}
                                       onRemove={
                                           ({file, updatedDefaultValues}) => {
                                               this.setState({ defaultValue: updatedDefaultValues })}
                                       }
                                       onChange = {(a) => this.onChangeCover(a)}>
                                   </RJImgUploader>
                               )
                           }
                       </FormItem>
                       <FormItem {...formItemLayout} label={'备注'}>
                           {
                               getFieldDecorator('remark', {
                                   rules: [{
                                       message: '请输入备注',
                                       max: 200
                                   }]
                               })(
                                   <Input type='textarea' style={{width: 300}}/>
                               )
                           }
                       </FormItem>
                   </Form>
                </Modal>
            );
        }





        if (this.stateAlready) {
            return (
                <div>
                    <h1>质保-报修管理</h1>
                    <Form layout="inline" className="ant-advanced-search-form">
                        <Row gutter={24}>{this.getFields()}</Row>

                    {<Row>
                        <Col span={24} style={{ textAlign: 'right' }}>
                            <FormItem >
                                <Button type="primary" onClick={this.handSubmit}>搜索</Button>
                            </FormItem>
                            <FormItem >
                                <Button type="primary" onClick={this.handleReset}>清除</Button>
                            </FormItem>
                            <FormItem>
                                {containsResource('INSURANCE_WARRANTY_CREATE')?createWarrantyInfo:''}
                            </FormItem>

                            <FormItem >
                                <Button type='primary' onClick={this.handleExport}>导出Excel</Button>
                            </FormItem>
                        </Col>
                    </Row>}
                    </Form>
                    <div>
                    {warrantyDialog}
                    {warrantyInfoDialog}
                    {uploadProofDialog}
                    </div>

                    <div>
                        <div className="table-content">
                            <Table columns={columns} dataSource={this.state.list.items} rowKey="productId" pagination={pagination}
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



RepairOrderManage = Form.create()(RepairOrderManage);
ReactDom.render(<div><RepairOrderManage></RepairOrderManage></div>, document.querySelector("#content"));
