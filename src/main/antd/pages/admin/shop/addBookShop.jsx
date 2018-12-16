import React from 'react';
import ReactDom from 'react-dom';
import SADPage from '@souche-f2e/sad';
import '../../../styles/index.less';

/**
 * 这里声明要引入的组件
 */
import { Form, Input, Button, Table, Popconfirm, DatePicker } from 'antd';
import { RJAreaCascader, SubmitButton } from '@souche-f2e/sad/components/RJAntd';

const FormItem = Form.Item;

/**
 * 新增店铺
 */
class AddBookShop extends SADPage {
    constructor() {
        super();
        this.state = {
            query:{},
            status: {}
        }
    }

    /**
     * 提交
     */
    handSubmit = (status) => {
        this.state.query = this.props.form.getFieldsValue();
        this.state.query.authStatus = status;
            this.addShop().then(data => {
            if (data.success) {
                alert('新增店铺成功！');
                this.handleReset();
                return;
            }
        });
    }

    /**
     * 清除查询条件
     */
    handleReset = () => {
        this.setState({query: {}});
        this.props.form.resetFields();
    }

    /**
     *
     * @returns {*}
     */
    render() {
        const {getFieldDecorator} = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: { span: 10 },
                sm: { span: 2 },
            },
            wrapperCol: {
                xs: { span: 11 },
                sm: { span: 10 },
            }
        };

        if (this.stateAlready) {

            return (
                <div>
                    <h1>宽带预定-新增店铺</h1>
                    <br/><br/>
                    <div style={{marginLeft: 200, marginRight:10}} >
                        <Form>
                            <FormItem label={'店铺名称'} {...formItemLayout}>
                                {
                                    getFieldDecorator('shopName', {
                                        rules: [{
                                            required: true, message: '请输入店铺名称',
                                            min: 2, max: 100
                                        }]
                                    })(
                                        <Input style={{ width: 200}}/>
                                    )
                                }
                            </FormItem>
                            <FormItem label={'店铺老板名字'} {...formItemLayout}>
                                {
                                    getFieldDecorator('shopOwnerName', {
                                        rules: [{
                                            required: true, message: '请输入老板名字',
                                            min: 2, max: 100
                                        }]
                                    })(
                                        <Input style={{ width: 200}}/>
                                    )
                                }
                            </FormItem>
                            <FormItem label={'电话'} {...formItemLayout}>
                                {
                                    getFieldDecorator('shopPhone', {
                                        rules: [{
                                            required: true, message: '请输入电话',
                                            pattern: '((\\d{11})|^((\\d{7,8})|(\\d{4}|\\d{3})-(\\d{7,8})|(\\d{4}|\\d{3})-(\\d{7,8})-(\\d{4}|\\d{3}|\\d{2}|\\d{1})|(\\d{7,8})-(\\d{4}|\\d{3}|\\d{2}|\\d{1}))$)'
                                        }]
                                    })(
                                        <Input style={{ width: 200}}/>
                                    )
                                }
                            </FormItem>
                            <FormItem label={'地址'} {...formItemLayout}>
                                {
                                    getFieldDecorator('shopAddress', {
                                        rules: [{
                                            required: true, message: '请输入地址'
                                        }]
                                    })(
                                        <Input placeholder={'请输入店铺的详细地址'}></Input>
                                    )
                                }
                            </FormItem>

                            <FormItem label="备注" required={false} {...formItemLayout}>
                                {getFieldDecorator(`remarks`)(
                                    <Input type={'textarea'} placeholder="备注" autosize />
                                )}
                            </FormItem>
                        </Form>
                        <div>
                            <SubmitButton
                                type="primary"
                                style={{marginLeft: 180, marginRight:10}}
                                onClick={() =>this.handSubmit(1)}>立即使用</SubmitButton>
                            <SubmitButton
                                type="primary"
                                style={{marginLeft: 10, marginRight:10}}
                                onClick={() =>this.handSubmit(0)}>保存</SubmitButton>
                            <Button onClick={() => this.handleReset()}>清空</Button>
                        </div>
                    </div>

                </div>
            );
        }

        return null;
    }

}

AddBookShop = Form.create()(AddBookShop);
ReactDom.render(<div><AddBookShop></AddBookShop></div>, document.querySelector("#content"));
