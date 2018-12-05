import React from 'react'
import PropTypes from 'prop-types'

import {Modal, Form,Input, Checkbox, InputNumber, Radio} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;


function EditOrderCustModal(props) {
    const {
        editCustVisible,
        handleCustomerSubmit,
        handleCustomerCancel,
        orderInfo,
    } = props
    if(!editCustVisible){
        return null
    }
    function handleSave() {
        props.form.validateFields((err, values) => {
            if (!err) {
                handleCustomerSubmit(values);
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
                title="编辑客户信息"
                visible={editCustVisible}
                onOk={handleSave}
                onCancel={handleCustomerCancel}
                okText="保存"
            >
                <Form>
                    <FormItem {...formItemLayout}   label="客户姓名">
                        {props.form.getFieldDecorator('buyerName', {
                            rules: [{
                                required: true, message: '请输入客户姓名',
                            }],
                            initialValue: orderInfo.buyerName,
                        })(
                            <Input style={{ width: 200}} placeholder="客户姓名"/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout}   label="手机号">
                        {props.form.getFieldDecorator('buyerPhone', {
                            rules: [{
                                required: true, message: '手机号',
                            }],
                            initialValue: orderInfo.buyerPhone,
                        })(
                            <Input style={{ width: 200}} placeholder="手机号"/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout}   label="客户身份证">
                        {props.form.getFieldDecorator('buyerIdentityId', {
                            rules: [{
                               required: true, message: '客户身份证',
                            }],
                            initialValue: orderInfo.buyerIdentityId,
                        })(
                            <Input style={{ width: 200}} placeholder="客户身份证"/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout}   label="客户联系地址">
                        {props.form.getFieldDecorator('buyerAddress', {
                            rules: [{
                                 message: '客户联系地址',
                            }],
                            initialValue: orderInfo.buyerAddress,

                        })(
                            <Input style={{ width: 200}} placeholder="客户联系地址"/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout}   label="车牌号">
                        {props.form.getFieldDecorator('plate', {
                            rules: [{
                                message: '车牌号',
                            }],
                            initialValue: orderInfo.plate

                        })(
                            <Input style={{ width: 200}} placeholder="车牌号"/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout}   label="备注">
                        {props.form.getFieldDecorator('remarks', {
                            rules: [{
                            }],
                            initialValue: orderInfo.remarks
                        })(
                            <Input type="textarea" style={{ width: 200}} placeholder="备注"/>
                        )}
                    </FormItem>

                </Form>
            </Modal>
        </div>
    )

}

EditOrderCustModal.propTypes = {
    editCustVisible: PropTypes.bool,
    handleAuthorize: PropTypes.func,
    handleCancelAuthorize: PropTypes.func,
    productAuthorizeRecord:PropTypes.object,
}


EditOrderCustModal.defaultProps = {
    authorizeVisible: false,
}

const WrapperedEditOrderCustModal = Form.create()(EditOrderCustModal);
export default WrapperedEditOrderCustModal;
