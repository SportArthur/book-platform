import React from 'react';
import ReactDom from 'react-dom';
import SADPage from '@souche-f2e/sad';
import '../../../styles/index.less';

/*
 * 这里声明要引入的组件
 */
import { Form, Icon, Input,InputNumber, Button, Table, Pagination, Select, Checkbox, Modal, DatePicker, Row, Col, Popconfirm} from 'antd';
import { RJAreaCascader, RJCarSeriesCascader, RJMultiCarSeries} from '@souche-f2e/sad/components/RJAntd';
import {Component} from 'react';
import { containsResource } from '../../utils/utils';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const { Option, OptGroup } = Select;
const { MonthPicker, RangePicker } = DatePicker;

const resetCarSeriesCascader  = RJCarSeriesCascader.resetCarSeriesCascader

const moment = require('moment');

/**
 * 质保品牌车系黑名单管理
 */
class BlacklistManage extends SADPage {
    constructor() {
        super();
        this.state = {
            productForAdd: {},
            query: {},
            status: {},
            visible: false,
            addVisible: false,
            editingId: '',
            infoAdd: {},
            info: {},
            page: 1,
            pageSize: 10,
        }
    }

    /**
     * 切换分页
     * @param pagination
     */
    handleTableChange = (pagination) => {
        this.state.pageSize = pagination.pageSize;
        this.state.page = pagination.current;
        this.getListByFilter();
    }

    /**
     * 搜索查询
     * @param e
     */
    handSubmit = () => {
        this.state.query.carType = this.props.form.getFieldValue('carType');
        this.getListByFilter().then(data => {
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
        resetCarSeriesCascader(false);
        this.setState({
            query: {}
        });
    }

    /**
     * 删除选择的黑名单配置
     */
    delete = (record) => {
        this.state.info.id = record.id;
        this.deleteBlacklist().then(data => {
            // 删除完重新加载主页面
            this.getListByFilter();
        });
    }

    handleAdd = () => {
        this.state.info = {};
        resetCarSeriesCascader(true);
        this.setState({
            visible: true,
            showType: '新增',
            resetFields: true
        });
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
                title: '序号',
                dataIndex: 'id',
                key: 'id',
                display:false
            },
            {
                title: '品牌',
                dataIndex: 'brand',
                key: 'brand'
            },
            {
                title: '车系',
                dataIndex: 'series',
                key: 'series'
            },
            {
                title: '车辆类型',
                dataIndex: 'carType',
                key: 'carType',
                render: (text, record) => {
                    return '中规车';
                }
            },
            {
                title: '操作',
                dataIndex: 'option',
                width: 100,
                key: 'option',
                render: (text, record) => {
                    let deleteBtn = <Popconfirm title="确定删除吗?" onConfirm={() => this.delete(record)}><a>删除</a></Popconfirm>;
                    return (
                        <div>&nbsp;&nbsp; {deleteBtn}</div>
                    );
                }
            }]

        /**
         * 搜索框组件
         */
        let submitBtn = <Button type="primary" onClick={this.handSubmit}>搜索</Button>;
        let resetBtn = <Button onClick={this.handleReset}>清除</Button>;
        let firstSearchView = (
            <span>
                <FormItem label="品牌">
                            {
                                <div style={{ display: 'inline-block' }}>
                                    <RJCarSeriesCascader
                                        vehicleRange={['SOUCHE','CH168']}
                                        onBrandChange={(v) => {console.log(v); this.state.query.brand = v.key;}}
                                        onSerieChange={(v) => {console.log(v); this.state.query.series = v.key;}}
                                        onModelChange={(v) => {console.log(v); this.state.query.model = v.key;}}
                                        onChange={(code, value) => {console.log(code, value)}}
                                        allowClear={true}
                                        cascaderLevel={2}>
                                    </RJCarSeriesCascader>
                                </div>
                            }
                </FormItem>
                <FormItem>
                    {submitBtn}
                </FormItem>
                <FormItem >
                    {resetBtn}
                </FormItem>
                <FormItem>
                    <Button type="primary" icon="plus" onClick={this.handleAdd}>新增</Button>
                </FormItem>
            </span>
        );

        if (this.stateAlready) {
            return (
                <div>
                    <h1>质保-黑名单管理</h1>
                    <Form layout="inline" style={{"padding":"20px"}}>
                        {firstSearchView}
                    </Form>
                    <BlacklistDialog _this={this}/>
                    <div>
                        <div className="table-content">
                            <Table columns={columns} dataSource={this.state.list.items} rowKey="id" pagination={pagination}
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

class BlacklistDialog extends Component {

    // 组件初始化
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            level : 2
        }
    }

    handleOk = (record) => {
        let _this = this.props._this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            let flag = true;
            if(err) {
                for(var i in err) {
                    if(i == 'carType') {
                        flag = false;
                    }
                }
            }
            let carInfo = {};
            if(this.state.level == 2) {
                // 中规车
                if(!this.state.selectedCar || this.state.selectedCar.length == 0) {
                    alert("请选择品牌");
                    return;
                }
                carInfo.brand = this.state.selectedCar[0].label;
                carInfo.brandCode = this.state.selectedCar[0].key;
                if(this.state.selectedCar.length == 2) {
                    carInfo.series = this.state.selectedCar[1].label;
                    carInfo.seriesCode = this.state.selectedCar[1].key;
                }
            }else {
                // 平行进口车
                if(!this.state.selectedCar || this.state.selectedCar.length != 3) {
                    alert("请选择品牌车系车型");
                    return;
                }
                carInfo.brand = this.state.selectedCar[0].label;
                carInfo.brandCode = this.state.selectedCar[0].key;
                carInfo.series = this.state.selectedCar[1].label;
                carInfo.seriesCode = this.state.selectedCar[1].key;
                carInfo.model = this.state.selectedCar[2].label;
                carInfo.modelCode = this.state.selectedCar[2].key;
            }
            if(!err || flag) {
                _this.state.info = this.props.form.getFieldsValue();
                _this.state.info.car = carInfo;
                if(_this.state.showType == '新增') {
                    _this.addBlacklists().then(data => {
                        _this.setState({
                            visible: false
                        });
                        _this.getListByFilter();
                    });
                }
            }
        });
    }

    handleCancel = () => {
        let _this = this.props._this;
        _this.setState({
            visible: false,
        });
        this.props.form.resetFields();
    }

    onChangeCar = (value, label, extra) => {
        console.log(value);
        console.log(label);
        console.log(extra);
        this.state.selectedCar = extra;
    }

    render() {
        let _this = this.props._this;

        const {getFieldDecorator} = this.props.form;
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
        if(_this.stateAlready) {
            console.log(_this.state);
            if(_this.state.resetFields) {
                this.props.form.resetFields();
                _this.state.resetFields = false;
            }
            return (<Modal title={_this.state.showType}
                           visible={_this.state.visible}
                           onOk={this.handleOk}
                           onCancel={this.handleCancel}
                           width={800}>
                <Form>
                    <FormItem label="品牌车系" {...formItemLayout}>
                        {
                            <RJCarSeriesCascader
                                vehicleRange={['SOUCHE','CH168']}
                                onBrandChange={(v) => {console.log(v)}}
                                onSerieChange={(v) => {console.log(v)}}
                                onModelChange={(v) => {console.log(v)}}
                                allowClear={true}
                                onChange={(code, value) => {console.log(code, value); this.state.selectedCar = value;}}
                                cascaderLevel={2}>
                            </RJCarSeriesCascader>
                        }
                    </FormItem>
                </Form>
            </Modal>);
        }
        return null;
    }
}

BlacklistManage = Form.create()(BlacklistManage);
BlacklistDialog = Form.create()(BlacklistDialog);
ReactDom.render(<div><BlacklistManage></BlacklistManage></div>, document.querySelector("#content"));
