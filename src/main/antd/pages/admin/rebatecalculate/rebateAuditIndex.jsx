import React from 'react';
import ReactDom from 'react-dom';
import SADPage from '@souche-f2e/sad';
import '../../../styles/index.less';
import { containsResource } from '../../utils/utils';

/**
 * 这里声明要引入的组件
 */
import { Form, Input, Button, Table, Select, DatePicker, Tabs} from 'antd';
import { RJCarSeriesCascader } from '@souche-f2e/sad/components/RJAntd';

const FormItem = Form.Item;
const { Option } = Select;
const moment = require('moment');
const { MonthPicker } = DatePicker;
const TabPane = Tabs.TabPane;
const resetCarSeriesCascader  = RJCarSeriesCascader.resetCarSeriesCascader;

/**
 * 返佣审核列表页面
 */
class RebateAuditIndex extends SADPage {
    constructor() {
        super();
        this.state = {
            query:{},
            status: {}
        }
    }

    /**
     * 切换分页
     * @param pagination
     */
    hanldeTableChange = (pagination) => {
        this.state.pageSize = pagination.pageSize;
        this.state.page = pagination.current;
        this.getRebateOrderList();
    }

    /**
     * 切换分页 月结
     * @param pagination
     */
    hanldeShopMonthTableChange = (pagination) => {
        this.state.pageSize = pagination.pageSize;
        this.state.page = pagination.current;
        this.getRebateShopMonthList();
    }

    /**
     * 搜索查询
     */
    handSubmit = () => {
        this.state.query = this.props.form.getFieldsValue();
        if(this.state.query.start && this.state.query.end){
            this.state.query.start = moment(this.state.query.start).subtract(1, 'months').format("YYYYMM") + "01";
            this.state.query.end = moment(this.state.query.end).subtract(1, 'months').endOf('month').format("YYYYMMDD");
        }
        this.getRebateOrderList().then(data => {
            if (data.success) {
                return;
            }
        });
    }

    /**
     * 搜索查询 月结
     */
    handShopMonthSubmit = () => {
        this.state.query = this.props.form.getFieldsValue();
        if(this.state.query.start && this.state.query.end){
            this.state.query.start = moment(this.state.query.start).subtract(1, 'months').format("YYYYMM") + "01";
            this.state.query.end = moment(this.state.query.end).subtract(1, 'months').endOf('month').format("YYYYMMDD");
        }
        this.getRebateShopMonthList().then(data => {
            if (data.success) {
                return;
            }
        });
    }

    /**
     * 导出
     */
    handleExport = () => {
        this.state.query = this.props.form.getFieldsValue();
        if(this.state.query.start && this.state.query.end){
            this.state.query.start = moment(this.state.query.start).format("YYYYMM") + "01";
            this.state.query.end = moment(this.state.query.end).endOf('month').format("YYYYMMDD");
        }
        this.state.query.brandCode = this.state.brandCode;
        this.state.query.seriesCode = this.state.seriesCode;
        this.state.query.modelCode = this.state.modelCode;
        let queryJson= encodeURIComponent(JSON.stringify(this.state.query));
        let exportUrl = `${this.baseUri}/admin/export/RebateAuditOrderExcelExport.html?query=${queryJson}`
        window.location.href = exportUrl;
    }

    /**
     * 导出 月结
     */
    handleExportShopMonth = () => {
        this.state.query = this.props.form.getFieldsValue();
        if(this.state.query.start && this.state.query.end){
            this.state.query.start = moment(this.state.query.start).format("YYYYMM") + "01";
            this.state.query.end = moment(this.state.query.end).endOf('month').format("YYYYMMDD");
        }
        let queryJson= encodeURIComponent(JSON.stringify(this.state.query));
        let exportUrl = `${this.baseUri}/admin/export/RebateAuditShopMonthExcelExport.html?query=${queryJson}`
        window.location.href = exportUrl;
    }

    /**
     * 清除查询条件
     */
    handleReset = () => {
        this.props.form.resetFields();
        this.setState({query: {}});
        this.setState({brandCode: null});
        this.setState({seriesCode: null});
        this.setState({modelCode: null});
        resetCarSeriesCascader(false);
    }

    /**
     *
     * @returns {*}
     */
    render() {
        const {getFieldDecorator} = this.props.form;
        // 审核状态枚举
        let auditStatusEnum = ['运营待审核','运营审核不通过','结算待审核','结算审核不通过','财务待审核','财务审核不通过','财务待打款','财务打款成功'];
        let pagination = null;
        let _this = null;
        if (this.props._this) {
            _this = this.props._this;
        }
        if (this.state.rebateShopMonthlist) {
            pagination = {
                size: 'small',
                total: this.state.rebateShopMonthlist.totalNumber,
                current: this.state.rebateShopMonthlist.currentIndex,
                pageSize: this.state.rebateShopMonthlist.pageSize,
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

        let paginationAll = null;
        let _thisShopMonth = null;
        if (this.props._this) {
            _thisShopMonth = this.props._this;
        }
        if (this.state.rebateOrderlist) {
            paginationAll = {
                size: 'small',
                total: this.state.rebateOrderlist.totalNumber,
                current: this.state.rebateOrderlist.currentIndex,
                pageSize: this.state.rebateOrderlist.pageSize,
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

        const columns = [
            {
                title: '活动ID',
                dataIndex: 'rebateId',
                key: 'rebateId'
            },
            {
                title: '订单编号',
                dataIndex: 'orderCode',
                key: 'orderCode'
            },
            {
                title: '车辆信息',
                dataIndex: 'carName',
                key: 'carName'
            },
            {
                title: '结算单编号',
                dataIndex: 'settlementNo',
                key: 'settlementNo'
            },
            {
                title: '销售店铺',
                dataIndex: 'shopCode',
                key: 'shopCode',
                render: (text, record) => {
                    return record.shopCode + record.shopName;
                }
            },
            {
                title: '返佣类型',
                dataIndex: 'rebateType',
                key: 'rebateType',
                render: (text, record) => {
                    if(record.rebateType == 1 ){
                        return '中规车质保（二手车）';
                    } else {
                        return '平行进口车质保';
                    }
                }
            },
            {
                title: '返佣金额',
                dataIndex: 'rebateAmount',
                key: 'rebateAmount'
            },
            {
                title: '返佣时间',
                dataIndex: 'dateCreate',
                key: 'dateCreate',
                render: (text, record) => {
                    return moment(record.dateCreate).add(1, 'months').format('YYYY-MM');
                }
            },
            {
                title: '审核状态',
                dataIndex: 'auditStatus',
                key: 'auditStatus',
                render: (text, record) => {
                    return auditStatusEnum[record.auditStatus - 1];
                }
            },
            {
                title: '备注',
                dataIndex: 'remarks',
                width: 150,
                key: 'remarks'
            }
        ]

        // 月结
        const columns4Month = [
            {
                title: '店铺名称',
                dataIndex: 'shopCode',
                key: 'shopCode',
                render: (text, record) => {
                    return record.shopCode + record.shopName;
                }
            },
            {
                title: '返佣总金额',
                dataIndex: 'totalRebateAmount',
                key: 'totalRebateAmount'
            },
            {
                title: '应返佣月',
                dataIndex: 'dateCreate',
                key: 'dateCreate',
                render: (text, record) => {
                    return moment(record.dateCreate).add(1, 'months').format('YYYY-MM');
                }
            },
            {
                title: '操作',
                dataIndex: 'option',
                width: 100,
                key: 'option',
                render: (text, record) => {
                    let end = moment(record.rebateMonth + '01').endOf('months').format('YYYYMMDD');
                    let financeProductBtn = <a onClick={() => location.href = `rebateAuditDetail.html?shopCode=${record.shopCode}&end=${end}`}>审批</a>;
                    let option = ( <div></div>);
                    if(record.auditStatus==1){
                        option= (<div>
                            {financeProductBtn}
                        </div>)
                    }
                    return (<div>{option}</div>)
                }
            }
        ]

        /**
         * 搜索框组件
         */
        let submitBtn = <Button type="primary" onClick={this.handSubmit}>搜索</Button>;
        let exportBtn = <Button type="primary" onClick={this.handleExport}>导出</Button>;
        let submitShopMonthBtn = <Button type="primary" onClick={this.handShopMonthSubmit}>搜索</Button>;
        let exportShopMonthBtn = <Button type="primary" onClick={this.handleExportShopMonth}>导出</Button>;
        let resetBtn = <Button onClick={this.handleReset}>清除</Button>;

        let rebateOrderSearchView = (
            <span>
                <FormItem label="店铺名称">
                            {
                                getFieldDecorator('shopName', {
                                })(
                                    <Input  style={{ width: 200}} placeholder="请输入"/>
                                )
                            }
                 </FormItem>
                <FormItem label="店铺编码">
                            {
                                getFieldDecorator('shopCode', {
                                })(
                                    <Input  style={{ width: 200}} placeholder="请输入"/>
                                )
                            }
                 </FormItem>
                <FormItem label="vin码">
                            {
                                getFieldDecorator('vin', {
                                })(
                                    <Input  style={{ width: 200}} placeholder="请输入"/>
                                )
                            }
                 </FormItem>
                 <FormItem label="应返佣月">
                     {getFieldDecorator('start')(
                        <MonthPicker placeholder="开始日期"/>
                    )}
                    {getFieldDecorator('end')(
                        <MonthPicker placeholder="截止日期"/>
                    )}
                 </FormItem>
                <FormItem label="订单编号">
                            {
                                getFieldDecorator('orderCode', {
                                })(
                                    <Input  style={{ width: 200}} placeholder="请输入"/>
                                )
                            }
                 </FormItem>
                <FormItem label="品牌车系车型">
                            <RJCarSeriesCascader
                                /**
                                  *  数据结构
                                  *  v = {
                                  *      key: "brand-13",
                                  *      label: "阿斯顿马丁"
                                *  }
                                */
                                onBrandChange={(v) => {
                                    this.setState({
                                        brandCode : v.key
                                    })
                                }}
                                onSerieChange={(v) => {
                                    this.setState({
                                        seriesCode : v.key
                                    })
                                }}
                                onModelChange={(v) => {
                                    this.setState({
                                        modelCode : v.key
                                    })
                                }}
                                cascaderLevel={3}>
                            </RJCarSeriesCascader>
                 </FormItem>
                <FormItem label="活动ID">
                            {
                                getFieldDecorator('rebateId', {
                                })(
                                    <Input  style={{ width: 200}} placeholder="请输入"/>
                                )
                            }
                 </FormItem>
                 <FormItem label="审核状态">
                            {
                                getFieldDecorator('auditStatus', {
                                })(
                                    <Select placeholder="全部" style={{ width: 200 }}>
                                        <Option value="0">全部</Option>
                                        <Option value="1">运营待审核</Option>
                                        <Option value="2">运营审核不通过</Option>
                                        <Option value="3">结算待审核</Option>
                                        <Option value="4">结算审核不通过</Option>
                                        <Option value="5">财务待审核</Option>
                                        <Option value="6">财务审核不通过</Option>
                                        <Option value="7">财务待打款</Option>
                                        <Option value="8">财务打款成功</Option>
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
                    {exportBtn}
                 </FormItem>
            </span>

        );

        {/*月结*/}
        let rebateShopMonthSearchView = (
            <span>
                <FormItem label="店铺名称">
                            {
                                getFieldDecorator('shopName', {
                                })(
                                    <Input  style={{ width: 200}} placeholder="请输入"/>
                                )
                            }
                 </FormItem>
                <FormItem label="店铺编码">
                            {
                                getFieldDecorator('shopCode', {
                                })(
                                    <Input  style={{ width: 200}} placeholder="请输入"/>
                                )
                            }
                 </FormItem>
                 <FormItem label="应返佣月">
                     {getFieldDecorator('start')(
                         <MonthPicker placeholder="开始日期" />
                     )}
                     {getFieldDecorator('end')(
                         <MonthPicker placeholder="截止日期" />
                     )}
                 </FormItem>

                 <FormItem>
                    {submitShopMonthBtn}
                 </FormItem>
                <FormItem>
                    {resetBtn}
                 </FormItem>
                <FormItem>
                    {exportShopMonthBtn}
                </FormItem>
            </span>

        );


        if (this.stateAlready) {
            return (
                <div>
                    <h1>车商返佣结算</h1>
                    <br/><br/>
                    <Tabs defaultActiveKey="1" onChange={this.handleReset}>
                        {/*月结*/}
                        <TabPane tab="待审批" key="1">

                            <Form layout="inline">
                                {rebateShopMonthSearchView}
                            </Form>
                            <div>
                                <Table columns={columns4Month} dataSource={this.state.rebateShopMonthlist.items} rowKey="rebateShopMonthId" pagination={pagination}
                                       onChange={this.hanldeShopMonthTableChange}
                                       bordered/>
                            </div>

                        </TabPane>

                        {/*结算单*/}
                        <TabPane tab="全部" key="2">
                            <div>
                                <Form layout="inline">
                                    {rebateOrderSearchView}
                                </Form>
                                <div>
                                    <Table columns={columns} dataSource={this.state.rebateOrderlist.items} rowKey="rebateOrderId" pagination={paginationAll}
                                           onChange={this.hanldeTableChange}
                                           bordered/>
                                </div>
                            </div>

                        </TabPane>
                    </Tabs>
                </div>
            );
        }

        return null;
    }

}


RebateAuditIndex = Form.create()(RebateAuditIndex);
ReactDom.render(<div><RebateAuditIndex></RebateAuditIndex></div>, document.querySelector("#content"));
