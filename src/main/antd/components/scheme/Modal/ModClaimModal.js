import React from 'react'
import PropTypes from 'prop-types'

import {Modal, Form,  Input ,Checkbox, InputNumber, Radio} from 'antd';
const FormItem = Form.Item;
import { convertSchemeBusinessType } from '../../../pages/utils/utils';


function ModClaimModal(props) {
    const {
        modSchemeClaimVisible,
        handleModeSchemeClaim,
        handleCancelModSchemeClaim,
        record,
    } = props
    if(!modSchemeClaimVisible){
        return null
    }
    function handleSave() {
        props.form.validateFields((err, values) => {
            if (!err) {
                handleModeSchemeClaim(values);
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
                title="修改质保方案报修预警"
                visible={modSchemeClaimVisible}
                onOk={handleSave}
                onCancel={handleCancelModSchemeClaim}
                okText="修改"
            >
                <Form>
                    <FormItem {...formItemLayout}   label="方案信息">
                      <div>
                          {record.qaName}-{record.productName}
                      </div>
                        <div> 业务类型：{convertSchemeBusinessType(record.businessType)}</div>
                        <div>
                            <div> 年限：{record.expiresYear}年</div>
                            <div> 价格：{record.basicPrice}元</div>

                            <div> 排量（L）：{record.engineVolumeDown}L-{record.engineVolumeUp}L</div>
                        </div>
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="维修次数上限"
                    >
                        {props.form.getFieldDecorator('serviceCount', {
                            rules: [{
                                required: true, message: '维修次数上限!',
                            }],
                            initialValue:record.serviceCount,
                        })(
                            <InputNumber placeholder="维修次数上限" min={0} max={20} step={1} precision={0} style={{width: 200}}/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="维修金额上限"
                    >
                        {props.form.getFieldDecorator('serviceTotalAmount', {
                            rules: [{
                                required: true, message: '维修金额上限!',
                            }],
                            initialValue:record.serviceTotalAmount,
                        })(
                            <InputNumber placeholder="维修金额上限" min={0} max={110000} style={{width: 200}}/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout}   label="备注信息">
                        {
                            props.form.getFieldDecorator('remark', {
                                rules: [{
                                    required: true,message : '备注信息',
                                }],
                                initialValue:record.remark,
                            })(
                                <Input type="textarea" style={{ width: 200}} placeholder="备注信息"/>
                            )
                        }
                    </FormItem>
                </Form>
            </Modal>
        </div>
    )

}

ModClaimModal.propTypes = {
    modSchemeClaimVisible: PropTypes.bool,
    handleCancelModSchemeClaim: PropTypes.func,
    handleModeSchemeClaim: PropTypes.func,
    record:PropTypes.object,
}


ModClaimModal.defaultProps = {
    modSchemeClaimVisible: false,
}

const WrapperedModClaimModal = Form.create()(ModClaimModal);
export default WrapperedModClaimModal;
