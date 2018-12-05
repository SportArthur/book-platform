import React from 'react';
import ReactDom from 'react-dom';
import SADPage from '@souche-f2e/sad';
import '../../../styles/index.less';

/*
 * 这里声明要引入的组件
 */
import { Form, Icon, Input,InputNumber, Button, Table, Pagination, Select, Checkbox, Modal, DatePicker, Row, Col, Radio, Cascader, message} from 'antd';
import { RJAreaCascader,SubmitButton } from '@souche-f2e/sad/components/RJAntd';
import { RJImgUploader } from '@souche-f2e/sad/components/RJAntd';
import {Component} from 'react';
import WarrantyInfo from '../../../components/warrantyInfo.jsx';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const { Option, OptGroup } = Select;
const { MonthPicker, RangePicker } = DatePicker;

const moment = require('moment');

let uuid = 0;

let first = true;

/**
 * 质保理赔页面
 */
class Claims extends SADPage {
    constructor() {
        super();
        this.state = {
            productForAdd: {},
            query: {},
            status: {},
            policy: 1,
            chooseMaintenanceVisible: false,
            confirmDialogVisible: false,
            confirmMsg: '',
            maintenance: {
                page:1,
                pageSize:6
            },
            maintenanceList: [],
            page: 1,
            pageSize: 10,
            selectedMaintenance: {},
            saveOrUpdateInfo: {},
            type: '',
            ignoreWarn: false
        }
    }

    /**
     * 切换分页
     * @param pagination
     */
    hanldeTableChange = (pagination) => {
        this.state.pageSize = pagination.pageSize;
        this.state.page = pagination.current;
        this.getList(this.props);
    }

    /**
     * 切换维修商分页
     * @param pagination
     */
    handleMaintenanceTableChange = (pagination) => {
        console.log(pagination);
        this.state.maintenance.pageSize = pagination.pageSize;
        this.state.maintenance.page = pagination.current;
        this.getMaintenanceByFilter();
    }

    onPolicyChange = (e) => {
        console.log(e.target.value);
        const { form } = this.props;
        console.log(form);
        console.log(form.getFieldValue('keys'));
    }

    addComponent = () => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        console.log(keys);

        if(this.state.list.warrantyVO.carComponentVOs.length > 0) {
            uuid = uuid + this.state.list.warrantyVO.carComponentVOs.length;
        }
        console.log(uuid);
        const nextKeys = keys.concat(uuid);
        console.log(nextKeys);
        uuid++;
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys,
        });
    }

    remove = (k) => {
        // debugger;
        console.log("k=" + k)
        const {form} = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        let components = form.getFieldValue('carComponentVOs');
        // const price = form.getFieldValue('componentPrice');
        // const checkPrice = form.getFieldValue('checkPrice');
        // We need at least one passenger
        // if (keys.length === 1) {
        //     return;
        // }
        components[k].price = undefined;
        components[k].auditPrice = undefined;

        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
            carComponentVOs: components
        });
    }

    chooseMaintenance = () => {
        this.state.chooseMaintenanceVisible = true;

        this.getMaintenanceByFilter();
    }

    handleOk = () => {
        this.setState({
            chooseMaintenanceVisible: false
        });

        this.props.form.setFieldsValue({
            maintenanceName: this.state.selectedMaintenance.name,
            maintenanceContacts: this.state.selectedMaintenance.contacts,
            maintenanceContactPhone: this.state.selectedMaintenance.contactPhone,
            maintenanceAddress: this.state.selectedMaintenance.address,
        });
    }

    handleConfirmOk = () => {
        this.setState({
            confirmDialogVisible: false,
            confirmMsg: ''
        });
        this.state.ignoreWarn = true;
        this.schemeFinish().then(data => {
            if(data.success) {
                location.href = 'repairOrderManage.html';
            }
        });

    }

    handleCancel = () => {
        this.setState({
            chooseMaintenanceVisible: false
        });
    }

    handleConfirmCancel = () => {
        this.setState({
            confirmDialogVisible: false
        });
    }

    handSubmit = () => {
        this.state.maintenance.name = this.props.form.getFieldsValue().maintenanceNameSearch;
        this.getMaintenanceByFilter();
    }

    // 数据筛选
    handleProvinceChange = (value) => {
        console.log(value);
        this.state.maintenance.provinceCode = value.key;
    }

    handleCityChange = (value) => {
        console.log(value);
        this.state.maintenance.cityCode = value.key;
    }

    saveOrUpdate = (operateType) => {
        let formInfo = this.props.form.getFieldsValue();
        let warrantyVO = this.state.list.warrantyVO;
        console.log(this.state);
        console.log(formInfo);
        let repairMode = formInfo.repairMode;
        let cover;
        console.log('------------');
        console.log(this.state.cover);
        console.log(this.state.hisCover);
        // this.state.coverBackup = this.state.cover;
        if(this.state.cover) {
            if(this.state.hisCover) {
                cover = this.state.hisCover.concat(this.state.cover);
            }else {
                cover = this.state.cover;
            }
        }else {
            cover = this.state.hisCover;
        }

        this.state.type = operateType;
        if(repairMode == 1) {
            this.state.saveOrUpdateInfo.picUrlList = cover;
            this.state.saveOrUpdateInfo.id = warrantyVO.id;
            this.state.saveOrUpdateInfo.maintenanceId = this.state.selectedMaintenance.id == null ? warrantyVO.maintenanceId : this.state.selectedMaintenance.id;
            this.state.saveOrUpdateInfo.repairMode = formInfo.repairMode;
            this.state.saveOrUpdateInfo.repairSchema = formInfo.repairSchema;
            this.state.saveOrUpdateInfo.breakDownList = formInfo.components;
            this.state.saveOrUpdateInfo.carComponentVOs = formInfo.carComponentVOs;
            this.state.saveOrUpdateInfo.insuranceActiveNow = formInfo.isActiveImmediately;
            this.state.saveOrUpdateInfo.insuranceMileage = formInfo.mileage;
            this.state.saveOrUpdateInfo.insuranceActiveTime = formInfo.activeDate;
            this.state.saveOrUpdateInfo.componentPrice = this.state.sum;
            this.state.saveOrUpdateInfo.auditComponentPrice = this.state.checkSum;
            this.state.saveOrUpdateInfo.labourPrice = formInfo.hourCost ? formInfo.hourCost : 0;
            this.state.saveOrUpdateInfo.auditLabourPrice = formInfo.checkHourCost ? formInfo.checkHourCost : 0;
            this.state.saveOrUpdateInfo.totalPrice = this.state.sumTotal;
            this.state.saveOrUpdateInfo.auditTotalPrice = this.state.checkSumTotal;
            this.state.saveOrUpdateInfo.claimMileage = formInfo.claimMileage;
            this.state.saveOrUpdateInfo.claimDate = formInfo.claimDate;
            if(operateType == 'submit') {
                let data = this.state.saveOrUpdateInfo;
                console.log(data);
                for(var i in data) {
                    console.log(i);
                    console.log(data[i]);
                    if(i == 'insuranceMileage' || i == 'insuranceActiveTime' || i == 'insuranceActiveNow' || i == 'claimMileage'
                        || i == 'claimDate') continue;
                    if(!data[i] || data[i].length===0) {
                        return alert('请填写完整信息');
                    }
                }
                data.carComponentVOs.forEach(function (item) {
                    for(var j in item){
                        if(!item[j] && (j==='name' || j==='auditPrice' || j==='code' || j==='count' || j==='name' || j==='price')){
                            return alert('请填写完整的组件信息');
                        }
                    }
                });
            }
            this.state.ignoreWarn = false;
            this.schemeFinish().then(data => {
                if(data.success) {
                    if(data.msg && data.msg != 'success') {
                        this.setState({
                            confirmDialogVisible: true,
                            confirmMsg: data.msg
                        });

                        // message.warning(data.msg, 3, (() => {
                        //     location.href = 'repairOrderManage.html';
                        // }));
                    }else {
                        location.href = 'repairOrderManage.html';
                    }
                }
            });
        }else if(repairMode == 2) {
            this.state.saveOrUpdateInfo.id = warrantyVO.id;
            this.state.saveOrUpdateInfo.repairMode = formInfo.repairMode;
            this.state.saveOrUpdateInfo.repairSchema = formInfo.repairSchema;
            this.state.saveOrUpdateInfo.maintenanceId = this.state.selectedMaintenance.id == null ? warrantyVO.maintenanceId : this.state.selectedMaintenance.id;
            this.state.saveOrUpdateInfo.breakDownList = formInfo.components;
            this.state.saveOrUpdateInfo.picUrlList = cover;
            this.state.saveOrUpdateInfo.carComponentVOs = formInfo.carComponentVOs;
            this.state.saveOrUpdateInfo.componentPrice = this.state.sum;
            this.state.saveOrUpdateInfo.auditComponentPrice = this.state.checkSum;
            this.state.saveOrUpdateInfo.labourPrice = formInfo.hourCost ? formInfo.hourCost : 0;
            this.state.saveOrUpdateInfo.auditLabourPrice =  formInfo.checkHourCost ? formInfo.checkHourCost : 0;
            this.state.saveOrUpdateInfo.totalPrice = this.state.sumTotal;
            this.state.saveOrUpdateInfo.auditTotalPrice = this.state.checkSumTotal;
            this.state.saveOrUpdateInfo.refuseReason = formInfo.refuseReason;
            this.state.saveOrUpdateInfo.insuranceActiveNow = formInfo.isActiveImmediately;
            this.state.saveOrUpdateInfo.insuranceMileage = formInfo.mileage;
            this.state.saveOrUpdateInfo.insuranceActiveTime = formInfo.activeDate;
            this.state.saveOrUpdateInfo.claimMileage = formInfo.claimMileage;
            this.state.saveOrUpdateInfo.claimDate = formInfo.claimDate;
            if(operateType == 'submit') {
                let data = this.state.saveOrUpdateInfo;
                for(var i in data) {
                    if((!data[i] || data[i].length===0) && (i==='refuseReason' || i==='breakDownList')) {
                        return alert('请填写[拒赔原因]和[故障部位]');
                    }
                }
            }
            this.state.ignoreWarn = true;
            this.schemeFinish().then(data => {
                if(data.success) {
                    location.href = 'repairOrderManage.html';
                }
            });
        }else if(repairMode == 3) {
            this.state.saveOrUpdateInfo.id = warrantyVO.id;
            this.state.saveOrUpdateInfo.repairMode = formInfo.repairMode;
            this.state.saveOrUpdateInfo.breakDownList = formInfo.components;
            this.state.saveOrUpdateInfo.picUrlList = cover;
            this.state.saveOrUpdateInfo.refuseReason = formInfo.freeReason;
            this.state.saveOrUpdateInfo.claimMileage = formInfo.claimMileage;
            this.state.saveOrUpdateInfo.claimDate = formInfo.claimDate;
            if(operateType ==='submit'){
                let data = this.state.saveOrUpdateInfo;
                for (var i in data){
                    if((!data[i] || data[i].length===0) && i!=='picUrlList'){
                        return alert('请填写完整信息(除资料上传)');
                    }
                }
            }
            this.freeAwarded().then(data => {
                if(data.success) {
                    location.href = 'repairOrderManage.html';
                }
            });
        }
    }

    getUrlRelativePath = (urls) => {
        if(urls != null && urls.length > 0) {
            urls = urls.map((url) => {
                console.log(url);
                var arrUrl = url.split("//");
                var start = arrUrl[1].indexOf("/");
                var relUrl = arrUrl[1].substring(start + 1);
                return relUrl;
            });
        }
        return urls;
    }

    onChangeCover = (images) => {
        console.log(images)
        if(typeof images == 'string' && images.length > 0) {
            images = new Array(images);
        }
        if(images.length > 0) {
            images = this.getUrlRelativePath(images);
        }else {
            images = null;
        }
        console.log(images);
        console.log(this.state.cover);
        this.state.cover = images;

        console.log(this.state.cover);
        // this.state.cover = images;
    }

    beforeUpload = (file) => {
        // console.log(file);
        // const isJPG = file.type === 'image/jpeg';
        // if (!isJPG) {
        //     message.error('You can only upload JPG file!');
        // }
        // const isLt2M = file.size / 1024 / 1024 < 2;
        // if (!isLt2M) {
        //     message.error('Image must smaller than 2MB!');
        // }
        // return isJPG && isLt2M;
        return true;
    }

    /**
     *
     * @returns {*}
     */
    render() {
        const {getFieldDecorator, getFieldValue} = this.props.form;
        let pagination = null;
        let paginationMaintenance = null;
        let _this = null;
        if (this.props._this) {
            _this = this.props._this;
        }
        const that = this;

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

        if (this.state.maintenanceList) {
            paginationMaintenance = {
                size: 'small',
                total: this.state.maintenanceList.totalNumber,
                current: this.state.maintenanceList.currentIndex,
                pageSize: this.state.maintenanceList.pageSize,
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
            type: 'radio',
            onChange(selectedRowKeys, selectedRows) {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            onSelect(record) {
                that.state.selectedMaintenance = record;
            }
        };

        const columns = [
            {
                title: '车商名称',
                dataIndex: 'shopName',
                key: 'shopName'
            },
            {
                title: '地址',
                dataIndex: 'address',
                key: 'address'
            },
            {
                title: '账号',
                dataIndex: 'account',
                key: 'account'
            }];

        let imgUploadUrl = `${this.baseUri}/api/CommonApi/uploadNew.json`;
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

        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 20, offset: 4 },
            }
        };

        const limitInteger = (value) => {
            const reg = /^(\-)*(\d+).*$/;
            // console.log(value);
            if(typeof value === 'string') {
                return !isNaN(Number(value)) ? value.replace(reg, '$1$2') : '';
            } else if (typeof value === 'number') {
                return !isNaN(value) ? String(value).replace(reg, '$1$2') : '';
            } else {
                return '';
            }
        };

        let formItems;
        if(this.stateAlready) {
            const carComponentVOs = this.state.list.warrantyVO.carComponentVOs;
            let initialKeyArray = new Array();
            for(var i = 0; i < carComponentVOs.length; i++) {
                initialKeyArray.push(i);
            }
            console.log(initialKeyArray);
            getFieldDecorator('keys', { initialValue: initialKeyArray });
            const keys = getFieldValue('keys');
            console.log('------');
            console.log(keys);
            formItems = keys.map((k) => {
                console.log('k='+k);
                if(this.state.policy == 1) {
                    return (
                        <FormItem
                            {...formItemLayout}
                            label="组件"
                            required={false}
                            key={k}
                        >
                            {
                                getFieldDecorator(`carComponentVOs[${k}].code`, {
                                    initialValue: carComponentVOs[k] ? carComponentVOs[k].code : null
                                })(
                                    <Input placeholder="零件编号" style={{width: '20%', marginRight: 8}}/>
                                )
                            }
                            {getFieldDecorator(`carComponentVOs[${k}].name]`, {
                                initialValue: carComponentVOs[k] ? carComponentVOs[k].name : null,
                                validateTrigger: ['onChange', 'onBlur'],
                                rules: [{
                                    required: true,
                                    whitespace: true,
                                    message: "Please input passenger's name or delete this field.",
                                }],
                            })(
                                <Input placeholder="零件名称" style={{ width: '20%', marginRight: 8}}/>
                            )}
                            {getFieldDecorator(`carComponentVOs[${k}].price`, {
                                initialValue: carComponentVOs[k] ? carComponentVOs[k].price : null
                            })(
                                <InputNumber placeholder="单价" style={{width: '10%',marginLeft: 8}} />
                            )}元
                            {getFieldDecorator(`carComponentVOs[${k}].auditPrice]`, {
                                initialValue: carComponentVOs[k] ? carComponentVOs[k].auditPrice : null
                            })(
                                <InputNumber placeholder="核定单价" style={{width: '10%',marginLeft: 8}} />
                            )}元
                            {
                                <label style={{marginLeft: 8}}>数量</label>
                            }
                            {getFieldDecorator(`carComponentVOs[${k}].count`, {
                                initialValue: carComponentVOs[k] ? carComponentVOs[k].count : '1'
                            })(
                                <InputNumber min={1} style={{width: '10%',marginLeft: 8}} formatter={limitInteger} parser={limitInteger}/>
                            )}
                            {keys.length > 0 ? (
                                <Icon
                                    className="dynamic-delete-button"
                                    type="minus-circle-o"
                                    onClick={() => this.remove(k)}
                                />
                            ) : null}
                        </FormItem>
                    );
                }
            });
        }

        let components = getFieldValue('carComponentVOs');
        // console.log('------');
        // console.log(components);

        if(components) {
            let sum = 0;
            let checkSum = 0;
            for(var i = 0; i< components.length; i++) {
                if(components[i]) {
                    let price = components[i].price;
                    let auditPrice = components[i].auditPrice;
                    let number = components[i].count;
                    if(price != undefined && price != "" && number != undefined && number != "") {
                        sum += price * number;
                    }
                    if(auditPrice != undefined && auditPrice != "" && number != undefined && number != "") {
                        checkSum += auditPrice * number;
                    }
                }
            }
            console.log(sum);
            console.log(this.state.sum);
            this.state.sum = sum;
            this.state.checkSum = checkSum;
        }

        const styleLevel2 = {
            style : {
                marginLeft: '20%'
            }
        };

        const styleLevel3 = {
            style : {
                marginLeft: '25%',
                fontSize: '125%',
                marginRight: '25%'
            }
        };
        const maintenanceColumn = [{
            title: '维修商',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => {
                return (<div>{record.name} {record.id}</div>);
            }
        }];

        if (this.stateAlready) {
            console.log(this.state.list);
            let isFactory = this.state.list.insuranceOrder.isFactoryInsurance;

            if(this.state.list.warrantyVO.picUrlList) {
                this.state.list.warrantyVO.picUrlList = this.state.list.warrantyVO.picUrlList.map(url => {
                    // http://souche-devqa.oss-cn-hangzhou.aliyuncs.com/
                    if(url.indexOf('http') != 0) {
                        let imgHead = this.state.list.warrantyVO.imageHead;
                        url = imgHead + url;
                    }
                    return url;
                });
                if(first) {
                    this.state.hisCover = this.state.list.warrantyVO.picUrlList;
                    first = false;
                }
            }

            const priceInfo = (
                <div>
                    <FormItem {...formItemLayout} label={'工时费:'}>
                        {
                            getFieldDecorator('hourCost', {
                                initialValue: this.state.list.warrantyVO.labourPrice
                            })(
                                <InputNumber min={0} style={{width: 100}}></InputNumber>
                            )
                        }
                        元
                        <label style={{marginLeft: 8}}>核定工时费:</label>
                        {
                            getFieldDecorator('checkHourCost', {
                                initialValue: this.state.list.warrantyVO.auditLabourPrice
                            })(
                                <InputNumber min={0} style={{width: 100}}></InputNumber>
                            )
                        }
                        元
                    </FormItem>
                </div>
            );

            let hourCost = getFieldValue('hourCost');
            let checkHourCost = getFieldValue('checkHourCost');
            this.state.checkSumTotal = 0;
            this.state.sumTotal = 0;
            if(hourCost) {
                if(this.state.sum != undefined) {
                    this.state.sumTotal = this.state.sum + parseInt(hourCost);
                }else {
                    this.state.sumTotal = parseInt(hourCost);
                }
            }else {
                if(this.state.sum != undefined) {
                    this.state.sumTotal = this.state.sum;
                }
            }

            if(checkHourCost) {
                if(this.state.checkSum != undefined) {
                    this.state.checkSumTotal = this.state.checkSum + parseInt(checkHourCost);
                }else {
                    this.state.checkSumTotal = parseInt(checkHourCost);
                }
            }else {
                if(this.state.checkSum != undefined) {
                    this.state.checkSumTotal = this.state.checkSum;
                }
            }

            const isFactoryInsurance = ((isFactory && isFactory == 'Y') ?
                    (<div>
                        <FormItem label={'质保是否立即生效'} {...formItemLayout}>
                            {
                                getFieldDecorator('isActiveImmediately', {
                                    initialValue: this.state.list.warrantyVO ? this.state.list.warrantyVO.insuranceActiveNow : '0'
                                })(
                                    <Radio.Group onChange={this.onPolicyChange}>
                                        <Radio value={'0'}>是</Radio>
                                        <Radio value={'1'}>否</Radio>
                                    </Radio.Group>
                                )
                            }
                        </FormItem>
                        {
                            getFieldValue('isActiveImmediately') == '0' ?
                            (<FormItem label={'里程数'} {...formItemLayout}>
                                {
                                    getFieldDecorator('mileage', {
                                        initialValue: this.state.list.warrantyVO.insuranceMileage
                                    })(
                                        <InputNumber style={{width: '200'}} formatter={limitInteger} parser={limitInteger}></InputNumber>
                                    )
                                }
                                公里
                            </FormItem>) : ''
                        }
                        {
                            getFieldValue('isActiveImmediately') == '0' ?
                                (<FormItem label={'生效时间'} {...formItemLayout}>
                                    {
                                        getFieldDecorator('activeDate', {
                                            initialValue: moment(this.state.list.warrantyVO.insuranceActiveTime)
                                        })(
                                            <DatePicker/>
                                        )
                                    }
                                </FormItem>) : ''
                        }
                    </div>) : '');

            const options = [
                { label: '发动机', value: 1 },
                { label: '变速箱', value: 2 },
                { label: '驱动系统', value: 4 },
                { label: '转向系统', value: 5 },
                { label: '制动系统', value: 3 },
                { label: '悬挂系统', value: 6 },
                { label: '燃油系统', value: 7 },
                { label: '冷却系统', value: 9 },
                { label: '空调系统', value: 8 },
                { label: '电器系统', value: 10 },
                { label: '其他', value: 11 },
            ];

            const confirmDialog = (
                <Modal title="提示"
                       width={600}
                       visible={this.state.confirmDialogVisible}
                       onOk={this.handleConfirmOk}
                       onCancel={this.handleConfirmCancel}>
                    {this.state.confirmMsg}
                </Modal>
            );

            const chooseMaintenanceDialog = (
                <Modal title="选择维修商"
                       width={600}
                       visible={this.state.chooseMaintenanceVisible}
                       onOk={this.handleOk}
                       onCancel={this.handleCancel}>
                    <Form layout="inline">
                        <FormItem label="名称">
                            {
                                getFieldDecorator('maintenanceNameSearch')(
                                    <Input style={{ width: 100}} />
                                )
                            }
                        </FormItem>
                        <FormItem label="省市">
                            {
                                getFieldDecorator('provinceCitySearch')(
                                    <RJAreaCascader
                                        allowClear
                                        cascaderLevel={2}
                                        onProvinceChange={this.handleProvinceChange}
                                        onCityChange={this.handleCityChange}
                                    ></RJAreaCascader>
                                )
                            }
                        </FormItem>
                        <Button type="primary" onClick={this.handSubmit}>搜索</Button>
                        <br/>
                        <div className="table-content">
                            <Table columns={maintenanceColumn} dataSource={this.state.maintenanceList.items}
                                   pagination={paginationMaintenance}
                                   onChange={this.handleMaintenanceTableChange}
                                   rowSelection={rowSelection}
                                   bordered/>
                        </div>
                    </Form>
                </Modal>);
            return (
                <div>
                    <WarrantyInfo _this={this}></WarrantyInfo>
                    <h2 {...styleLevel2}>索赔处理</h2>
                    <Form>
                        <FormItem label={'索赔方式'} {...formItemLayout}>
                            {
                                getFieldDecorator('repairMode', {
                                    initialValue: this.state.list.warrantyVO.repairMode
                                })(
                                    <Radio.Group>
                                        <Radio value={'1'}>正常理赔</Radio>
                                        <Radio value={'3'}>免赔</Radio>
                                        <Radio value={'2'}>拒赔</Radio>
                                    </Radio.Group>
                                )
                            }
                        </FormItem>
                        <FormItem label={'车辆报修公里数'} {...formItemLayout}>
                            {
                                getFieldDecorator('claimMileage', {
                                    initialValue: this.state.list.warrantyVO.claimMileage
                                })(
                                    <InputNumber style={{width: '200'}} formatter={limitInteger} parser={limitInteger}></InputNumber>
                                )
                            }
                            公里
                        </FormItem>
                        <FormItem label={'车辆报修日期'} {...formItemLayout}>
                            {
                                getFieldDecorator('claimDate', {
                                    initialValue: moment(this.state.list.warrantyVO.claimDate)
                                })(
                                    <DatePicker/>
                                )
                            }
                        </FormItem>
                        {getFieldValue('repairMode') != '3' ? isFactoryInsurance : ''}
                        <div style={getFieldValue('repairMode') != '3' ? {display: 'block'} : {display: 'none'}}>
                            <FormItem label={'维修商名称'} {...formItemLayout}>
                                {
                                    getFieldDecorator('maintenanceName', {
                                        initialValue: this.state.list.warrantyVO.repairShopName
                                    })(
                                        <Input style={{ width: 200}} onClick={this.chooseMaintenance}/>
                                    )
                                }
                            </FormItem>
                            <Row gutter={50} {...styleLevel3}>
                                <Col span={8}>
                                    <label>联系人:</label>
                                    {
                                        getFieldDecorator('maintenanceContacts', {
                                            initialValue: this.state.list.warrantyVO.contacts
                                        })(
                                            <Input disabled={true}></Input>
                                        )
                                    }
                                </Col>
                                <Col span={8}>
                                    <label>联系电话:</label>
                                    {
                                        getFieldDecorator('maintenanceContactPhone', {
                                            initialValue: this.state.list.warrantyVO.repairShopPhone
                                        })(
                                            <Input disabled={true}></Input>
                                        )
                                    }
                                </Col>
                                <Col span={8}>
                                    <label>联系地址:</label>
                                    {
                                        getFieldDecorator('maintenanceAddress', {
                                            initialValue: this.state.list.warrantyVO.repairShopAddr
                                        })(
                                            <Input disabled={true}></Input>
                                        )
                                    }
                                </Col>
                            </Row>
                        </div>
                        <FormItem label={'故障部位:'} {...formItemLayout}>
                            {
                                getFieldDecorator('components', {
                                    initialValue: this.state.list.warrantyVO.breakDownList
                                })(
                                    <Checkbox.Group style={{ width: '100%' }} options={options} />
                                )
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label="资料上传">
                            <RJImgUploader
                                action={imgUploadUrl}
                                beforeUpload={this.beforeUpload}
                                defaultValue={this.state.hisCover}
                                onRemove={
                                    ({file, updatedDefaultValues}) => {
                                        console.log(file);
                                        console.log(updatedDefaultValues);
                                        // this.state.cover.indexOf(file.url);
                                        // this.state.cover = updatedDefaultValues;
                                        // console.log(updatedDefaultValues);
                                        this.setState({
                                            hisCover: updatedDefaultValues
                                        });

                                        this.state.hisCover = updatedDefaultValues;
                                    }
                                }
                                onChange = {(a) => this.onChangeCover(a)}
                            >
                            </RJImgUploader>
                        </FormItem>
                        <div style={getFieldValue('repairMode') != 3 ? {display: 'block'} : {display: 'none'}}>
                            <FormItem {...formItemLayout} label={'维修方案'}>
                                {
                                    getFieldDecorator('repairSchema', {
                                        initialValue: this.state.list.warrantyVO.repairSchema
                                    })(
                                        <Input type={'textarea'} style={{width: 600, height: 300}}></Input>
                                    )
                                }
                            </FormItem>
                            {formItems}
                            <FormItem {...formItemLayout} label={'更换部件'}>
                                <Button type="dashed" onClick={this.addComponent} style={{width: 200}}>
                                    <Icon type="plus" />添加更换部件
                                </Button>
                            </FormItem>
                            <FormItem {...formItemLayout} label={'配件费小计:'}>
                                {this.state.sum}元
                                <label style={{marginLeft: '30'}}>核定配件费小计: </label>
                                {this.state.checkSum}元
                            </FormItem>
                            {priceInfo}
                            <FormItem {...formItemLayout} label={'总价'}>
                                {this.state.sumTotal}元
                                <label style={{marginLeft: '30'}}>核定总价: </label>
                                {this.state.checkSumTotal}元
                            </FormItem>
                        </div>
                        <FormItem {...formItemLayout} label={'免赔原因:'} style={getFieldValue('repairMode') == '3' ? {display: 'block'} : {display: 'none'}}>
                            {
                                getFieldDecorator('freeReason', {
                                    initialValue: this.state.list.warrantyVO.refuseReason
                                })(
                                    <Input type={'textarea'} style={{ width: '400' }}/>
                                )
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label={'拒赔原因:'} style={getFieldValue('repairMode') == '2' ? {display: 'block'} : {display: 'none'}}>
                            {
                                getFieldDecorator('refuseReason', {
                                    initialValue: this.state.list.warrantyVO.refuseReason
                                })(
                                    <Input type={'textarea'} style={{ width: '400' }}/>
                                )
                            }
                        </FormItem>
                    </Form>
                    {confirmDialog}
                    {chooseMaintenanceDialog}
                    <div>
                        <div>
                            <Button
                                type="primary"
                                style={{marginLeft: 500, marginRight:10}}
                                onClick={() => this.saveOrUpdate('createOrUpdate')}>保存</Button>
                            <Button onClick={() => this.saveOrUpdate('submit')}>提交</Button>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    }
}

Claims = Form.create()(Claims);
ReactDom.render(<div><Claims></Claims></div>, document.querySelector("#content"));
