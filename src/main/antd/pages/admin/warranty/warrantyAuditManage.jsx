import React from 'react';
import ReactDom from 'react-dom';
import SADPage from '@souche-f2e/sad';
import '../../../styles/index.less';
import { convertRoleCodeToRoleName,convertWarrantyAuditConfigStatus,convertQaActive,convertQaStatus,convertCommissionStatus } from '../../utils/utils';

/*
 * 这里声明要引入的组件
 */
import { Form, Icon, Input,InputNumber, Button, Table, Pagination, Select, Checkbox, Modal, DatePicker, Popconfirm} from 'antd';
import {RJAreaCascader, RJImgUploader, RJSelect} from '@souche-f2e/sad/components/RJAntd';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const { Option, OptGroup } = Select;
const { MonthPicker, RangePicker } = DatePicker;

const moment = require('moment');

let uuid = 0;
/**
 * 质保报修审核配置
 */
class WarrantyAuditManage extends SADPage {
    constructor() {
        super();
        this.state = {
            info: {},
            query:{},
            status: '',
            visible: false,
            chooseSchemeVisible: false,
            showHistoryVisible: false,
            addSearch: '',
            schemePage: {
                page:1,
                pageSize:6
            },
            schemeList: [],
            page: 1,
            pageSize: 10
        }
    }

    /**
     * 切换分页
     * @param pagination
     */
    handleTableChange = (pagination) => {
        this.state.pageSize = pagination.pageSize;
        this.state.page = pagination.current;
        this.state.query = this.props.form.getFieldsValue();
        this.getByFilter().then(data => {
            if (data.success) {
                return;
            }
        });
    }

    /**
     * 搜索查询
     * @param e
     */
    handSubmit = () => {
        this.state.query = this.props.form.getFieldsValue();
        this.getByFilter().then(data => {
            if (data.success) {
                return;
            }
        });
    }

    handleSchemeSubmit = () => {
        this.state.schemeName = this.props.form.getFieldsValue().schemeName;
        this.getSchemeByFilter().then(data => {
            if (data.success) {
                return;
            }
        });
    }

    /**
     * 清除查询条件
     */
    handleReset = () => {
        this.props.form.resetFields();
        this.setState({query: {}});
    }

    handleSchemeCancel = () => {
        this.setState({
            chooseSchemeVisible: false,
        });
    }

    handleSchemeOk = () => {
        this.setState({
            chooseSchemeVisible: false
        });
        let record = this.state.selectedScheme;
        let info = this.convertToSchemeShow(record);
        this.props.form.setFieldsValue({
            schemeInfo: info,
        });
    }

    handleAddCancel = () => {
        this.props.form.resetFields();
        this.setState({
            visible: false,
        });
    }

    convertToSchemeShow = (record) => {
        return `${record.qaName}${record.productName}${record.expiresYear}年期(${record.engineVolumeDown}-${record.engineVolumeUp}L)`;
    }

    handleAddOk = (type) => {
        console.log(type);
        this.props.form.validateFieldsAndScroll(errs => {
            console.log(errs);
            if(!!errs) return;
            this.state.info.schemeId = this.state.selectedScheme.id;
            if(this.state.editInfo) {
                this.state.info.id = this.state.editInfo.id;
            }
            this.state.info.auditLevelModels = this.props.form.getFieldValue('auditInfo');
            this.state.info.remark = this.props.form.getFieldValue('remark');
            console.log(this.state.info.auditLevelModels);
            if(type == 'save') {
                this.state.info.status = '1';
            }else if(type == 'active') {
                if(this.state.info.auditLevelModels) {
                    this.state.info.auditLevelModels.forEach(function (item) {
                        console.log(item);
                        for(var j in item){
                            if(!item[j] && (j==='roleCode' || j==='max')){
                                alert('请填写完整的审核配置信息');
                                return;
                            }
                        }
                    });
                }else {
                    alert('请填写完整的审核配置信息');
                    return;
                }

                this.state.info.status = '0';
            }
            this.createOrUpdateAuditConfig().then(() => {
                this.setState({
                    visible: false
                });
                this.getList();
            });
        });
    }

    openCreateWarrantyAuditDialog = () => {
        this.props.form.resetFields();
        this.setState({
            dialogName: '创建金额审核方案',
            editInfo: null,
            visible: true
        });
    }

    openEditWarrantyAuditDialog = (record) => {
        this.setState({
            editInfo: record,
            selectedScheme: record.schemeInfoModel,
            dialogName: '编辑金额审核方案',
            visible: true
        });
    }

    chooseScheme = () => {
        this.state.chooseSchemeVisible = true;
        // this.setState({
        //     chooseSchemeVisible: true
        // });
        this.getSchemeByFilter();
    }

    /**
     * 切换方案分页
     * @param pagination
     */
    handleSchemeTableChange = (pagination) => {
        this.state.schemePage.pageSize = pagination.pageSize;
        this.state.schemePage.page = pagination.current;
        this.getSchemeByFilter();
    }

    addAuditLevel = () => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        // console.log(keys);

        if(this.state.editInfo && this.state.editInfo.auditLevelModels) {
            uuid = uuid + this.state.editInfo.auditLevelModels.length;
        }
        // console.log(uuid);
        const nextKeys = keys.concat(uuid);
        console.log(nextKeys);
        uuid++;
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys,
        });
    }

    remove = (k) => {
        console.log("k=" + k)
        const {form} = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');

        let auditInfo = form.getFieldValue('auditInfo');
        console.log(keys.filter(key => key !== k));
        console.log(auditInfo.filter(key => key !== k));
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });

    }

    changeAuditConfigStatus = (record, status) => {
        this.state.id = record.id;
        this.state.status = status;
        this.state.schemeId = record.schemeId;
        this.changeStatus().then(() => {
            this.getList();
        });
    }

    openShowHistoryDialog = (record) => {
        // this.state.showHistoryVisible = true;
        this.state.idForHistory = record.id;
        this.findHistory().then(data => {
            this.setState({
                showHistoryVisible: true
            });
        });
    }

    handleHistoryOk = () => {
        this.setState({
            showHistoryVisible: false
        });
    }

    handleHistoryCancel = () => {
        this.setState({
            showHistoryVisible: false
        });
    }

    /**
     *
     * @returns {*}
     */
    render() {
        const {getFieldDecorator, getFieldValue} = this.props.form;
        let pagination = null;
        let paginationScheme = null;
        let _this = null;
        if (this.props._this) {
            _this = this.props._this;
        }
        const that = this;

        if (this.state.list) {
            pagination = {
                size: 'small',
                total: this.state.list.totalNumber,
                current: this.state.list.currentIndex,
                pageSize: this.state.list.pageSize,
                showSizeChanger: true,
                showQuickJumper: true,
                pageSizeOptions: ['10', '20', '50'],
                onShowSizeChange(current, pageSize) {
                },
                onChange(current, pageSize) {
                },
                showTotal(total) {
                    return '共' + total + '条';
                }
            }
        }

        if(this.state.schemeList) {
            paginationScheme = {
                size: 'small',
                total: this.state.schemeList.totalNumber,
                current: this.state.schemeList.currentIndex,
                pageSize: this.state.schemeList.pageSize,
                showQuickJumper: true,
                pageSizeOptions: ['10', '20', '50'],
                onShowSizeChange(current, pageSize) {
                },
                onChange(current, pageSize) {
                },
                showTotal(total) {
                    return '共' + total + '条';
                }
            }
        }

        const rowSelection = {
            type: 'radio',
            onChange(selectedRowKeys, selectedRows) {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            onSelect(record) {
                that.state.selectedScheme = record;
            }
        };

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            }
        };

        const columns = [
            {
                title: '方案名称',
                dataIndex: 'schemeName',
                key: 'schemeName',
                render: (text, record) => {
                    let info = record.schemeInfoModel;
                    return (<div>{this.convertToSchemeShow(info)}</div>);
                }
            }, {
                title: '内容',
                dataIndex: 'content',
                key: 'content',
                render: (text, record) => {
                    // console.log(record);
                    let info = record.auditLevelModels;
                    let returnDiv = (<div></div>);
                    for(var i = 0; i < info.length; i++) {
                        returnDiv = (<div>{returnDiv}{convertRoleCodeToRoleName(info[i].roleCode)} {info[i].min}元-{info[i].max}元<br/></div>);
                    }
                    return returnDiv;
                }
            }, {
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
            }, {
                title: '创建时间',
                dataIndex: 'dateCreate',
                key: 'dateCreate'
            },{
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (text, record) => {
                    return (<div>{convertWarrantyAuditConfigStatus(record.status)}</div>);
                }
            },{
                title: '操作',
                dataIndex: 'option',
                width: 200,
                key: 'option',
                render: (text, record) => {
                    let showBtn;
                    // console.log(record);
                    if(record.status == '0') {
                        showBtn = <a onClick={() => this.changeAuditConfigStatus(record, '1')}>下架</a>;
                    }else if(record.status == '1') {
                        showBtn = <a onClick={() => this.changeAuditConfigStatus(record, '0')}>上架</a>;
                    }
                    let editBtn = <a onClick={() => this.openEditWarrantyAuditDialog(record)}>修改</a>;

                    let hisModifyBtn = <a onClick={() => this.openShowHistoryDialog(record)}>修改记录</a>;

                    let option = (<div>
                        <div>{showBtn} {editBtn} {hisModifyBtn}</div>
                    </div>);
                    return (
                        <div>{option}</div>
                    );
                }
            }]

        const schemeColumn = [
            {
                title: '方案名称',
                dataIndex: 'productName',
                render: (text, record) => {
                    console.log(record);
                    return <div>{this.convertToSchemeShow(record)}</div>;
                }
            }
        ];

        const historyColumn = [
            {
                title: '方案名称',
                dataIndex: 'productName',
                render: (text, record) => {
                    console.log(record);
                    let info = record.schemeInfoModel;
                    return <div>{this.convertToSchemeShow(info)}</div>;
                }
            },
            {
                title: '内容',
                dataIndex: 'content',
                key: 'content',
                render: (text, record) => {
                    // console.log(record);
                    let info = record.auditLevelModels;
                    let returnDiv = (<div></div>);
                    for(var i = 0; i < info.length; i++) {
                        returnDiv = (<div>{returnDiv}{convertRoleCodeToRoleName(info[i].roleCode)} {info[i].min}元-{info[i].max}元<br/></div>);
                    }
                    return returnDiv;
                }
            },
            {
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
            },
            {
                title: '创建时间',
                dataIndex: 'dateCreate',
                key: 'dateCreate'
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (text, record) => {
                    return (<div>{convertWarrantyAuditConfigStatus(record.status)}</div>);
                }
            }
        ];

        const validateRuleInfo = (objs, keys) => {
            console.log('enter validate');
            console.log(objs);
            console.log(keys);
            if(objs === undefined) return true;
            for(var i = 0; i < keys.length; i++) {
                let obj = objs[keys[i]];
                if(obj.roleCode == null || obj.min == null || obj.max == null) {
                    return false;
                }
            }
            return true;
        };

        const limitInteger = (value) => {
            const reg = /^(\-)*(\d+).*$/;
            // console.log(value);
            if(typeof value === 'string') {
                return !isNaN(Number(value)) ? value.replace(reg, '$1$2') : '';
            } else if (typeof value === 'number') {
                return !isNaN(value) ? String(value).replace(reg, '$1$2') : '';
            } else {
                return '';
            }
        };

        /**
         * 搜索框组件
         */
        let submitBtn = <Button type="primary" onClick={this.handSubmit}>搜索</Button>;
        let resetBtn = <Button onClick={this.handleReset}>清除</Button>;
        let createAuditInfo = <Button type="primary" onClick={this.openCreateWarrantyAuditDialog}>创建</Button>;
        let warrantyAuditDialog;
        let chooseSchemeDialog;
        let showHistoryDialog;
        let formItems;
        this.state.roleList = [
            {
                key: 'DSC_ZHIBAO_DIRECTOR',
                value: '主管'
            },
            {
                key: 'DSC_ZHIBAO_MANAGER',
                value: '经理'
            },
            {
                key: 'DSC_ZHIBAO_ADMINISTRATOR',
                value: '管理员'
            }
        ];
        if(this.stateAlready) {
            // console.log('++++++');
            // console.log(this.state.historyList);
            let initialKeyArray = new Array();
            let auditLevelInfo;
            if(this.state.editInfo) {
                auditLevelInfo = this.state.editInfo.auditLevelModels;
                for(var i = 0; i < auditLevelInfo.length; i++) {
                    initialKeyArray.push(i);
                }
            }

            getFieldDecorator('keys', { initialValue: initialKeyArray });
            const keys = getFieldValue('keys');

            formItems = keys.map((k, index) => {
                console.log('k='+k);
                // console.log(keys);
                // console.log(getFieldValue('auditInfo'));
                return (
                    <FormItem
                        {...formItemLayout}
                        label="角色"
                        required={false}
                        key={k}
                    >
                        {
                            getFieldDecorator(`auditInfo[${k}].roleCode`, {
                                initialValue: auditLevelInfo && auditLevelInfo[k] ? auditLevelInfo[k].roleCode : '',
                                rules: [{
                                    required:true, message: '请选择角色'
                                }]
                            })(
                                <RJSelect style={{width: '20%', marginRight: 8}} selectData={this.state.roleList}/>
                            )
                        }
                        金额范围:
                        {getFieldDecorator(`auditInfo[${k}].min]`, {
                            initialValue: keys[0] == k ? 0 : (+getFieldValue(`auditInfo[${keys[index - 1]}].max`) + 1),
                        })(
                            <InputNumber min={0} style={{ width: '120', marginRight: 8}} placeholder={'最小金额'} disabled={true}/>
                        )}元-
                        {getFieldDecorator(`auditInfo[${k}].max`, {
                            initialValue: auditLevelInfo && auditLevelInfo[k] ? auditLevelInfo[k].max : null,
                            rules: [{
                                required:true, message: '请输入金额'
                            }]
                        })(
                            <InputNumber min={keys[0] == k ? 1 : (+getFieldValue(`auditInfo[${keys[index - 1]}].max`) + 2)}
                                         style={{ width: '120', marginRight: 8}} placeholder={'最大金额'}
                                         formatter={limitInteger} parser={limitInteger} max={10000000}/>
                        )}元
                        {keys.length > 0 ? (
                            <Icon
                                className="dynamic-delete-button"
                                type="minus-circle-o"
                                onClick={() => this.remove(k)}
                            />
                        ) : null}
                    </FormItem>
                );
            });

            warrantyAuditDialog = (
                <Modal title={this.state.dialogName}
                       width={800}
                       visible={this.state.visible}
                       onOk={this.handleAddOk}
                       onCancel={this.handleAddCancel}
                       footer={[
                           <Button key="back" disabled={this.state.dialogName == '编辑金额审核方案'}
                                   onClick={() => this.handleAddOk('save')}>保存</Button>,
                           <Popconfirm title="确定吗?" onConfirm={() => this.handleAddOk('active')}>
                               <Button key="submit" type="primary">立即使用</Button></Popconfirm>
                       ]}>
                    <Form>
                        <FormItem {...formItemLayout} label={'方案名称'}>
                            {
                                getFieldDecorator('schemeInfo', {
                                    initialValue: this.state.editInfo ? this.convertToSchemeShow(this.state.editInfo.schemeInfoModel) : null,
                                    rules: [{
                                        required: true, message: '请选择方案名称'
                                    }]
                                })(
                                    <Input style={{ width: 200}} onClick={this.chooseScheme}/>
                                )
                            }
                        </FormItem>
                        {formItems}
                        <FormItem {...formItemLayout} label={'添加审核规则'}>
                            <Button type="dashed" onClick={this.addAuditLevel} style={{width: 200}}
                                    disabled={!validateRuleInfo(getFieldValue('auditInfo'), keys)}>
                                <Icon type="plus" />
                            </Button>
                        </FormItem>
                        <FormItem {...formItemLayout} label={'备注'}>
                            {
                                getFieldDecorator('remark', {
                                    initialValue: this.state.editInfo ? this.state.editInfo.remark : ''
                                })(
                                    <Input type={'textarea'} style={{width: 300}}/>
                                )
                            }
                        </FormItem>
                    </Form>
                </Modal>);

            chooseSchemeDialog = (
                <Modal title="选择方案"
                       width={600}
                       visible={this.state.chooseSchemeVisible}
                       onOk={this.handleSchemeOk}
                       onCancel={this.handleSchemeCancel}>
                    <Form layout="inline">
                        <FormItem label="名称">
                            {
                                getFieldDecorator('schemeName')(
                                    <Input style={{ width: 100}} />
                                )
                            }
                        </FormItem>
                        <Button type="primary" onClick={this.handleSchemeSubmit}>搜索</Button>
                        <br/>
                        <div className="table-content">
                            <Table columns={schemeColumn} dataSource={this.state.schemeList.items}
                                   pagination={paginationScheme}
                                   onChange={this.handleSchemeTableChange}
                                   rowSelection={rowSelection}
                                   bordered/>
                        </div>
                    </Form>
                </Modal>);

            showHistoryDialog = (
                <Modal title="修改记录"
                       width={800}
                       visible={this.state.showHistoryVisible}
                       onOk={this.handleHistoryOk}
                       onCancel={this.handleHistoryCancel}
                       footer={[]}>
                    <Form layout="inline">
                        <div className="table-content">
                            <Table columns={historyColumn} dataSource={this.state.historyList ? this.state.historyList.items : null}
                                   size={"small"}
                                   bordered/>
                        </div>
                    </Form>
                </Modal>);
        }

        let firstSearchView = (
            <span>
                <FormItem label="方案名称">
                            {
                                getFieldDecorator('schemeName', {
                                })(
                                    <Input  style={{ width: 200}} placeholder="请输入"/>
                                )
                            }
                 </FormItem>
                 <FormItem label="状态">
                            {
                                getFieldDecorator('status',{
                                    initialValue: ''
                                })(
                                    <Select placeholder="请选择" style={{ width: 200 }}>
                                        <Option value="">全部</Option>
                                        <Option value="0">已上架</Option>
                                        <Option value="1">已下架</Option>
                                    </Select>
                                )
                            }
                 </FormItem>
                 <FormItem>
                    {submitBtn}
                 </FormItem>
                 <FormItem >
                    {resetBtn}
                 </FormItem>
                 <FormItem >
                    {createAuditInfo}
                 </FormItem>
                {warrantyAuditDialog}
                {chooseSchemeDialog}
                {showHistoryDialog}
            </span>
        );

        if (this.stateAlready) {
            return (
                <div>
                    <h1>质保-报修审核设置</h1>
                    <Form layout="inline" style={{"padding":"20px"}}>
                        {firstSearchView}
                    </Form>
                    <div>
                        <div className="table-content">
                            <Table columns={columns} dataSource={this.state.list.items} rowKey="productId" pagination={pagination}
                                   onChange={this.handleTableChange}
                                   bordered/>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    }
}



WarrantyAuditManage = Form.create()(WarrantyAuditManage);
ReactDom.render(<div><WarrantyAuditManage></WarrantyAuditManage></div>, document.querySelector("#content"));
