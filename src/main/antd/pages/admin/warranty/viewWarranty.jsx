import React from 'react';
import ReactDom from 'react-dom';
import SADPage from '@souche-f2e/sad';
import '../../../styles/index.less';

/*
 * 这里声明要引入的组件
 */
import { Form, Icon, Input,InputNumber, Button, Table, Pagination, Select, Checkbox, Modal, DatePicker, Row, Col, Radio, Cascader} from 'antd';
import { RJAreaCascader,SubmitButton, RJCarousel, RJImgUploader } from '@souche-f2e/sad/components/RJAntd';
import {Component} from 'react';
import WarrantyInfo from '../../../components/warrantyInfo.jsx';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const { Option, OptGroup } = Select;
const { MonthPicker, RangePicker } = DatePicker;

const moment = require('moment');



let uuid = 0;

/**
 * 报修查看页面
 */
class ViewWarranty extends SADPage {
    constructor() {
        super();
        this.state = {
            productForAdd: {},
            query: {},
            status: {},
            policy: 1,
            chooseMaintenanceVisible: false,
            maintenance: {
                page:1,
                pageSize:6
            },
            maintenanceList: [],
            page: 1,
            pageSize: 10,
            selectedMaintenance: {}
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

    /**
     * 搜索查询
     */
    handSubmit = () => {
        console.log(this);
        console.log(this.props.form.getFieldsValue());
        this.state.orderNo = this.props.form.getFieldsValue().orderNo;
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

    onPolicyChange = (e) => {
        console.log(e.target.value);
        const { form } = this.props;
        console.log(form);
        console.log(form.getFieldValue('keys'));
        this.setState({
            policy: e.target.value,
        });
        if(e.target.value == 1) {

        }else {
            // form.resetFields(new Array('keys'))
        }
    }

    chooseMaintenance = () => {
        // this.setState({
        //         //     chooseMaintenanceVisible: true
        //         // });
        this.state.chooseMaintenanceVisible = true;

        this.getMaintenanceByFilter();
    }

    handleOk = () => {
        this.setState({
            chooseMaintenanceVisible: false
        });

        this.props.form.setFieldsValue({
            maintenanceName: this.state.selectedMaintenance.name
        });
    }

    handleCancel = () => {
        this.setState({
            chooseMaintenanceVisible: false
        });
    }

    handSubmit = () => {
        this.state.maintenance.name = this.props.form.getFieldsValue().maintenanceNameSearch;
        this.getMaintenanceByFilter();
    }

    // 数据筛选
    handleProvinceChange = (value) => {
        this.state.maintenance.provinceCode = value.key;
    }

    handleCityChange = (value) => {
        this.state.maintenance.cityCode = value.key;
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

        let imgUploadUrl = `${this.baseUri}/api/CommonApi/upload.json`;
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
                                    <Input placeholder="零件编号" style={{width: '20%', marginRight: 8}} disabled={true}/>
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
                                <Input placeholder="零件名称" style={{ width: '20%', marginRight: 8}} disabled={true}/>
                            )}
                            {getFieldDecorator(`carComponentVOs[${k}].price`, {
                                initialValue: carComponentVOs[k] ? carComponentVOs[k].price : null
                            })(
                                <Input placeholder="单价（元）" style={{width: '10%',marginLeft: 8}} disabled={true}/>
                            )}元
                            {getFieldDecorator(`carComponentVOs[${k}].auditPrice]`, {
                                initialValue: carComponentVOs[k] ? carComponentVOs[k].auditPrice : null
                            })(
                                <Input placeholder="核定单价（元）" style={{width: '10%',marginLeft: 8}} disabled={true}/>
                            )}元
                            {
                                <label style={{marginLeft: 8}}>数量</label>
                            }
                            {getFieldDecorator(`carComponentVOs[${k}].count`, {
                                initialValue: carComponentVOs[k] ? carComponentVOs[k].count : '1'
                            })(
                                <Input style={{width: '10%',marginLeft: 8}} disabled={true}/>
                            )}
                        </FormItem>
                    );
                }
            });
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

        if (this.stateAlready) {
            console.log(this.state.list);
            let isFactory = this.state.list.insuranceOrder.isFactoryInsurance;
            let isEndAuditBoolean = this.state.list.warrantyVO.status && this.state.list.warrantyVO.status == '5' ? true : false;
            if(this.state.list.warrantyVO.picUrlList) {
                this.state.list.warrantyVO.picUrlList = this.state.list.warrantyVO.picUrlList.map(url => {
                    // http://souche-devqa.oss-cn-hangzhou.aliyuncs.com/
                    if(url.indexOf('http') != 0) {
                        let imgHead = this.state.list.warrantyVO.imageHead;
                        url = imgHead + url;
                    }
                    return url;
                });
            }

            const isFactoryInsurance = ((isFactory && isFactory == 'Y') ?
                (<div>
                    <FormItem label={'质保是否立即生效'} {...formItemLayout}>
                        {this.state.list.warrantyVO.insuranceActiveNow == '0' ? '是' : '否'}
                        {/*{*/}
                            {/*getFieldDecorator('isActiveImmediately', {*/}
                                {/*initialValue: this.state.list.warrantyVO ? this.state.list.warrantyVO.insuranceActiveNow : '0'*/}
                            {/*})(*/}
                                {/*<Radio.Group onChange={this.onPolicyChange} disabled={true}>*/}
                                    {/*<Radio value={'0'}>是</Radio>*/}
                                    {/*<Radio value={'1'}>否</Radio>*/}
                                {/*</Radio.Group>*/}
                            {/*)*/}
                        {/*}*/}
                    </FormItem>
                    {
                        this.state.list.warrantyVO.insuranceActiveNow == '0' ?
                            (<FormItem label={'里程数'} {...formItemLayout}>
                                {this.state.list.warrantyVO.insuranceMileage}公里
                                {/*{*/}
                                    {/*getFieldDecorator('mileage', {*/}
                                        {/*initialValue: this.state.list.warrantyVO.insuranceMileage*/}
                                    {/*})(*/}
                                        {/*<Input style={{width: '200'}} disabled={true}></Input>*/}
                                    {/*)*/}
                                {/*}*/}
                            </FormItem>) : ''
                    }
                    {
                        this.state.list.warrantyVO.insuranceActiveNow == '0' ?
                            (<FormItem label={'生效时间'} {...formItemLayout}>
                                {
                                    getFieldDecorator('activeDate', {
                                        initialValue: moment(this.state.list.warrantyVO.insuranceActiveTime)
                                    })(
                                        <DatePicker disabled={true}/>
                                    )
                                }
                            </FormItem>) : ''
                    }
                </div>) : '');

            const fontSizeStyle = {
              fontSize: 20
            };

            const isEndAudit = (isEndAuditBoolean) ?
                (<div>
                    <h2 {...styleLevel2}>结算信息</h2>
                    <Row {...styleLevel3} gutter={50}>
                        <Col span={12}>上传人: &nbsp;{this.state.list.warrantyVO.handlerName}</Col>
                        <Col span={12}>上传时间: &nbsp;{this.state.list.warrantyVO.dateUpdate}</Col>
                    </Row>
                    <Row {...styleLevel3} gutter={50}>
                        <Col span={12}>结算金额: &nbsp;{this.state.list.warrantyVO.settlementAmount}元</Col>
                        <Col span={12}>结算状态: &nbsp;已结案</Col>
                    </Row>
                    <Row {...styleLevel3} gutter={50}>
                        <Col span={24}>上传凭证:
                            {/*<RJImgUploader*/}
                                {/*action={imgUploadUrl}*/}
                                {/*defaultValue={this.state.list.warrantyVO.uploadProofImageList}*/}
                                {/*disabled={true}>*/}
                            {/*</RJImgUploader>*/}
                            <RJCarousel
                                modal
                                style={{width: 300, height: 150}}
                                list={this.state.list.warrantyVO.uploadProofImageList ? this.state.list.warrantyVO.uploadProofImageList : []}
                            >
                            </RJCarousel>
                        </Col>
                    </Row>
                    <Row {...styleLevel3} gutter={50}>
                        <Col span={12}>备注: &nbsp;{this.state.list.warrantyVO.remark}</Col>
                    </Row>
                </div>) : '';

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

            let repairMode = this.state.list.warrantyVO.repairMode;
            if(repairMode == 1) {
                this.state.repairModeShow = '正常理赔';
            }else if(repairMode == 2) {
                this.state.repairModeShow = '拒赔';
            }else if(repairMode == 3) {
                this.state.repairModeShow = '免赔';
            }else if(repairMode == 0) {
                this.state.repairModeShow = '待查定';
            }

            return (
                <div>
                    <WarrantyInfo _this={this}></WarrantyInfo>
                    <h2 {...styleLevel2}>索赔处理</h2>
                    <Form>
                        <FormItem label={'索赔方式'} {...formItemLayout}>
                            {this.state.repairModeShow}
                            {/*{*/}
                                {/*getFieldDecorator('repairMode', {*/}
                                    {/*initialValue: this.state.list.warrantyVO.repairMode,*/}
                                {/*})(*/}
                                    {/*<Radio.Group disabled={true}>*/}
                                        {/*<Radio value={'1'}>正常理赔</Radio>*/}
                                        {/*<Radio value={'3'}>免赔</Radio>*/}
                                        {/*<Radio value={'2'}>拒赔</Radio>*/}
                                    {/*</Radio.Group>*/}
                                {/*)*/}
                            {/*}*/}
                        </FormItem>
                        <FormItem label={'车辆报修公里数'} {...formItemLayout}>
                            {this.state.list.warrantyVO.claimMileage}公里
                        </FormItem>
                        <FormItem label={'车辆报修日期'} {...formItemLayout}>
                            {
                                getFieldDecorator('claimDate', {
                                    initialValue: moment(this.state.list.warrantyVO.claimDate)
                                })(
                                    <DatePicker disabled={true}/>
                                )
                            }
                        </FormItem>
                        {repairMode != '3' ? isFactoryInsurance : ''}
                        <div style={getFieldValue('repairMode') != '3' ? {display: 'block'} : {display: 'none'}}>

                            <FormItem label={'维修商名称'} {...formItemLayout}>
                                {this.state.list.warrantyVO.repairShopName}
                                {/*{*/}
                                    {/*getFieldDecorator('maintenanceName', {*/}
                                        {/*initialValue: this.state.list.warrantyVO.repairShopName*/}
                                    {/*})(*/}
                                        {/*<Input style={{ width: 200}} onClick={this.chooseMaintenance} disabled={true}/>*/}
                                    {/*)*/}
                                {/*}*/}
                            </FormItem>
                            <Row gutter={50} {...styleLevel3}>
                                <Col span={8}>
                                    <label>联系人:{this.state.list.warrantyVO.contacts}</label>
                                    {/*{*/}
                                        {/*getFieldDecorator('maintenanceContacts', {*/}
                                            {/*initialValue: this.state.list.warrantyVO.contacts*/}
                                        {/*})(*/}
                                            {/*<Input disabled={true}></Input>*/}
                                        {/*)*/}
                                    {/*}*/}
                                </Col>
                                <Col span={8}>
                                    <label>联系电话:{this.state.list.warrantyVO.repairShopPhone}</label>
                                    {/*{*/}
                                        {/*getFieldDecorator('maintenanceContactPhone', {*/}
                                            {/*initialValue: this.state.list.warrantyVO.repairShopPhone*/}
                                        {/*})(*/}
                                            {/*<Input disabled={true}></Input>*/}
                                        {/*)*/}
                                    {/*}*/}
                                </Col>
                                <Col span={8}>
                                    <label>联系地址:{this.state.list.warrantyVO.repairShopAddr}</label>
                                    {/*{*/}
                                        {/*getFieldDecorator('maintenanceAddress', {*/}
                                            {/*initialValue: this.state.list.warrantyVO.repairShopAddr*/}
                                        {/*})(*/}
                                            {/*<Input disabled={true}></Input>*/}
                                        {/*)*/}
                                    {/*}*/}
                                </Col>
                            </Row>
                        </div>

                        <FormItem label={'故障部位:'} {...formItemLayout}>
                            {
                                getFieldDecorator('components', {
                                    initialValue: this.state.list.warrantyVO.breakDownList
                                })(
                                    <Checkbox.Group style={{ width: '100%' }} options={options} disabled={true}/>
                                )
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label="资料上传">
                            {/*<RJImgUploader*/}
                                {/*action={imgUploadUrl}*/}
                                {/*defaultValue={this.state.list.warrantyVO.picUrlList}*/}
                                {/*disabled={true}*/}
                            {/*>*/}
                            {/*</RJImgUploader>*/}
                            <RJCarousel
                                modal
                                // autoplay
                                style={{width: 300, height: 150}}
                                list={this.state.list.warrantyVO.picUrlList ? this.state.list.warrantyVO.picUrlList : []}
                                // width={3}
                            >
                            </RJCarousel>
                        </FormItem>

                        <div style={repairMode != 3 ? {display: 'block'} : {display: 'none'}}>
                            <FormItem {...formItemLayout} label={'维修方案'}>
                                {
                                    getFieldDecorator('repairSchema', {
                                        initialValue: this.state.list.warrantyVO.repairSchema
                                    })(
                                        <Input type={'textarea'} style={{width: 600, height: 200}} disabled={true}></Input>
                                    )
                                }
                            </FormItem>
                            {formItems}
                            <FormItem {...formItemLayout} label={'配件费小计:'}>
                                {this.state.list.warrantyVO.componentPrice}元
                                <label style={{marginLeft: '30'}}>核定配件费小计: </label>
                                {this.state.list.warrantyVO.auditComponentPrice}元
                            </FormItem>
                            <FormItem {...formItemLayout} label={'工时费:'}>
                                {
                                    getFieldDecorator('hourCost', {
                                        initialValue: this.state.list.warrantyVO.labourPrice
                                    })(
                                        <Input style={{width: 100}} disabled={true}></Input>
                                    )
                                }
                                元
                                <label style={{marginLeft: 8}}>核定工时费:</label>
                                {
                                    getFieldDecorator('checkHourCost', {
                                        initialValue: this.state.list.warrantyVO.auditLabourPrice
                                    })(
                                        <Input style={{width: 100}} disabled={true}></Input>
                                    )
                                }
                                元
                            </FormItem>
                            <FormItem {...formItemLayout} label={'总价'}>
                                {this.state.list.warrantyVO.totalPrice}元
                                <label style={{marginLeft: '30'}}>核定总价: </label>
                                {this.state.list.warrantyVO.auditTotalPrice}元
                            </FormItem>
                        </div>
                        <FormItem {...formItemLayout} label={'免赔原因:'} style={repairMode == '3' ? {display: 'block'} : {display: 'none'}}>
                            {
                                getFieldDecorator('freeReason', {
                                    initialValue: this.state.list.warrantyVO.refuseReason
                                })(
                                    <Input type={'textarea'} style={{width: '400', height: '200'}} disabled={true}/>
                                )
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label={'拒赔原因:'} style={repairMode == '2' ? {display: 'block'} : {display: 'none'}}>
                            {
                                getFieldDecorator('refuseReason', {
                                    initialValue: this.state.list.warrantyVO.refuseReason
                                })(
                                    <Input type={'textarea'} style={{width: '400', height: '200'}} disabled={true}/>
                                )
                            }
                        </FormItem>
                        {isEndAudit}
                    </Form>
                    <div style={{textAlign:'center'}}>
                        <Button onClick={() => location.href=`repairOrderManage.html`}>返回</Button>
                    </div>
                </div>
            );
        }
        return null;
    }

}

ViewWarranty = Form.create()(ViewWarranty);
ReactDom.render(<div><ViewWarranty></ViewWarranty></div>, document.querySelector("#content"));
