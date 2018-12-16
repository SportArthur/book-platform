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
 * 新增预定订单
 */
class AddBookOrder extends SADPage {
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
    handSubmit = () => {
        this.state.query = this.props.form.getFieldsValue();
        let shopCode = '';
        let url = window.location.href;
        shopCode = url.substr(url.indexOf('=')+1);

        this.state.query.shopCode = shopCode;
            this.addOrder().then(data => {
            if (data.success) {
                alert('新增预定安装订单成功！');
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
                    <h1>宽带预定-新增订单</h1>
                    <br/><br/>
                    <div style={{marginLeft: 200, marginRight:10}} >
                        <Form>
                            <FormItem label={'姓名'} {...formItemLayout}>
                                {
                                    getFieldDecorator('buyerName', {
                                        rules: [{
                                            required: true, message: '请输入姓名',
                                            min: 2, max: 10
                                        }]
                                    })(
                                        <Input style={{ width: 200}}/>
                                    )
                                }
                            </FormItem>
                            <FormItem label={'电话'} {...formItemLayout}>
                                {
                                    getFieldDecorator('buyerPhone', {
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
                                    getFieldDecorator('buyerAddress', {
                                        rules: [{
                                            required: true, message: '请输入地址'
                                        }]
                                    })(
                                        <Input placeholder={'请输入安装的详细街道地址'}></Input>
                                    )
                                }
                            </FormItem>
                            <FormItem label={'安装时间'} {...formItemLayout}>
                                {
                                    getFieldDecorator('bookTime', {
                                        rules: [{
                                            required: true, message: '请选择安装时间'
                                        }]
                                    })(
                                        <DatePicker
                                            showTime
                                            format="YYYY-MM-DD HH:mm:ss"
                                            placeholder="安装时间"
                                        />
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
                                style={{marginLeft: 200, marginRight:10}}
                                onClick={() =>this.handSubmit()}>保存</SubmitButton>
                            <Button onClick={() => this.handleReset()}>清空</Button>
                        </div>
                    </div>

                </div>
            );
        }

        return null;
    }

}

AddBookOrder = Form.create()(AddBookOrder);
ReactDom.render(<div><AddBookOrder></AddBookOrder></div>, document.querySelector("#content"));
