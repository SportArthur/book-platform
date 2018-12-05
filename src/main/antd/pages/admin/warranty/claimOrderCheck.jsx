import React from 'react';
import ReactDom from 'react-dom';
import SADPage from '@souche-f2e/sad';
import '../../../styles/index.less';

/*
 * 这里声明要引入的组件
 */
import { Form, Icon, Input,InputNumber, Button, Table, Select, Checkbox, Modal, DatePicker, Row, Col, Radio, Cascader} from 'antd';
import { RJAreaCascader,SubmitButton, RJCarousel, RJImgUploader } from '@souche-f2e/sad/components/RJAntd';
import WarrantyInfo from '../../../components/warrantyInfo.jsx';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const { Option, OptGroup } = Select;
const { MonthPicker, RangePicker } = DatePicker;
const { TextArea } = Input;

const moment = require('moment');

/**
 * 方案审核页面
 */
class ClaimOrderCheck extends SADPage {
    constructor() {
        super();
        this.state = {
            productForAdd: {},
            query: {},
            status: {},
            policy: 1,
            data: {}
        }
    }

    handleOk = () => {
        let { warrantyVO } = this.state.list;
        const { getFieldValue } = this.props.form;
        console.log(warrantyVO);
        this.props.form.validateFieldsAndScroll(err => {
            console.log(err);
            if(!!err) return;

            this.state.data.id = warrantyVO.id;
            this.state.data.notPassReason = getFieldValue('auditNotPassReason');
            this.failReview().then(data => {
                if(data.success) {
                    this.setState({
                        visible: false
                    });
                    location.href = 'repairOrderManage.html';
                }
            });
        });
    }

    handleCancel = () => {
        this.setState({
            visible: false
        });
    }

    handleNotPass = () => {
        this.setState({
           visible: true
        });
    }

    handlePass = () => {
        let { warrantyVO } = this.state.list;
        this.state.data.id = warrantyVO.id;
        this.state.data.schemeId = this.state.list.insuranceOrder.scheme;
        if(warrantyVO.status == '1') {
            this.schemeReview().then(data => {
                if(data.success) {
                    location.href = 'repairOrderManage.html';
                }
            });
        }else if(warrantyVO.status == '3') {
            this.moneyReview().then(data => {
                if(data.success) {
                    location.href = 'repairOrderManage.html';
                }
            });
        }
    }

    /**
     *
     * @returns {*}
     */
    render() {
        const {getFieldDecorator, getFieldValue} = this.props.form;
        let _this = null;
        if (this.props._this) {
            _this = this.props._this;
        }
        const that = this;
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
                        {
                            getFieldDecorator('isActiveImmediately', {
                                initialValue: this.state.list.warrantyVO ? this.state.list.warrantyVO.insuranceActiveNow : '0'
                            })(
                                <Radio.Group disabled={true}>
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
                                        <Input style={{width: '200'}} disabled={true}></Input>
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
                                        <DatePicker disabled={true}/>
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
                            {
                                getFieldDecorator('repairMode', {
                                    initialValue: this.state.list.warrantyVO.repairMode,
                                })(
                                    <Radio.Group disabled={true}>
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
                                    <Input style={{width: '200'}} disabled={true}></Input>
                                )
                            }
                            公里
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
                        {getFieldValue('repairMode') != '3' ? isFactoryInsurance : ''}
                        <div style={getFieldValue('repairMode') != '3' ? {display: 'block'} : {display: 'none'}}>
                            <FormItem label={'维修商名称'} {...formItemLayout}>
                                {
                                    getFieldDecorator('maintenanceName', {
                                        initialValue: this.state.list.warrantyVO.repairShopName
                                    })(
                                        <Input style={{ width: 200}} disabled={true}/>
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
                                style={{width: 300, height: 150}}
                                list={this.state.list.warrantyVO.picUrlList}
                            >
                            </RJCarousel>
                        </FormItem>

                        <div style={getFieldValue('repairMode') != 3 ? {display: 'block'} : {display: 'none'}}>
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
                        <FormItem {...formItemLayout} label={'免赔原因:'} style={getFieldValue('repairMode') == '3' ? {display: 'block'} : {display: 'none'}}>
                            {
                                getFieldDecorator('freeReason', {
                                    initialValue: this.state.list.warrantyVO.refuseReason
                                })(
                                    <Input style={{ width: '200' }} disabled={true}/>
                                )
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label={'拒赔原因:'} style={getFieldValue('repairMode') == '2' ? {display: 'block'} : {display: 'none'}}>
                            {
                                getFieldDecorator('refuseReason', {
                                    initialValue: this.state.list.warrantyVO.refuseReason
                                })(
                                    <Input style={{ width: '200' }} disabled={true}/>
                                )
                            }
                        </FormItem>
                    </Form>
                    <Modal title={'请填写不通过原因'}
                           visible={this.state.visible}
                           onOk={this.handleOk}
                           onCancel={this.handleCancel}
                    >
                        <Form>
                            <FormItem {...formItemLayout}>
                                {
                                    getFieldDecorator('auditNotPassReason', {
                                        rules: [{
                                            required: true,
                                            message: '请输入不通过原因'
                                        }]
                                    })(
                                        <Input type="textarea" placeholder={'请输入'}/>
                                    )
                                }
                            </FormItem>
                        </Form>
                    </Modal>
                    <div style={{textAlign:'center'}}>
                        <Button onClick={this.handleNotPass}>不通过</Button>
                        <Button type={'primary'} style={{marginLeft: 200}} onClick={this.handlePass}>通过</Button>
                    </div>
                </div>
            );
        }
        return null;
    }

}

ClaimOrderCheck = Form.create()(ClaimOrderCheck);
ReactDom.render(<div><ClaimOrderCheck></ClaimOrderCheck></div>, document.querySelector("#content"));
