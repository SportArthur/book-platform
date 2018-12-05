import React from 'react';
import ReactDom from 'react-dom';
import SADPage from '@souche-f2e/sad';
import '../../../styles/index.less';

/*
 * 这里声明要引入的组件
 */
import { Form, Input, Button, Table, Select, Modal } from 'antd';
import { RJAreaCascader ,RJSelect} from '@souche-f2e/sad/components/RJAntd';
import {Component} from 'react';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;



/**
 * 车商合同管理页面
 */
class CarAccessIndex extends SADPage {
    constructor() {
        super();
        this.state = {
            carId:'',
            carAccessInfo:'',
            carImportTypeDesc:'',
            query:{}
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
            let query = this.props.form.getFieldsValue();
            this.state.carId=query.carId;
            this.accessCheck().then(data => {
                console.log(data)
                console.log(this.state)
                if (data.success) {
                    return;
                }else{
                    alert(data.msg);
                }
            });
        })
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

        if (this.stateAlready) {
            return (
                <div>
                    <h1>质保-车辆准入检查服务</h1>

                    <Form>
                        <FormItem label="车辆ID">
                            {
                                getFieldDecorator('carId', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入车辆ID!',
                                        },
                                    ]
                                })(
                                    <Input  style={{ width: 300}} placeholder="车辆ID"/>
                                )
                            }
                        </FormItem>

                        <FormItem >
                            <Button type="primary" onClick={this.handSubmit}>检查</Button>
                            &nbsp; &nbsp;<Button type="primary" onClick={this.handleReset}>清除</Button>
                        </FormItem>
                    </Form>
                    <div>
                        <div>车辆进口类型：{this.state.carImportTypeDesc}</div>
                        <div>车辆准入信息：{this.state.carAccessInfo}</div>
                    </div>
                </div>
            );
        }
        return null;
    }

}

CarAccessIndex = Form.create()(CarAccessIndex);
ReactDom.render(<div><CarAccessIndex></CarAccessIndex></div>, document.querySelector("#content"));
