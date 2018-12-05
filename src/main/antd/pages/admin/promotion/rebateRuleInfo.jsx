import React from 'react';
import ReactDom from 'react-dom';
import SADPage from '@souche-f2e/sad';
import '../../../styles/index.less';

/*
 * 这里声明要引入的组件
 */
import { Form, Table, Modal, Row, Col, Button} from 'antd';
import { RJAreaCascader } from '@souche-f2e/sad/components/RJAntd';

const FormItem = Form.Item;
const confirm = Modal.confirm;


/**
 * 质保返佣规则页面
 */
class RebateRuleInfo extends SADPage {
    constructor() {
        super();
        this.state = {
            productForAdd:{},
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
        // this.getShopList();
    }

    convertToSchemeShow = (record) => {
        return `${record.qaName}${record.productName}${record.expiresYear}年期(${record.engineVolumeDown}-${record.engineVolumeUp}L)`;
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
        };

        const styleLevel1 = {
            style : {
                marginLeft: '15%'
            }
        };
        const styleLevel2 = {
            style : {
                marginLeft: '20%'
            }
        };
        const styleLevel3 = {
            style : {
                marginLeft: '25%',
                fontSize: '125%'
            }
        };

        const styleLevel4 = {
            style : {
                marginLeft: '31%',
                fontSize: '100%',
                marginRight: '10%'
            }
        };

        const columns = [
            {
                title: '车商名称',
                dataIndex: 'shopName',
                key: 'shopName'
            },
            {
                title: '店铺编号',
                dataIndex: 'shopCode',
                key: 'shopCode'
            },
            {
                title: '地址',
                dataIndex: 'cityName',
                key: 'cityName'
            }
        ]

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

        const schemeColumn = [
            {
                title: '方案序号',
                dataIndex: 'id',
            },
            {
                title: '方案名称',
                dataIndex: 'productName',
                render: (text, record) => {
                    // console.log(record);
                    return <div>{this.convertToSchemeShow(record)}</div>;
                }
            }
        ];

        const carColumn = [
            {
                title: '品牌',
                dataIndex: 'brandName',
            },
            {
                title: '车系',
                dataIndex: 'seriesName',
            },
            {
                title: '车型',
                dataIndex: 'modelName',
            }
        ];


        if (this.stateAlready) {
            let ruleStr = '';
            let ruleHead = '';
            console.log(this.state.list);
            let ruleDetail;
            let list = this.state.list.activityDetailModelList;
            for(var i = 0; i< list.length; i++){
                if(this.state.list.type =='0'){
                    ruleDetail = (<div>{ruleDetail} {list[i].min}单-{list[i].max}单,打{list[i].discount}折<br/></div>);
                }else{
                    ruleDetail = (<div>{ruleDetail} {list[i].min}元-{list[i].max}元,返{list[i].discount}元<br/></div>);
                }
            }
            return (
                <div>
                    <h1>促销活动>查看</h1>
                    <Row gutter={50}>
                        <Col span={50}>
                            <FormItem {...formItemLayout} label="活动名称">
                                {this.state.list.name} &nbsp;&nbsp;&nbsp;活动ID: {this.state.list.id}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={50}>
                        <Col span={50}>
                            <FormItem {...formItemLayout} label="活动描述">
                                {this.state.list.description}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={50}>
                        <Col span={50}>
                            <FormItem {...formItemLayout} label="图标">
                                <img style={{ width: 100}} src={this.state.list.iconUrl} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={50}>
                        <Col span={50}>
                            <FormItem {...formItemLayout} label="有效期">
                                {(this.state.list.startTime).split(' ')[0]} - {(this.state.list.endTime).split(' ')[0]}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={50}>
                        <Col span={50}>
                            <FormItem {...formItemLayout} label="政策规则">
                                {ruleDetail}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row style={this.state.list.schemeType == '0' ? {display: 'block'} : {display: 'none'}}>
                        <Col span={24}>
                            <FormItem {...formItemLayout} label="质保方案">
                                全部质保方案
                            </FormItem>
                        </Col>
                    </Row>
                    <Row style={this.state.list.schemeType == '1' ? {display: 'block'} : {display: 'none'}}>
                        <Col span={24}>
                            <FormItem {...formItemLayout} label="质保方案">
                                <Table columns={schemeColumn} dataSource={this.state.list.schemeInfoModelList} rowKey='id'
                                       bordered
                                />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row style={this.state.list.carType == '0' ? {display: 'block'} : {display: 'none'}}>
                        <Col span={24}>
                            <FormItem {...formItemLayout} label="品牌车型">
                                全部品牌车型
                            </FormItem>
                        </Col>
                    </Row>
                    <Row style={this.state.list.carType == '1' ? {display: 'block'} : {display: 'none'}}>
                        <Col span={24}>
                            <FormItem {...formItemLayout} label="品牌车型">
                                <Table columns={carColumn} dataSource={this.state.list.activityCarModelList}
                                       bordered
                                />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row style={this.state.list.shopType == '0' ? {display: 'block'} : {display: 'none'}}>
                        <Col span={24}>
                            <FormItem {...formItemLayout} label="车商">
                                全部车商
                            </FormItem>
                        </Col>
                    </Row>
                    <Row style={this.state.list.shopType == '1' ? {display: 'block'} : {display: 'none'}}>
                        <Col span={24}>
                            <FormItem {...formItemLayout} label="车商">
                                <Table columns={columns} dataSource={this.state.list.shopModelList} rowKey="salesShopId"
                                       // pagination={pagination}
                                       // onChange={this.hanldeTableChange}
                                       bordered/>
                            </FormItem>
                        </Col>
                    </Row>
                    {/*<div>*/}
                        {/*<div className="table-content" style={{width:'40%',marginLeft: 400}} >*/}
                            {/*<Table columns={columns} dataSource={this.state.list.items} rowKey="salesShopId" pagination={pagination}*/}
                                   {/*onChange={this.hanldeTableChange}*/}
                                   {/*bordered/>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                    <div>
                        <Button onClick={() => location.href = `rebateRuleIndex.html`}
                                style={{marginLeft: 520}}>返回</Button>
                    </div>
                </div>
            );
        }

        return null;
    }

}


RebateRuleInfo = Form.create()(RebateRuleInfo);
ReactDom.render(<div><RebateRuleInfo></RebateRuleInfo></div>, document.querySelector("#content"));
