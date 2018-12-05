import React from 'react';
import ReactDom from 'react-dom';
import SADPage from '@souche-f2e/sad';
import '../../../styles/index.less';
import { containsResource ,convertSchemeBusinessType} from '../../utils/utils';

import { Form, Input, Row, Col, Button, Table, Checkbox, Select, Card ,Modal,message } from 'antd';
import { RJCarSeriesCascader } from '@souche-f2e/sad/components/RJAntd';

import {Component} from 'react';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group
const { TextArea } = Input;

const moment = require('moment');

/**
 * 车商合同管理页面
 */
class CreateScheme extends SADPage {
    constructor() {
        super();
        this.state = {
            compomentConfigList_relieved:[],
            compomentConfigList_safeheart:[],
            compomentConfigList:[],
            compomentConfigIds:[],
            schemeInfo:{},
            showCarSelect:false,
            brandCode:'',
            brandName:'',
            seriesName:'',
            seriesCode:'',
            modelCode:'',
            modelName:'',
        }
    }

    /**
     * 搜索查询
     * @param e
     */
    handSubmit = (e) => {
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            }
            let query = this.props.form.getFieldsValue();

            if(query.qaName=='臻新保' && (this.state.modelName=='' || this.state.modelName==null)){
                message.error("请选择车型")
                return;
            }
            if(this.state.compomentConfigIds.length==0){
                message.error("请选择报修范围")
                return;
            }
            query.brandCode=this.state.brandCode;
            query.brandName=this.state.brandName;
            query.seriesCode=this.state.seriesCode;
            query.seriesName=this.state.seriesName;
            query.modelCode=this.state.modelCode;
            query.modelName=this.state.modelName;

            this.state.schemeInfo=query;
            this.save().then(data => {
                if(data.data.result){
                    let listUrl = `${this.baseUri}/admin/scheme/SchemeIndex.html`
                    window.location.href=listUrl;
                }else{
                    message.error("创建失败")
                }
            });
        })
    }

    onSelectChange = (selectedRowKeys) => {
        this.state.compomentConfigIds= selectedRowKeys ;
    }

    qaNameOnchange =(value)=> {
        let show = value==="臻新保";
        this.setState({ showCarSelect:show });
        if(value==='臻新保'){
            //console.log(this.state.compomentConfigList_safeheart)
            this.setState({compomentConfigList:this.state.compomentConfigList_safeheart})
            this.setState({compomentConfigIds:[]})
        }else if(value==='省心保'){
            //console.log(this.state.compomentConfigList_relieved)
            this.setState({compomentConfigList:this.state.compomentConfigList_relieved})
            this.setState({compomentConfigIds:[]})
        }else{
            //console.log(3)
            this.setState({compomentConfigList:[]})
        }
    }
    /**
     *
     * @returns {*}
     */
    render() {
        const {getFieldDecorator} = this.props.form;
        let pagination = null;
        let _this = null;
        if (this.props._this) {
            _this = this.props._this;
        }

        const options = [
            { label: '1年无限次保养', value: '1年无限次保养' },
            { label: '质保期免费道路救援', value: '质保期免费道路救援' },
        ];
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        }
        const columns = [{
            title: '部件名称',
            dataIndex: 'partName',
        }, {
            title: '一级部件',
            dataIndex: 'majarPartName',
        }, {
            title: '二级部件',
            dataIndex: 'secondaryPartName',
        }]

        const { compomentConfigIds,showCarSelect } = this.state;
        const rowSelection = {
            compomentConfigIds,
            onChange: this.onSelectChange,
        };

        if (this.stateAlready) {
            return (
                <div>
                    <h1>质保-创建质保方案</h1>

                    <Form>
                        <Card title="基本信息" bordered={false} >
                            <Row gutter={40}>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label="产品类型名称" >
                                        {getFieldDecorator('qaName', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入产品类型名称!',
                                                },
                                            ],
                                        })(<Select placeholder="产品类型名称" onChange={this.qaNameOnchange}>
                                            <Option value="省心保">省心保</Option>
                                            <Option value="臻新保">臻新保</Option>
                                        </Select>)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label="业务类型" >
                                        {getFieldDecorator('businessType', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入业务类型!',
                                                },
                                            ],
                                        })(<Select placeholder="业务类型">
                                            <Option value="dafengche">非弹个车</Option>
                                            <Option value="lease">弹个车</Option>
                                        </Select>)}
                                    </FormItem>
                                </Col>

                            </Row>
                            {showCarSelect?
                                <Row gutter={40}>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label="选择车型">
                                        <RJCarSeriesCascader dropdownMatchSelectWidth={true} style={{ width: 300 }}
                                            vehicleRange={['SOUCHE','CH168']}
                                            onBrandChange={(v) => {
                                                this.state.brandCode=v.key;
                                                this.state.brandName=v.label;
                                            }}
                                            onSerieChange={(v) => {
                                                console.log(v)
                                                this.state.seriesCode=v.key;
                                                this.state.seriesName=v.label;
                                            }}
                                            onModelChange={(v) => {
                                                this.state.modelCode=v.key;
                                                this.state.modelName=v.label;
                                            }}
                                            onChange={(code, value) => {
                                            }}
                                            cascaderLevel={3}
                                            width={1200}
                                            />
                                    </FormItem>
                                </Col>
                            </Row>

                                :''
                            }
                            <Row gutter={40}>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label="产品名称">
                                        {getFieldDecorator('productName', {
                                            initialValue: '',
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入产品名称!',
                                                },
                                            ],
                                        })(<Input placeholder="产品名称" />)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label="方案类型名称">
                                        {getFieldDecorator('name', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择方案类型名称!',
                                                },
                                            ],
                                        })(<Select placeholder="方案类型名称">
                                            <Option value="1大件">1大件</Option>
                                            <Option value="2大件">2大件</Option>
                                            <Option value="3大件">3大件</Option>
                                            <Option value="4大件">4大件</Option>
                                            <Option value="5大件">5大件</Option>
                                            <Option value="6大件">6大件</Option>
                                            <Option value="7大件">7大件</Option>
                                            <Option value="8大件">8大件</Option>
                                            <Option value="9大件">9大件</Option>
                                            <Option value="10大件">10大件</Option>
                                            <Option value="11大件">11大件</Option>
                                            <Option value="整车">整车</Option>
                                        </Select>)}
                                    </FormItem>
                                </Col>

                            </Row>

                            <Row gutter={40}>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label="质保年限" >
                                        {getFieldDecorator('expiresYear', {
                                            initialValue: '1',
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择质保年限!',
                                                },
                                            ],
                                        })(<Select>
                                            <Option value="1">1年</Option>
                                            <Option value="2">2年</Option>
                                            <Option value="3">3年</Option>
                                        </Select>)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label="质保年限公里" >
                                        {getFieldDecorator('expiresYearKilometers', {
                                            initialValue: '',
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入质保年限公里!',
                                                },
                                            ],
                                        })(<Input placeholder="质保年限公里" />)}
                                    </FormItem>
                                </Col>

                            </Row>
                            <Row gutter={40}>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label="基础价格（元）">
                                        {getFieldDecorator('basicPrice', {
                                            initialValue: '',
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入基础价格!',
                                                },
                                            ],
                                        })(<Input placeholder="基础价格" />)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label="赔偿限额（元）" >
                                        {getFieldDecorator('compensateLimit', {
                                            initialValue: '',
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入赔偿限额!',
                                                },
                                            ],
                                        })(<Input placeholder="赔偿限额" />)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={40}>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label="排量下限(含)L">
                                        {getFieldDecorator('engineVolumeDown', {
                                            initialValue: '',
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '排量下限!',
                                                },
                                            ],
                                        })(<Input placeholder="排量下限(含)L" />)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label="排量上限(含)L">
                                        {getFieldDecorator('engineVolumeUp', {
                                            initialValue: '',
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入排量上限!',
                                                },
                                            ],
                                        })(<Input placeholder="排量上限(含)L" />)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={40}>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label="免赔期（天）">
                                        {getFieldDecorator('freeCompensageDay', {
                                            initialValue: '',
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入免赔期（天）!',
                                                },
                                            ],
                                        })(<Input placeholder="免赔期（天）无免赔期填写0" />)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label="免赔期（天）公里">
                                        {getFieldDecorator('freeCompensageKilometers', {
                                            initialValue: '',
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '免赔期（天）公里!',
                                                },
                                            ],
                                        })(<Input placeholder="请输入免赔期限（天）公里，无免赔期填写0" />)}
                                    </FormItem>
                                </Col>


                            </Row>
                            <Row gutter={40}>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label="增值服务">
                                        {getFieldDecorator('freeServiceList', {
                                        })(<CheckboxGroup options={options} />)}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Card>
                        <Card title="报修范围" bordered={false} >
                            <Row gutter={40}>
                                <Table rowKey="id" rowSelection={rowSelection}  columns={columns} dataSource={this.state.compomentConfigList} pagination={false} />
                            </Row>
                            <Row gutter={40}>
                                <Col span={8}><FormItem {...formItemLayout} label="备注">
                                    {getFieldDecorator('remark', {
                                        initialValue: '',
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入备注信息',
                                            },
                                        ],
                                    })( <TextArea rows={20} cols={40} placeholder="请输入备注信息" autosize />)}
                                </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={40}>
                                <Col span={24} style={{ textAlign: 'center' }}>
                                    <FormItem >
                                        <Button type="primary" onClick={this.handSubmit}>保存</Button>
                                        <Button style={{ marginLeft: 8 }} htmlType="submit" size="large"><a href='/admin/scheme/SchemeIndex.html'>返回</a></Button>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Card>
                    </Form>

                </div>
            );
        }
        return null;
    }

}

CreateScheme = Form.create()(CreateScheme);
ReactDom.render(<div><CreateScheme></CreateScheme></div>, document.querySelector("#content"));
