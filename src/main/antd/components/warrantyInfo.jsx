import React from 'react';

import {Component} from "react";
import { Form, Icon, Input,InputNumber, Button, Table, Pagination, Select, Checkbox, Modal, DatePicker, Row, Col, Radio, Dvider, Timeline} from 'antd';
import { RJAreaCascader,SubmitButton, RJTimeline } from '@souche-f2e/sad/components/RJAntd';
import { RJImgUploader } from '@souche-f2e/sad/components/RJAntd';
const moment = require('moment');


import {
    convertIsFactoryInsurance,
    convertIsFactoryLimitMileage,
    convertBaoyangStatus,
    convertQaActive,
    convertQaStatus,
    formatTime,
    convertLeaseAfterStatus,
    convertExtInsureStatus, convertExtTableMileage
} from '../pages/utils/utils';


const FormItem = Form.Item;

/**
 * 报修通用页面
 */
class WarrantyInfo extends Component {

    state = {
        selectedRowKeys: []
    };

    // 组件初始化
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            chooseMaintenanceVisible: false
        }
    };

    /**
     * 设置弹出框的显示与否
     * @param modalVisible
     */
    setModalVisible = (modalVisible) => {
        this.setState({
            modalVisible : modalVisible
        });
        //this.props.form.resetFields();
        this.setState({ selectedRowKeys:[] });
    };

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
            let _this = this.props._this;
            _this.state.remoteQuery = query;
            _this.state.remotePage = 1;
            //获取弹框数据，并重新加载页面
            _this.getRemotePageResult();
        })
    }
    /**
     * 清除查询条件
     */
    handleReset = () => {
        this.props.form.resetFields();
        this.setState({remoteQuery: {}});
    }
    /**
     * 切换分页
     * @param pagination
     hanldeTableChange = (pagination) => {
        this.state.pageSize = pagination.pageSize;
        this.state.page = pagination.current;
        this.getPageResult();

    }
     */
    /**
     * 添加规则-金融产品关联
     * @param data
     */
    addProducts=(data) => {
        this.setModalVisible(false);
        let _this = this.props._this;
        if(this.state.selectedRowKeys.length == 0){//用户未选择金融产品
            return;
        }
        _this.addRuleProductLink().then(function (value) {
            //_this.setState({query:{}});
            _this.getPageResult();
        });
    }

    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }

    render(){
        console.log(this);
        const {getFieldDecorator} = this.props.form;
        console.log(this.props.form.getFieldsValue());
        console.log(this.props._this);
        let _this = null;
        if (this.props._this) {
            _this = this.props._this;
        }
        let paginationMaintenance = null;

        let pagination = null;
        if (_this.state.allList) {
            pagination = {
                size: 'small',
                simple: true,
                total: _this.state.allList.totalNumber,
                current: _this.state.allList.currentIndex,
                pageSize: _this.state.allList.pageSize,
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

        if (_this.state.maintenanceList) {
            paginationMaintenance = {
                size: 'small',
                total: _this.state.maintenanceList.totalNumber,
                current: _this.state.maintenanceList.currentIndex,
                pageSize: _this.state.maintenanceList.pageSize,
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


        const { selectedRowKeys } = this.state;
        const rowSelection = {
            type: 'radio',
            onChange(selectedRowKeys, selectedRows) {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            onSelect(record) {
                console.log(record);
                this.state.selectedMaintenance = record;
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
                marginLeft: '25%',
                fontSize: '125%',
                marginRight: '25%'
            }
        };

        const historyColumn = [{
            title: '创建时间',
            dataIndex: 'dateCreate',
            key: 'dateCreate',
        },{
            title: '报修人',
            dataIndex: 'customerName',
            key: 'customerName'
        },{
            title: '故障现象描述',
            dataIndex: 'malfunctionInfo',
            key: 'malfunctionInfo'
        },{
            title: '处理结果',
            dataIndex: 'repairMode',
            key: 'repairMode',
            render: (text, record) => {
                // 保修模式0待查定1正常理赔， 3免赔，2拒赔
                let value = '';
                console.log(record);
                switch (record.repairMode){
                    case '0':value = '待查定';break;
                    case '1':value = '正常理赔';break;
                    case '2':value = '拒赔';break;
                    case '3':value = '免赔';break;
                    default:break;
                }
                return(
                    <div>{value}</div>
                )
            }
        },{
            title: '核定赔付金额',
            dataIndex:'totalPrice',
            key:'totalPrice',
            render: (text, record) => {
                return (<div>{record.totalPrice}元</div>);
            }
        },{
            title: '审查员',
            dataIndex:'subscriber',
            key:'subscriber'
        },{
            title: '操作',
            dataIndex:'option',
            key:'option',
            render: (text, record) => {
                console.log(record);
                return (<div><a onClick={() => location.href = `viewWarranty.html?id=${record.id}`}>查看理赔方案</a></div>);
            }
        }];

        let insuranceType;
        if(_this.state.list.insuranceOrder.isFactoryInsurance == 'Y' &&
            (!_this.state.list.warrantyVO.insuranceActiveNow || _this.state.list.warrantyVO.insuranceActiveNow == '1')) {
            insuranceType = '厂家质保(' + moment(_this.state.list.insuranceOrder.factoryInsuranceEndDate).format("YYYY-MM-DD") + '到期)';
        }else {
            insuranceType = '大搜车质保';
        }

        let qaValidStr;
        if(_this.state.list.insuranceOrder.qaStart) {

            qaValidStr = moment(_this.state.list.insuranceOrder.qaStart).format("YYYY-MM-DD") + ' 至 ' + moment(_this.state.list.insuranceOrder.qaEnd).format("YYYY-MM-DD");
        }else {
            qaValidStr = '无';
        }
        let auditHistoryContent = new Array();
        if(_this.state.list.warrantyAuditHistoryList) {
            let auditHistoryArray = _this.state.list.warrantyAuditHistoryList;

            console.log(auditHistoryArray);
            for(var i = 0; i < auditHistoryArray.length; i++) {
                if(i == 0) {
                    auditHistoryContent.push((<Timeline.Item><div style={{fontSize: 14}}>发起人: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{auditHistoryArray[i].name} {auditHistoryArray[i].phone}
                        &nbsp;&nbsp;&nbsp;&nbsp;发起时间: {auditHistoryArray[i].dateCreate}</div></Timeline.Item>));
                }else {
                    if(auditHistoryArray[i].type == '0') {
                        auditHistoryContent.push(<Timeline.Item><div style={{fontSize: 14}}>查定员: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{auditHistoryArray[i].name} {auditHistoryArray[i].phone}
                            &nbsp;&nbsp;&nbsp;&nbsp;提交时间: {auditHistoryArray[i].dateCreate}</div></Timeline.Item>);
                    }else {
                        let refuseContent;
                        if(auditHistoryArray[i].auditResult != 0) {
                            refuseContent = (<div>驳回原因: &nbsp;&nbsp;{auditHistoryArray[i].refuseReason}</div>);
                        }
                        auditHistoryContent.push(<Timeline.Item><div style={{fontSize: 14}}>审核人: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{auditHistoryArray[i].name} {auditHistoryArray[i].phone}
                            &nbsp;&nbsp;&nbsp;&nbsp;审核时间: {auditHistoryArray[i].dateCreate}<br/>审核结果: &nbsp;&nbsp;{auditHistoryArray[i].auditResult == 0 ? '通过' : '驳回'}
                            &nbsp;&nbsp;&nbsp;&nbsp;{refuseContent}</div></Timeline.Item>);
                    }
                }
            }
        }

        return (
            <div>
                <h1 {...styleLevel1}>报修管理</h1>
                <h2 {...styleLevel2}>报修信息</h2>
                <Row gutter={50} {...styleLevel3}>
                    <Col span={10}>报修人姓名:{_this.state.list.warrantyVO.customerName}</Col>
                    <Col span={10}>报修人电话:{_this.state.list.warrantyVO.phone}</Col>
                </Row>
                <Row gutter={50} {...styleLevel3}>
                    <Col span={10}>当前表显里程:{_this.state.list.warrantyVO.mileage}公里</Col>
                    <Col span={10}>车辆所在地:{_this.state.list.warrantyVO.province}{_this.state.list.warrantyVO.city}{_this.state.list.warrantyVO.carAddr}</Col>
                </Row>
                <Row gutter={50} {...styleLevel3}>
                    <Col span={10}>故障现象描述:{_this.state.list.warrantyVO.malfunctionInfo}</Col>
                </Row>
                <Row gutter={50} {...styleLevel3}>
                    <Col span={10}>创建人:{_this.state.list.warrantyVO.subscriber}</Col>
                    <Col span={10}>创建时间:{_this.state.list.warrantyVO.dateCreate}</Col>
                </Row>
                <h2 {...styleLevel2}>车辆信息</h2>
                <Row gutter={50} {...styleLevel3}>
                    <Col span={10}>车辆名称:{_this.state.list.insuranceOrder.carName}</Col>
                    <Col span={10}>VIN码:{_this.state.list.warrantyVO.vin}</Col>
                </Row>
                <Row gutter={50} {...styleLevel3}>
                    <Col span={10}>发车时表显里程:{_this.state.list.insuranceOrder.mileage}公里</Col>
                    <Col span={10}>开启时表显里程:{_this.state.list.insuranceOrder.tableMileage ? _this.state.list.insuranceOrder.tableMileage * 10000 : ''}公里</Col>
                </Row>
                <Row gutter={50} {...styleLevel3}>
                    <Col span={10}>车源类型:{_this.state.list.insuranceCarWrapperModel.importType}</Col>
                    <Col span={10}>座位数:{_this.state.list.insuranceCarWrapperModel.seetNumber}座</Col>
                </Row>
                <Row gutter={50} {...styleLevel3}>
                    <Col span={10}>使用性质:{_this.state.list.insuranceCarWrapperModel.useTypeName}</Col>
                    <Col span={10}>车身结构:{_this.state.list.insuranceCarWrapperModel.bodyName}</Col>
                </Row>
                <Row gutter={50} {...styleLevel3}>
                    <Col span={10}>燃油类型:{_this.state.list.warrantyVO.fuelType}</Col>
                    <Col span={10}>变速箱:{_this.state.list.warrantyVO.gearBoxType}</Col>
                </Row>
                <Row gutter={50} {...styleLevel3}>
                    <Col span={10}>初次上牌时间:{_this.state.list.warrantyVO.firstLicensePlateDate}</Col>
                    <Col span={10}>排量:{_this.state.list.warrantyVO.engineVolume}L</Col>
                </Row>
                <Row gutter={50} {...styleLevel3}>
                    <Col span={10}>进气方式:{_this.state.list.warrantyVO.intakeType}</Col>
                    <Col span={10}>车商:{_this.state.list.insuranceOrder.shopName}({_this.state.list.insuranceOrder.sellerName})</Col>
                </Row>
                <Row gutter={50} {...styleLevel3}>
                    <Col span={10}>客户信息:{_this.state.list.insuranceOrder.buyerName} {_this.state.list.insuranceOrder.buyerPhone}</Col>
                    <Col span={10}>是否有事故记录:{_this.state.list.insuranceCarWrapperModel.hasAccidentRecord}</Col>
                </Row>
                <Row gutter={50} {...styleLevel3}>
                    <Col span={10}>生产日期:{_this.state.list.insuranceCarWrapperModel.productionDate}</Col>
                </Row>
                <h2 {...styleLevel2}>质保方案</h2>
                <Row gutter={50} {...styleLevel3}>
                    <Col span={10}>质保信息:{_this.state.list.insuranceOrder.insuranceOrderSchemeInfo.productName}</Col>
                    <Col span={10}>当前质保类型:{insuranceType}</Col>
                </Row>
                <Row gutter={50} {...styleLevel3}>
                    <Col span={10}>质保状态:{convertQaActive(_this.state.list.insuranceOrder.qaActive)}</Col>
                    <Col span={10}>报修范围:{_this.state.list.insuranceOrder.insuranceOrderSchemeInfo.parts}</Col>
                </Row>
                <Row gutter={50} {...styleLevel3}>
                    <Col span={10}>质保期限:{_this.state.list.insuranceOrder.insuranceOrderSchemeInfo.expires}</Col>
                    <Col span={10}>免赔期限:{_this.state.list.insuranceOrder.insuranceOrderSchemeInfo.freeCompensage}</Col>
                </Row>
                <Row gutter={50} {...styleLevel3}>
                    <Col span={10}>赔付限额:{_this.state.list.insuranceOrder.insuranceOrderSchemeInfo.compensateLimit}元/每年</Col>
                    <Col span={10}>增值服务:{_this.state.list.insuranceOrder.insuranceOrderSchemeInfo.freeService}</Col>
                </Row>
                <Row gutter={50} {...styleLevel3}>
                    <Col span={10}>质保有效期:{qaValidStr}</Col>
                    <Col span={10}>保费共计:{_this.state.list.insuranceOrder.usedPrice}元</Col>
                </Row>
                <h2 {...styleLevel2}>延保信息</h2>
                <Row gutter={50} {...styleLevel3}>
                    <Col span={10}>延保状态:{convertExtInsureStatus(_this.state.list.insuranceOrder.extInsureChanceStatus)}</Col>
                    <Col span={10}>融租信息:{convertLeaseAfterStatus(_this.state.list.insuranceOrder.extInsureChanceLeaseHandleType)}</Col>
                </Row>
                <Row gutter={50} {...styleLevel3}>
                    <Col span={10}>融租期理赔:{_this.state.list.insuranceOrder.extInsureChanceEffectiveClaimStatus == 'Y' ? '有' : '无'}</Col>
                    <Col span={10}>融租期行驶里程:{convertExtTableMileage(_this.state.list.insuranceOrder.extInsureChanceInitGpsMileage,_this.state.list.insuranceOrder.extInsureChanceContractEndGpsMileage)}公里</Col>
                </Row>
                <Row gutter={50} {...styleLevel3}>
                    <Col span={10}>生效日:{formatTime(_this.state.list.insuranceOrder.extInsureChanceEffectiveStartDate)}</Col>
                    <Col span={10}>截止日:{formatTime(_this.state.list.insuranceOrder.extInsureChanceEffectiveEndDate)}</Col>
                </Row>
                <Row gutter={50} {...styleLevel3}>
                    <Col span={10}>关闭原因:{_this.state.list.insuranceOrder.extInsureChanceNotAccordDesc}</Col>
                </Row>

                <h2 {...styleLevel2}>历史赔付</h2>
                <Table {...styleLevel4} columns={historyColumn} dataSource={_this.state.list.historyRepairList}
                       size={"small"}
                       bordered/>
                <h2 {...styleLevel2}>审核信息</h2>
                <Timeline {...styleLevel4}>
                    {auditHistoryContent}
                </Timeline>
            </div>);
    }
}

WarrantyInfo = Form.create()(WarrantyInfo);

export default WarrantyInfo
