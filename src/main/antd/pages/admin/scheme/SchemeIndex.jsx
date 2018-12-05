import React from 'react';
import ReactDom from 'react-dom';
import SADPage from '@souche-f2e/sad';
import '../../../styles/index.less';
import { containsResource } from '../../utils/utils';

/*
 * 这里声明要引入的组件
 */
import { Form, Input, Button, Table, Select, Modal,Row,Col,message} from 'antd';
import { RJAreaCascader ,RJSelect,RJCarSeriesCascader} from '@souche-f2e/sad/components/RJAntd';
import {Component} from 'react';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;

import CreateModal from '../../../components/scheme/Modal/CreateModal'

const moment = require('moment');

import { convertSchemeBusinessType } from '../../utils/utils';

const resetCarSeriesCascader  = RJCarSeriesCascader.resetCarSeriesCascader


/**
 * 车商合同管理页面
 */
class SchemeIndex extends SADPage {
    constructor() {
        super();
        this.state = {
            schemeInfo:{},
            schemeId:{},
            query:{
            },
            brandCode:'',
            brandName:'',
            seriesName:'',
            seriesCode:'',
            modelCode:'',
            modelName:''
        }
    }
    setInitProps() {
        super.setInitProps();
    }
    /**
     * 切换分页
     * @param pagination
     */
    hanldeTableChange = (pagination) => {
        this.state.pageSize = pagination.pageSize;
        this.state.page = pagination.current;
        this.getList();
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
            this.state.query.qaName = query.qaName;
            this.state.query.name = query.name;
            this.state.query.expiresYear = query.expiresYear;
            this.state.query.productName = query.productName;
            this.state.query.businessType = query.businessType;
            this.state.query.brandCode = this.state.brandCode;
            this.state.query.seriesCode = this.state.seriesCode;
            this.state.query.modelCode = this.state.modelCode;
            this.state.page = 1;
            this.getList();
        })
    }

    handleExport = (e) => {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                return;
            }
            let query = this.props.form.getFieldsValue();
            this.state.query.qaName = query.qaName;
            this.state.query.name = query.name;
            this.state.query.expiresYear = query.expiresYear;
            this.state.query.productName = query.productName;
            this.state.query.businessType = query.businessType;
            this.state.query.brandCode = this.state.brandCode;
            this.state.query.seriesCode = this.state.seriesCode;
            this.state.query.modelCode = this.state.modelCode;
            let queryJson= encodeURIComponent(JSON.stringify(this.state.query));
            let exportUrl = `${this.baseUri}/admin/export/QaSchemeExport.html?query=${queryJson}`
            window.location.href = exportUrl;
        })
    }
    /**
     * 清除查询条件
     */
    handleReset = () => {
        this.setState({query: {}});
        resetCarSeriesCascader(false)

        this.props.form.resetFields();
    }

    handleSaveCreateSchemeClaim = (data) => {
        this.state.claimConfig=data;
        this.save().then(data => {
            if(data.success){
                this.getList();
            }
        });
    }
    handleCancelCreateSchemeClaim = (e) => {
        this.setState({createSchemeClaimVisible:false});
    }

    openModAuth =(record)=>{
        this.state.schemeInfo=record;
        this.setState({createSchemeClaimVisible:true});
    }

    onlineHandle =(record,callback)=>{
        confirm({
            title: '确认?',
            content: '确认上架质保方案',
            onOk() {
                callback(record);
            }
        });
    }
    onlineHandleCallback =(record)=>{
        this.state.schemeId=record.id;
        this.online().then(data => {
            if(data.data.result){
                message.info("操作成功")
                this.getList();
            }else{
                message.error("操作失败")
            }
        });
    }

    offlineHandle =(record,callback)=>{
        confirm({
            title: '确认?',
            content: '确认下架质保方案',
            onOk() {
                callback(record);
            }
        });
    }

    offlineHandleCallback =(record)=>{
        this.state.schemeId=record.id;
        this.offline().then(data => {
            console.log(data)
            if(data.data.result){
                message.info("操作成功")
                this.getList();
            }else{
                message.error("操作失败")
            }
        });
    }

    // To generate mock Form.Item
    getFields() {
        const count = this.state.expand ? 10 : 6;
        const { getFieldDecorator } = this.props.form;
        const children = [];
        children.push(
            <Col span={6} key={'vin'} >
                <FormItem label="产品类型">
                    {getFieldDecorator('qaName')(
                        <Select placeholder="产品类型" style={{ width: 200 }} >
                            <Option value="">请选择</Option>
                            <Option value="省心保">省心保</Option>
                            <Option value="臻新保">臻新保</Option>
                            <Option value="基础保">基础保</Option>
                            <Option value="养车保">养车保</Option>
                        </Select>
                    )}
                </FormItem>

            </Col>
        );
        children.push(
            <Col span={6} key={'name'} >
                <FormItem label="质保名称">
                    {getFieldDecorator('name')(
                        <Select placeholder="质保名称" style={{ width: 200 }} >
                            <Option value="">请选择</Option>
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
                        </Select>
                    )}
                </FormItem>
            </Col>
        );
        children.push(
            <Col span={6} key={'expiresYear'} >
                <FormItem label="质保年限">
                    {getFieldDecorator('expiresYear', {
                    })(<Select placeholder="质保年限" style={{ width: 200 }} >
                        <Option value="">请选择</Option>
                        <Option value="1">1年</Option>
                        <Option value="2">2年</Option>
                        <Option value="3">3年</Option>
                    </Select>)}
                </FormItem>
            </Col>
        );
        children.push(
            <Col span={6} key={'productName'} >
                <FormItem label="产品名称">
                    {getFieldDecorator('productName')(
                        <Input placeholder="产品名称" />
                    )}
                </FormItem>
            </Col>
        );

        children.push(
            <Col span={24} key={'brandCode'} >
                <FormItem  label="选择车型">
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
        );

        children.push(
            <Col span={6} key={'businessType'} >
                <FormItem label="业务类型">
                    {getFieldDecorator('businessType', {
                    })(<Select placeholder="业务类型" style={{ width: 200 }} >
                        <Option value="">请选择</Option>
                        <Option value="dafengche">非弹个车</Option>
                        <Option value="lease">弹个车</Option>
                    </Select>)}
                </FormItem>
            </Col>
        );
        return children;
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
        if (this.state.list) {
            pagination = {
                size: 'small',
                total: this.state.list.totalNumber,
                current: this.state.list.currentIndex,
                pageSize: this.state.list.pageSize,
                showSizeChanger: true,
                showQuickJumper: true,
                pageSizeOptions: ['10', '15', '20'],
                onShowSizeChange(current, pageSize) {
                },
                onChange(current, pageSize) {
                },
                showTotal(total) {
                    return '共' + total + '条';
                }
            }
        }

        const columns = [
            {
                title: '序号',
                dataIndex: 'id',
                key: 'id',
            }, {
                title: '产品类型名称',
                dataIndex: 'qaName',
                key: 'qaName',
            }, {
                title: '产品信息',
                dataIndex: 'name',
                key: 'name',
                render: (text, record) => {
                    return <div>
                        <div>产品名称:<a href={`/admin/scheme/UpdateScheme.html?from=detail&schemeId=${record.id}`}>{record.productName}</a></div>
                        <div>方案类型:{text}</div>
                    </div>;
                },
            }, {
                title: '业务类型',
                dataIndex: 'businessType',
                key: 'businessType',
                render: (text, record) => {
                    if (text === 'lease') {
                        return '弹个车'
                    }
                    return '非弹个车'
                },
            }, {
                title: '保费金额',
                dataIndex: 'basicPrice',
                key: 'basicPrice',
                render: text => (<span>{text}元</span>),
            }, {
                title: '报修范围',
                dataIndex: 'parts',
                key: 'parts',
                width:150,
            }, {
                title: '免赔期',
                dataIndex: 'freeCompensage',
                key: 'freeCompensage',
                render: text => (<span>{text}</span>),
            }, {
                title: '赔偿限额',
                dataIndex: 'compensateLimit',
                key: 'compensateLimit',
                render: text => (<span>{text}元</span>),
            }, {
                title: '质保期限',
                dataIndex: 'expires',
                key: 'expires',
            }, {
                title: '排量(L)',
                dataIndex: 'engineVolumeDown',
                key: 'engineVolumeDown',
                render: (text, record) => {
                    if (text != null && record.engineVolumeUp != null) {
                        return (<span>{text}L&lt;=排量&lt;={record.engineVolumeUp}L</span>)
                    }
                    return ''
                },
            }, {
                title: '增值服务',
                dataIndex: 'freeService',
                key: 'freeService',
            }, {
                title: '车型',
                dataIndex: 'modelName',
                key: 'modelName',
                render: (text, record) => {
                    if( text!=null){
                        return  (<div>
                            <div><b>品牌:{record.brandName}</b></div>
                            <div><b>车系:{record.seriesName}</b></div>
                            <div><b>车型:{record.modelName}</b></div>
                        </div>);
                    }else{
                       return "无";
                    }

                },
            }, {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (text,record) => {
                    if (text === 'Y') {
                        return <div>已上架</div>
                    } else if (text === 'N') {
                        return <div>未上架</div>
                    }
                    return text
                },
            }, {
                title: '操作',
                key: 'operation',
                width: 100,
                render: (text, record) => {
                    return (<div><a href={`/admin/scheme/UpdateScheme.html?schemeId=${record.id}`}>编辑</a>
                        {record.status === 'Y' ? <a onClick={this.offlineHandle.bind(null, record,this.offlineHandleCallback)} style={{ marginLeft: 8 }}>下架</a>
                            : <a onClick={this.onlineHandle.bind(null, record,this.onlineHandleCallback)} style={{ marginLeft: 8 }}>上架</a> }
                    </div>)
                },
            },
        ]



        if (this.stateAlready) {
            return (
                <div>
                    <h1>质保-质保方案管理</h1>

                    <Form layout="inline"
                          className="ant-advanced-search-form"
                    >
                        <Row gutter={24}>{this.getFields()}</Row>
                        {<Row>
                            <Col span={24} style={{ textAlign: 'right' }}>
                                <FormItem >
                                    <Button type="primary" onClick={this.handSubmit}>搜索</Button>
                                </FormItem>
                                <FormItem >
                                    <Button type="primary" onClick={this.handleReset}>清除</Button>
                                </FormItem>
                                <FormItem >
                                    <Button type="primary" onClick={this.handleExport}>导出</Button>
                                </FormItem>
                                <FormItem >
                                    <Button type="primary"><a href="/admin/scheme/CreateScheme.html">创建</a></Button>
                                </FormItem>
                            </Col>
                        </Row>}
                    </Form>

                    <div>
                        <div className="table-content">
                            <Table key="shopCode" columns={columns}
                                   dataSource={this.state.list.items}
                                   rowKey="productId" pagination={pagination}
                                   onChange={this.hanldeTableChange}
                                   bordered/>
                        </div>
                    </div>
                    <CreateModal schemeInfo={this.state.schemeInfo}
                                 createSchemeClaimVisible={this.state.createSchemeClaimVisible}
                                    handleSaveCreateSchemeClaim={this.handleSaveCreateSchemeClaim}
                                    handleCancelCreateSchemeClaim={this.handleCancelCreateSchemeClaim}/>

                </div>
            );
        }
        return null;
    }

}

SchemeIndex = Form.create()(SchemeIndex);
ReactDom.render(<div><SchemeIndex></SchemeIndex></div>, document.querySelector("#content"));
