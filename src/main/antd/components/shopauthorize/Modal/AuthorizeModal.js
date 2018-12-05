import React from 'react'
import PropTypes from 'prop-types'

import {Modal, Form,  Checkbox, InputNumber, Radio} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;


function AuthorizeModal(props) {
    const {
        authorizeVisible,
        handleAuthorize,
        handleCancelAuthorize,
        productAuthorizeRecord,
    } = props
    if(!authorizeVisible){
        return null
    }
    function handleSave() {
        props.form.validateFields((err, values) => {
            if (!err) {
                handleAuthorize(values);
            }
        });
    }

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
        },
    };

    return (

        <div>
            <Modal
                title="质保授权"
                visible={authorizeVisible}
                onOk={handleSave}
                onCancel={handleCancelAuthorize}
                okText="授权"
            >
                <Form>

                    <FormItem
                        {...formItemLayout}
                        label="是否检测"
                    >
                        {props.form.getFieldDecorator('detection', {
                            rules: [{
                                required: true,message: '请选择是否检测',
                            }],
                            initialValue:productAuthorizeRecord.detection
                        })(
                            <RadioGroup>
                                <Radio value={0}>免检</Radio>
                                <Radio value={1}>检测</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="车商风险系数"
                    >
                        {props.form.getFieldDecorator('riskRatio', {
                            rules: [{
                                required: true, message: '请填写风险系数0~10!',
                            }],
                            initialValue:productAuthorizeRecord.riskRatio
                        })(
                            <InputNumber placeholder="风险系数0.0~1.0" min={0.1} max={10} style={{width: 200}}/>
                        )}
                    </FormItem>
                    { productAuthorizeRecord.shopType=='che168'?
                        <FormItem
                            {...formItemLayout}
                            label="车商角色"
                        >
                            {props.form.getFieldDecorator('shopRole', {
                                rules: [{
                                    required: true,message: '请选择车商角色',
                                }],
                                initialValue:productAuthorizeRecord.shopRole
                            })(
                                <RadioGroup>
                                    <Radio value={"general"}>普通车商</Radio>
                                    <Radio value={"proxyMerchant"}>代理商</Radio>
                                </RadioGroup>
                            )}
                        </FormItem>:''}
                    { productAuthorizeRecord.shopType=='che168'?
                        <FormItem
                            {...formItemLayout}
                            label="普通车商折扣"
                        >
                            {props.form.getFieldDecorator('generalRoleDiscount', {
                                rules: [{
                                    required: true, message: '请填写普通车商折扣!',
                                }],
                                initialValue:productAuthorizeRecord.generalRoleDiscount
                            })(
                                <InputNumber placeholder="60 代表6折 %" min={0} max={100} style={{width: 200}}/>
                            )}
                        </FormItem>:''}
                    { productAuthorizeRecord.shopType=='che168'?
                        <FormItem
                            {...formItemLayout}
                            label="代销商折扣"
                        >
                            {props.form.getFieldDecorator('proxyMerchantRoleDiscount', {
                                rules: [{
                                    required: true, message: '请填写代理商折扣!',
                                }],
                                initialValue:productAuthorizeRecord.proxyMerchantRoleDiscount
                            })(
                                <InputNumber placeholder="60 代表6折 %" min={0} max={100} style={{width: 200}}/>
                            )}
                        </FormItem>
                        :''}
                </Form>
            </Modal>
        </div>
    )

}

AuthorizeModal.propTypes = {
    authorizeVisible: PropTypes.bool,
    handleAuthorize: PropTypes.func,
    handleCancelAuthorize: PropTypes.func,
    productAuthorizeRecord:PropTypes.object,
}


AuthorizeModal.defaultProps = {
    authorizeVisible: false,
}

const WrapperedAuthorizeModal = Form.create()(AuthorizeModal);
export default WrapperedAuthorizeModal;
