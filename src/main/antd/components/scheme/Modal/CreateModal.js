import React from 'react'
import PropTypes from 'prop-types'

import {Modal, Form,  Input ,Select, InputNumber, Radio} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import { convertSchemeBusinessType } from '../../../pages/utils/utils';



function CreateModal(props) {
    const {
        createSchemeClaimVisible,
        handleSaveCreateSchemeClaim,
        handleCancelCreateSchemeClaim,
        schemeInfo,
    } = props
    if(!createSchemeClaimVisible){
        return null
    }
    function handleSave() {
        props.form.validateFields((err, values) => {
            if (!err) {
                handleSaveCreateSchemeClaim(values);
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
                title="创建质保方案报修预警"
                visible={createSchemeClaimVisible}
                onOk={handleSave}
                onCancel={handleCancelCreateSchemeClaim}
                okText="保存"
            >
                <Form>
                    <FormItem {...formItemLayout}   label="方案信息">
                      <div>
                          {schemeInfo.qaName}-{schemeInfo.productName}
                      </div>
                        <div> 业务类型：{convertSchemeBusinessType(schemeInfo.businessType)}</div>
                        <div>
                            <div> 年限：{schemeInfo.expiresYear}年</div>
                            <div> 价格：{schemeInfo.basicPrice}元</div>

                            <div> 排量（L）：{schemeInfo.engineVolumeDown}L-{schemeInfo.engineVolumeUp}L</div>
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
                        })(
                            <InputNumber placeholder="维修金额上限" min={0} max={110000} style={{width: 200}}/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout}   label="备注信息">
                        {
                            props.form.getFieldDecorator('remark', {
                                rules: [{
                                    required: true,message : '备注信息',
                                }]
                            })(
                                <Input type="textarea" style={{ width: 200}} placeholder="备注信息"/>
                            )
                        }
                    </FormItem>
                    <FormItem {...formItemLayout}   label="是否立即上架">
                        {
                            props.form.getFieldDecorator('claimConfigStatus', {
                                rules: [{
                                    required: true,message : '是否立即上架',
                                }]
                            })(
                                <Select style={{ width: 200 }} placeholder="请选择"
                                >
                                    <Option key={"INIT"}>不上架</Option>
                                    <Option key={"ON"}>上架</Option>
                                </Select>
                            )
                        }
                    </FormItem>

                </Form>
            </Modal>
        </div>
    )

}

CreateModal.propTypes = {
    createSchemeClaimVisible: PropTypes.bool,
    handleCancelCreateSchemeClaim: PropTypes.func,
    handleSaveCreateSchemeClaim: PropTypes.func,
    schemeInfo:PropTypes.object,
}


CreateModal.defaultProps = {
    createSchemeClaimVisible: false,
}

const WrapperedCreateModal = Form.create()(CreateModal);
export default WrapperedCreateModal;
