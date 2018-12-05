import React from 'react';
import ReactDom from 'react-dom';
import SADPage from '@souche-f2e/sad';
import '../../../styles/index.less';

/*
 * 这里声明要引入的组件
 */
import { Form, Input, Button, Table, Select, Modal } from 'antd';
import { RJAreaCascader ,RJSelect} from '@souche-f2e/sad/components/RJAntd';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;

import ModClaimModal from '../../../components/scheme/Modal/ModClaimModal'
import HistoryModal from '../../../components/scheme/Modal/HistoryModal'

import { convertClaimeConfigStatus, containsResource,convertSchemeBusinessType } from '../../utils/utils';


/**
 * 车商合同管理页面
 */
class SchemeClaimConfigIndex extends SADPage {
    constructor() {
        super();
        this.state = {
            updateRecord:{},
            record:{},
            query:{
                //authorization:2
            },
            modSchemeClaimVisible:false,
            configHistoryVisible:false,
            configHistoryList:[]
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
            this.state.query.productName = query.productName;
            this.state.query.claimConfigStatus = query.claimConfigStatus;
            this.state.page = 1;
            this.getList();
        })
    }
    /**
     * 清除查询条件
     */
    handleReset = () => {
        this.setState({query: {}});
        this.props.form.resetFields();
    }

    handleModeSchemeClaim = (data) => {
        this.state.updateRecord=data;
        this.update().then(data => {
            if(data.success){
                this.getList();
            }
        });
    }
    handleCancelModSchemeClaim = (e) => {
        this.setState({modSchemeClaimVisible:false});
    }

    handleCloseHistory =(e)=>{
        this.setState({configHistoryVisible:false});
    }


    openModeSchemeClaimModal =(record)=>{
        this.state.record=record;
        this.setState({modSchemeClaimVisible:true});
    }


    onlineHandle =(record,callback)=>{
        confirm({
            title: '确认?',
            content: '确认上架预警方案',
            onOk() {
                callback(record);
            }
        });
    }
    onlineHandleCallback =(record)=>{
        this.state.record=record;
        this.online().then(data => {
            if(data.success){
                this.getList();
            }
        });
    }

    offlineHandle =(record,callback)=>{
        confirm({
            title: '确认?',
            content: '确认下架预警方案',
            onOk() {
                callback(record);
            }
        });
    }

    offlineHandleCallback =(record)=>{
        this.state.record=record;
        this.offline().then(data => {
            if(data.success){
                this.getList();
            }
        });
    }
    openConfigHistoryModal =(record)=>{
        this.state.record=record;
        this.claimConfigHistory()
        this.setState({configHistoryVisible:true});
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
                title: '方案名称',
                dataIndex: 'productName',
                key: 'productName',
                display:false,
                render: (text, record) => {
                    return <div>
                        <div> 产品名称：{record.qaName}-{text}</div>
                        <div> 年限：{record.expiresYear}年</div>
                        <div> 价格：{record.basicPrice}元</div>
                        <div> 业务类型：{convertSchemeBusinessType(record.businessType)}</div>
                        <div> 排量（L）：{record.engineVolumeDown}L-{record.engineVolumeUp}L</div>
                    </div>
                }
            },
            {
                title: '维修次数上限',
                dataIndex: 'serviceCount',
                key: 'serviceCount',
                display:false
            },
            {
                title: '维修金额上限',
                dataIndex: 'serviceTotalAmount',
                key: 'serviceTotalAmount',
                display:false
            },

            {
                title: '创建时间',
                dataIndex: 'dateCreate',
                key: 'dateCreate',
                display:false
            },
            {
                title: '创建人',
                dataIndex: 'creator',
                key: 'creator',
                display:false
            },
            {
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
                display:false
            },
            {
                title: '状态',
                dataIndex: 'claimConfigStatus',
                key: 'claimConfigStatus',
                display:false,
                render: (text, record) => {
                    return convertClaimeConfigStatus(text);
                }
            },
            {
                title: '操作',
                dataIndex: 'option',
                width: 150,
                key: 'option',
                render: (text, record) => {
                    let ops=[];
                    if((record.claimConfigStatus==='INIT' || record.claimConfigStatus==='OFF') && containsResource('DSC_ZHIBAO_WARRANTY_WARN_ONOFFSHELF')){
                        ops.push(<span><a onClick={this.onlineHandle.bind(null,record,this.onlineHandleCallback)}>上架</a>&nbsp;</span>);
                    }else if(record.claimConfigStatus==='ON' && containsResource('DSC_ZHIBAO_WARRANTY_WARN_ONOFFSHELF')){
                        ops.push(<span><a onClick={this.offlineHandle.bind(null,record,this.offlineHandleCallback)}>下架</a>&nbsp;</span>);
                    }
                    if(containsResource('DSC_ZHIBAO_WARRANTY_WARN_EDIT')){
                        ops.push(<span><a onClick={this.openModeSchemeClaimModal.bind(null,record)}>修改</a>&nbsp;</span>);
                    }
                    if(containsResource('DSC_ZHIBAO_WARRANTY_WARN_QUERY_HISTORY')){
                        ops.push(<span><a onClick={this.openConfigHistoryModal.bind(null,record)}>操作历史</a>&nbsp;</span>);
                    }
                    return (<div>{ops}</div>)
                }
            }]
        /**
         * 搜索框组件
         */

        let seachView = (
            <span>

                <FormItem label="方案产品名称">
                    {
                        getFieldDecorator('productName', {
                        })(
                            <Input  style={{ width: 200}} placeholder="方案产品名称"/>
                        )
                    }
                </FormItem>
                <FormItem label="上架状态">
                    {
                        getFieldDecorator('claimConfigStatus', {
                        })(
                            <Select style={{ width: 200 }} placeholder="请选择"
                            >
                                <Option key={null}>所有</Option>
                                <Option key={"INIT"}>未上架</Option>
                                <Option key={"ON"}>已上架</Option>
                                <Option key={"OFF"}>已下架</Option>
                            </Select>
                        )
                    }
                 </FormItem>
                 <FormItem >
                   <Button type="primary" onClick={this.handSubmit}>搜索</Button>
                 </FormItem>
                 <FormItem >
                   <Button type="primary" onClick={this.handleReset}>清除</Button>
                 </FormItem>
                <FormItem >
                    {containsResource('DSC_ZHIBAO_WARRANTY_WARN_ADD') ? <Button type="primary"><a href="/admin/scheme/CreateClaimConfig.html">创建</a></Button> : ''}
                 </FormItem>
            </span>
        );

        if (this.stateAlready) {
            return (
                <div>
                    <h1>质保-报修预警管理</h1>

                    <Form layout="inline">
                        {seachView}
                    </Form>
                    <Form layout="inline">
                        <FormItem>

                        </FormItem>
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
                    <ModClaimModal record={this.state.record}
                                   modSchemeClaimVisible={this.state.modSchemeClaimVisible}
                                   handleModeSchemeClaim={this.handleModeSchemeClaim}
                                   handleCancelModSchemeClaim={this.handleCancelModSchemeClaim}/>
                    <HistoryModal configHistoryVisible={this.state.configHistoryVisible}
                                  handleCloseHistory={this.handleCloseHistory}
                                  configHistoryList={this.state.configHistoryList}
                                  record={this.state.record}/>
                </div>
            );
        }
        return null;
    }

}

SchemeClaimConfigIndex = Form.create()(SchemeClaimConfigIndex);
ReactDom.render(<div><SchemeClaimConfigIndex></SchemeClaimConfigIndex></div>, document.querySelector("#content"));
