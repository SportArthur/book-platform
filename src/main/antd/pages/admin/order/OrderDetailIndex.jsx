import React from 'react';
import ReactDom from 'react-dom';
import SADPage from '@souche-f2e/sad';
import '../../../styles/index.less';
/*
 * 这里声明要引入的组件
 */
import {Modal, Card,Input ,Button,Form,message,Popconfirm, Checkbox, Radio,Row,Col} from 'antd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const moment = require('moment');

const CheckboxGroup = Checkbox.Group;

import {
    convertOrderSource,
    convertIsFactoryInsurance,
    convertIsFactoryLimitMileage,
    convertBaoyangStatus,
    convertQaActive,
    convertQaStatus,
    convertCommissionStatus,
    convertOrderWorkflowStatus,
    convertIsAccdentCar,
    convertExtInsureStatus,
    formatTime,
    convertLeaseAfterStatus,
    convertExtTableMileage,
    convertQaType
} from '../../utils/utils';
import { RJImageZoom } from '@souche-f2e/sad/components/RJAntd';



/**
 * 车商合同详情页面--中规车（二手车）
 */
class OrderDetailIndex extends SADPage {
    constructor() {
        super();
        this.state = {
            query:{},
            orderDetail: {},
            show:'',
            auditNotPassReasonRequried:false,
            from:''
        }
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
            let auditParam = this.props.form.getFieldsValue();
            if(auditParam.qaActive!=4){
                if(auditParam.auditNotPassReason==null){
                    message.error('请填写审核备注');
                    return;
                }
            }
            auditParam.qaId=this.state.orderDetail.insuranceOrder.qaId;
            this.state.auditParam = auditParam;
            this.auditQaOrder().then(data => {
                if (data.success) {
                    location.reload(true)
                }
                ;
            })

        })
    }
    handReturn = (e) => {
        window.close();
    }

    onChange = (e) => {
        let value=e.target.value;
        if(value==4){
            this.setState({
                show: 'none',
                auditNotPassReasonRequried:false,
            });
        }else{
            this.setState({
                show: '',
                auditNotPassReasonRequried:true
            });
            this.props.form.validateFields(['auditNotPassReason'], { force: true });
        }

    }
    confirm(e) {
        handSubmit(e)
    }

    cancel(e) {

    }

    /**
     *
     * @returns {*}
     */
    render() {
        const { getFieldDecorator } = this.props.form;

        if (this.stateAlready) {
            console.log(this.state)
            let insuranceOrder=this.state.orderDetail.insuranceOrder;
            let insuranceCar=this.state.orderDetail.insuranceCar;
            let insuranceScheme=this.state.orderDetail.insuranceOrder.insuranceOrderSchemeInfo;
            let insuranceAuthHistory=this.state.orderDetail.authHistoryList;

            let hasFrom= this.state.from !='';
            let hasAudit =
                (insuranceOrder.qaStatus===1 && insuranceOrder.qaActive===0
                && insuranceOrder.platform!==3) ;

            let hideAudit = (hasFrom && hasAudit) ? '':'none';
            const formItemLayout = {
                labelCol: {
                    xs: { span: 24 },
                    sm: { span: 8 },
                },
                wrapperCol: {
                    xs: { span: 16 },
                    sm: { span: 8 },
                },
            };
            return (
                <div>
                <h1>质保-订单详情</h1>
                <Card title="订单详情"  style={{ float:'center' }}>

                    <div>
                    <span><h3>基本信息</h3></span>
                    <div>
                        <table>
                            <tbody>
                            <tr>
                                <td width="120">质保ID:</td>
                                <td width="180"
                                    style={{textAlign: 'left'}}>{insuranceOrder.qaId}</td>
                                <td width="120">订单编号:</td>
                                <td width="180"
                                    style={{textAlign: 'left'}}>{insuranceOrder.orderCode}</td>
                            </tr>
                            <tr>
                                <td width="120">创建时间:</td>
                                <td width="150"
                                    style={{textAlign: 'left'}}>{insuranceOrder.dateCreate}</td>
                                <td width="120">支付状态:</td>
                                <td style={{textAlign: 'left'}}>{convertQaStatus(insuranceOrder.qaStatus)}</td>
                            </tr>

                            <tr>
                                <td width="120">支付单号:</td>
                                <td width="150"
                                    style={{textAlign: 'left'}}>{insuranceOrder.paymentOrderCode}</td>
                                <td width="120">订单状态:</td>
                                <td width="150"
                                    style={{textAlign: 'left'}}>{convertOrderWorkflowStatus(insuranceOrder.workflowStatusCode)}</td>
                            </tr>
                            <tr>
                                <td width="120">订单金额:</td>
                                <td style={{textAlign: 'left'}}>{insuranceOrder.usedPrice}元</td>
                                <td width="120">支付金额:</td>
                                <td style={{textAlign: 'left'}}>{insuranceOrder.shouldPayPrice}元</td>
                            </tr>
                            <tr>
                                <td width="120">折扣:</td>
                                <td >{insuranceOrder.discountProportion}%</td>
                            </tr>
                            <tr>
                                <td>订单来源:</td>
                                <td style={{textAlign: 'left'}}>{convertOrderSource(insuranceOrder.orderSource)}</td>
                                <td>佣金状态:</td>
                                <td style={{textAlign: 'left'}}>{convertCommissionStatus(insuranceOrder.commissionStatus)}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <br/>
                    <span><h3>车辆信息</h3></span>
                    <div>
                        <table>
                            <tbody>

                            <tr>
                                <td width="120">品牌:</td>
                                <td width="180"
                                    style={{textAlign: 'left'}}>{insuranceCar.brandName}</td>
                                <td width="120">车系:</td>
                                <td style={{textAlign: 'left'}}>{insuranceCar.seriesName}</td>
                            </tr>
                            <tr>
                                <td width="120">VIN:</td>
                                <td width="150"
                                    style={{textAlign: 'left'}}>{insuranceCar.vinNumber}</td>
                                <td width="120">车辆名称	:</td>
                                <td width="150"
                                    style={{textAlign: 'left'}}>{insuranceCar.modelName}</td>
                            </tr>
                            <tr>
                                <td width="120">首次上牌:</td>
                                <td style={{textAlign: 'left'}}>{insuranceCar.firstLicensePlateDateString}</td>
                                <td width="120">排量:</td>
                                <td style={{textAlign: 'left'}}>{insuranceCar.engineVolume}L</td>
                            </tr>

                            <tr>
                                <td width="120">车身结构:</td>
                                <td style={{textAlign: 'left'}}>{insuranceCar.bodyName}</td>

                                <td width="120">使用性质:</td>
                                <td style={{textAlign: 'left'}}>{insuranceCar.useTypeName}</td>

                            </tr>
                            <tr>
                                <td width="120">燃油类型:</td>
                                <td style={{textAlign: 'left'}}>{insuranceCar.fuelTypeName}</td>
                                <td width="120">核载人数:</td>
                                <td style={{textAlign: 'left'}}>{insuranceCar.seetNumberName}</td>
                            </tr>
                            <tr>
                                <td width="120">车辆所在地:</td>
                                <td width="150"
                                    style={{textAlign: 'left'}}>{insuranceOrder.area}</td>
                                <td width="120">生产日期:</td>
                                <td style={{textAlign: 'left'}}>{moment(insuranceCar.productionDate).format('YYYY-MM')}</td>
                            </tr>
                            <tr>
                                <td width="120">车商编码:</td>
                                <td style={{textAlign: 'left'}}>{insuranceOrder.shopCode}</td>
                                <td width="120">车商名称:</td>
                                <td style={{textAlign: 'left'}}>{insuranceOrder.shopName}</td>
                            </tr>
                            <tr>
                                <td width="120">卖家:</td>
                                <td style={{textAlign: 'left'}}>{insuranceOrder.sellerName}</td>
                                <td width="120">手机号码:</td>
                                <td style={{textAlign: 'left'}}>{insuranceOrder.sellerPhone}</td>
                            </tr>

                            <tr>
                                <td width="120">车牌号码:</td>
                                <td style={{textAlign: 'left'}}>{insuranceOrder.plate}</td>
                                <td width="120">车辆类型:</td>
                                <td style={{textAlign: 'left'}}>{convertQaType(insuranceOrder.qaType)}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <br/>
                    <span><h3>质保方案信息</h3></span>
                    <div>
                        <table>
                            <tbody>
                            <tr>
                                <td width="120">方案名称:</td>
                                <td width="180"
                                    style={{textAlign: 'left'}}>{insuranceScheme.productName}</td>
                                <td width="120">方案明细	:</td>
                                <td width="180"
                                    style={{textAlign: 'left'}}>{insuranceScheme.qaName}-{insuranceScheme.name}</td>
                            </tr>
                            <tr>
                                <td width="120">报修范围:</td>
                                <td width="150"
                                    style={{textAlign: 'left'}}>{insuranceScheme.parts}</td>
                                <td width="120">质保年限:</td>
                                <td style={{textAlign: 'left'}}>{insuranceScheme.expiresYear}年{insuranceScheme.expiresYearKilometers}公里</td>
                            </tr>
                            <tr>
                                <td width="120">赔偿限额:</td>
                                <td style={{textAlign: 'left'}}>{insuranceScheme.compensateLimit}元/每年</td>
                                <td width="120">增值服务:</td>
                                <td style={{textAlign: 'left'}}>{insuranceScheme.freeService}</td>
                            </tr>
                            <tr>
                                <td width="120">保费金额:</td>
                                <td style={{textAlign: 'left'}}>{insuranceScheme.basicPrice}</td>
                            </tr>
                            <tr>
                                <td width="120">质保状态:</td>
                                <td style={{textAlign: 'left'}}>{convertQaActive(insuranceOrder.qaActive)}</td>
                                <td width="120">合同状态:</td>
                                <td style={{textAlign: 'left'}}>{(insuranceOrder.contractSerialNumber!=null
                                && insuranceOrder.contractSerialNumber!='')?'已签署':'未签署'}</td>
                            </tr>
                            <tr>
                                <td width="120">合同签署时间:</td>
                                <td style={{textAlign: 'left'}}>{insuranceOrder.signContractDate}</td>
                                <td width="120">合同编码:</td>
                                <td style={{textAlign: 'left'}}>{insuranceOrder.contractSerialNumber!=null ?
                                    <a target="_blank" title="查看合同"
                                       href={`/admin/order/OrderContractDetailIndex.html?contractNo=${insuranceOrder.contractSerialNumber}`}>{insuranceOrder.contractSerialNumber}</a>:''}</td>
                            </tr>

                            </tbody>
                        </table>
                    </div>
                    <br/>
                    <span><h3>客户信息</h3></span>
                    <div>
                        <table>
                            <tbody>
                            <tr>
                                <td width="120">客户姓名:</td>
                                <td width="180"
                                    style={{textAlign: 'left'}}>{insuranceOrder.buyerName}</td>
                                <td width="120">客户身份证号	:</td>
                                <td width="180"
                                    style={{textAlign: 'left'}}>{insuranceOrder.buyerIdentityId}</td>
                            </tr>
                            <tr>
                                <td width="120">客户手机:</td>
                                <td width="150"
                                    style={{textAlign: 'left'}}>{insuranceOrder.buyerPhone}</td>
                                <td width="120">客户地址:</td>
                                <td style={{textAlign: 'left'}}>{insuranceOrder.buyerAddress}</td>
                            </tr>
                            <tr>
                                <td width="120">是否支持厂家质保:</td>
                                <td style={{textAlign: 'left'}}>{convertIsFactoryInsurance(insuranceOrder.isFactoryInsurance)}</td>
                                <td width="120">厂家质保年限:</td>
                                <td style={{textAlign: 'left'}}>{insuranceOrder.factoryInsuranceYear}年</td>
                            </tr>
                            <tr>
                                <td width="120">厂家是否限制里程:</td>
                                <td style={{textAlign: 'left'}}>{convertIsFactoryLimitMileage(insuranceOrder.isFactoryLimitMileage)}</td>
                            </tr>
                            <tr>
                                <td width="120">厂家质保里程:</td>
                                <td width="150"
                                    style={{textAlign: 'left'}}>{insuranceOrder.factoryInsuranceYearKilometers}万公里</td>
                                <td width="120">表显里程:</td>
                                {insuranceOrder.qaType == 1 ?
                                    <td style = {{textAlign: 'left'}}>{insuranceOrder.tableMileage}万公里</td> :
                                    <td style={{textAlign: 'left'}}>{parseFloat(insuranceOrder.tableMileage * 10000).toFixed(1)}公里</td>
                                }
                            </tr>
                            <tr>
                                <td width="120">是否有事故:</td>
                                <td style={{textAlign: 'left'}}>{convertIsAccdentCar(insuranceOrder.isAccidentCar)}</td>
                            </tr>
                            <tr>
                                <td width="120">质保申请单:</td>
                                <td width="150"
                                    style={{textAlign: 'left'}}>
                                    <RJImageZoom
                                        src={insuranceOrder.carPurchaseContract}
                                        style={{width: 180}}
                                        onRotate={() => {console.log('rotate')}}
                                        onCloseRequest={() => {console.log('close')}}
                                        layout="inline-block"
                                        imageTitle="图片名称"
                                        imageCaption="描述内容">
                                    </RJImageZoom>
                                </td>
                                <td width="120">质检报告:</td>
                                <td style={{textAlign: 'left'}}>

                                    <RJImageZoom
                                        src={insuranceOrder.carPurchaseReceipt}
                                        style={{width: 180}}
                                        onRotate={() => {console.log('rotate')}}
                                        onCloseRequest={() => {console.log('close')}}
                                        layout="inline-block"
                                        imageTitle="图片名称"
                                        imageCaption="描述内容">
                                    </RJImageZoom>
                                </td>
                            </tr>
                            <tr>
                                <td width="120">行驶证/登记证:</td>
                                <td width="150"
                                    style={{textAlign: 'left'}}>
                                    <RJImageZoom
                                        src={insuranceOrder.carDrivingLicense}
                                        style={{width: 180}}
                                        onRotate={() => {console.log('rotate')}}
                                        onCloseRequest={() => {console.log('close')}}
                                        layout="inline-block"
                                        imageTitle="图片名称"
                                        imageCaption="描述内容">
                                    </RJImageZoom>
                                </td>
                                <td width="120">过户发票/交易合同:</td>
                                <td style={{textAlign: 'left'}}>

                                    <RJImageZoom
                                        src={insuranceOrder.carPurchaseInvoice}
                                        style={{width: 180}}
                                        onRotate={() => {console.log('rotate')}}
                                        onCloseRequest={() => {console.log('close')}}
                                        layout="inline-block"
                                        imageTitle="图片名称"
                                        imageCaption="描述内容">
                                    </RJImageZoom>
                                </td>
                            </tr>
                            <tr>
                                <td width="120">车辆一致性证书:</td>
                                <td width="150"
                                    style={{textAlign: 'left'}}>
                                    <RJImageZoom
                                        src={insuranceOrder.oneTimeCertificatePic}
                                        style={{width: 180}}
                                        onRotate={() => {console.log('rotate')}}
                                        onCloseRequest={() => {console.log('close')}}
                                        layout="inline-block"
                                        imageTitle="图片名称"
                                        imageCaption="描述内容">
                                    </RJImageZoom>

                                </td>
                                <td width="120">车辆一致性证书反面:</td>
                                <td style={{textAlign: 'left'}}>
                                    <RJImageZoom
                                        src={insuranceOrder.oneTimeCertificateBackPic}
                                        style={{width: 180}}
                                        onRotate={() => {console.log('rotate')}}
                                        onCloseRequest={() => {console.log('close')}}
                                        layout="inline-block"
                                        imageTitle="图片名称"
                                        imageCaption="描述内容">
                                    </RJImageZoom>
                                </td>
                            </tr>
                            <tr>
                                <td width="120">购车发票:</td>
                                <td style={{textAlign: 'left'}}>

                                    <RJImageZoom
                                        src={insuranceOrder.buyCarInvoicePic}
                                        style={{width: 180}}
                                        onRotate={() => {console.log('rotate')}}
                                        onCloseRequest={() => {console.log('close')}}
                                        layout="inline-block"
                                        imageTitle="图片名称"
                                        imageCaption="描述内容">
                                    </RJImageZoom>
                                </td>
                            </tr>
                            <tr>
                                <td width="120">报关单:</td>
                                <td width="150"
                                    style={{textAlign: 'left'}}>
                                    <RJImageZoom
                                        src={insuranceOrder.customsDeclarationPic}
                                        style={{width: 180}}
                                        onRotate={() => {console.log('rotate')}}
                                        onCloseRequest={() => {console.log('close')}}
                                        layout="inline-block"
                                        imageTitle="图片名称"
                                        imageCaption="描述内容">
                                    </RJImageZoom>

                                </td>
                                <td width="120">商检单:</td>
                                <td style={{textAlign: 'left'}}>
                                    <RJImageZoom
                                        src={insuranceOrder.inspectSheetPic}
                                        style={{width: 180}}
                                        onRotate={() => {console.log('rotate')}}
                                        onCloseRequest={() => {console.log('close')}}
                                        layout="inline-block"
                                        imageTitle="图片名称"
                                        imageCaption="描述内容">
                                    </RJImageZoom>

                                </td>
                            </tr>
                            <tr>
                                <td width="120">身份证正面:</td>
                                <td width="150"
                                    style={{textAlign: 'left'}}>
                                    <RJImageZoom
                                        src={insuranceOrder.idCardFacePic}
                                        style={{width: 180}}
                                        onRotate={() => {console.log('rotate')}}
                                        onCloseRequest={() => {console.log('close')}}
                                        layout="inline-block"
                                        imageTitle="图片名称"
                                        imageCaption="描述内容">
                                    </RJImageZoom>
                                </td>
                                <td width="120">身份证反面:</td>
                                <td style={{textAlign: 'left'}}>

                                    <RJImageZoom
                                        src={insuranceOrder.idCardBackPic}
                                        style={{width: 180}}
                                        onRotate={() => {console.log('rotate')}}
                                        onCloseRequest={() => {console.log('close')}}
                                        layout="inline-block"
                                        imageTitle="图片名称"
                                        imageCaption="描述内容">
                                    </RJImageZoom>
                                </td>
                            </tr>
                            <tr>
                                <td width="120">表显里程照片:</td>
                                <td style={{textAlign: 'left'}}>
                                    <RJImageZoom
                                        src={insuranceOrder.carTableMileagePic}
                                        style={{width: 180}}
                                        onRotate={() => {console.log('rotate')}}
                                        onCloseRequest={() => {console.log('close')}}
                                        layout="inline-block"
                                        imageTitle="图片名称"
                                        imageCaption="描述内容">
                                    </RJImageZoom>

                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <br/>
                    <span><h3>延保信息</h3></span>
                    <div>
                        <table>
                            <tbody>
                            <tr>
                                <td width="120">延保状态:</td>
                                <td width="180"
                                    style={{textAlign: 'left'}}>{convertExtInsureStatus(insuranceOrder.extInsureChanceStatus)}</td>
                                <td width="120">融租信息:</td>
                                <td width="180"
                                    style={{textAlign: 'left'}}>{convertLeaseAfterStatus(insuranceOrder.extInsureChanceLeaseHandleType)}</td>
                            </tr>
                            <tr>
                                <td width="120">融租期理赔:</td>
                                <td width="180"
                                    style={{textAlign: 'left'}}>{insuranceOrder.extInsureChanceEffectiveClaimStatus == 'Y' ? '有' : '无'}</td>
                                <td width="120">融租期行驶里程:</td>
                                <td width="180"
                                    style={{textAlign: 'left'}}>{convertExtTableMileage(insuranceOrder.extInsureChanceInitGpsMileage,insuranceOrder.extInsureChanceContractEndGpsMileage)}公里</td>
                            </tr>
                            <tr>
                                <td width="120">生效日:</td>
                                <td width="180"
                                    style={{textAlign: 'left'}}>{formatTime(insuranceOrder.extInsureChanceEffectiveStartDate)}</td>
                                <td width="120">截止日:</td>
                                <td width="180"
                                    style={{textAlign: 'left'}}>{formatTime(insuranceOrder.extInsureChanceEffectiveEndDate)}</td>
                            </tr>
                            <tr>
                                <td width="120">关闭原因:</td>
                                <td width="180"
                                    style={{textAlign: 'left'}}>{insuranceOrder.extInsureChanceNotAccordDesc}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <span><h3>审核信息</h3></span>
                    <div>
                        {
                            insuranceAuthHistory.map(row=>{
                                return (
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td width="120">审核人:</td>
                                                <td width="180"
                                                    style={{textAlign: 'left'}}>{row.operatorName}</td>
                                                <td width="120">审核时间:</td>
                                                <td width="180"
                                                    style={{textAlign: 'left'}}>{row.startTime}</td>
                                            </tr>
                                            <tr>
                                                <td width="120">审核结果:</td>
                                                <td width="180"
                                                    style={{textAlign: 'left'}}>{row.comment}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                )
                            })
                        }
                    </div>
                </div>
                </Card>
                <Card title="审核客户资料" style={{display:hideAudit}} >
                    <Form>
                    <Row>
                    <Col span={24} style={{ textAlign: 'center' }}>
                    <FormItem
                    {...formItemLayout}
                    label="审核结果"
                    >
                    {getFieldDecorator('qaActive', {
                        rules: [{
                            required: true,message: '请选择审核结果',
                        }]
                    })(
                        <RadioGroup onChange={this.onChange}>
                            <Radio value={4}>审核通过</Radio>
                            <Radio value={2}>重新提交资料</Radio>
                            <Radio value={3}>审核拒绝退款</Radio>
                        </RadioGroup>
                    )}
                    </FormItem>

                    </Col>
                    </Row>
                    <Row style={{display:this.state.show}}>
                    <Col span={24} style={{ textAlign: 'center' }}>
                    <FormItem {...formItemLayout}   label="审核不通过原因">
                    {
                        getFieldDecorator('auditNotPassReason', {
                            rules: [{
                                required: this.state.auditNotPassReasonRequried,message: '请输入审核不通过原因',
                            }]
                        })(
                            <Input type="textarea" style={{ width: 200}} placeholder="审核不通过原因"/>
                        )
                    }
                    </FormItem>
                    </Col>
                    </Row>
                    <Row>
                    <Col span={24} style={{ textAlign: 'center' }}>
                    <FormItem >
                        <Popconfirm title="确定提交审核？" onConfirm={this.handSubmit} onCancel={this.cancel()} okText="Yes" cancelText="No">
                            <Button size="large" type="primary" >审核</Button>
                        </Popconfirm>
                    &nbsp;

                        <Popconfirm title="确定关闭页面？" onConfirm={this.handReturn} onCancel={this.cancel()} okText="Yes" cancelText="No">
                            <Button type="primary" size="large">关闭页面</Button>
                        </Popconfirm>

                    </FormItem>

                    </Col>
                    </Row>
                    </Form>
                </Card>
                </div>

            );
        }
        return null;
    }

}

OrderDetailIndex = Form.create()(OrderDetailIndex);
ReactDom.render(<div><OrderDetailIndex></OrderDetailIndex></div>, document.querySelector("#content"));
