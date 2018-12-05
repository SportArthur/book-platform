import React from 'react';
import ReactDom from 'react-dom';
import SADPage from '@souche-f2e/sad';
import '../../../styles/index.less';
import { containsResource } from '../../utils/utils';

/**
 * 这里声明要引入的组件
 */
import { Form, Input, Button, Table, Popconfirm } from 'antd';
import { RJAreaCascader, SubmitButton } from '@souche-f2e/sad/components/RJAntd';

const FormItem = Form.Item;

let selectCity = {};
let selectChecker = {};

/**
 * 质保新增查定员管辖地理位置
 */
class AddCheckerArea extends SADPage {
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
        this.getListChecker();
    }

    /**
     * 提交
     */
    handSubmit = (type) => {
        if(this.state.checker == null || this.state.checker.length == 0){
            alert("请选择查定员！");
            return;
        }
        if(this.state.citys == null || this.state.citys.length == 0){
            alert("请选择城市！");
            return;
        }
        if(type && type == 'active'){ // 1：上架，2：下架
            this.state.checker.checkerOpenStatus = 1;
        }else{
            this.state.checker.checkerOpenStatus = 2;
        }
        this.state.remarks = this.props.form.getFieldsValue().remarks;
        this.insertQaCheckerArea().then(data => {
            if (data.success) {
                alert(this.state.msg);
                location.href = `checkerAreaIndex.html`;
                return;
            }
        });
    }

    /**
     * 查询
     */
    handSearch = () => {
        this.state.query.phone = this.props.form.getFieldsValue().phone;
        this.getListChecker().then(data => {
            if (data.success) {
                return;
            }
        });
    }

    /**
     * 查询地理位置是否已被其他上架查定员管辖
     */
    cityInUse = (cityCode) => {
        this.state.query.cityCode = cityCode;
        this.isCityInUse().then(data => {
            if (data.isCityInUse) {
                return false;
            } else {
                return true;
            }
        });
    }

    /**
     * 删除城市
     */
    handleDelete=record=>{
        let preCitys = this.state.citys || []
        preCitys = preCitys.filter(shop=>shop.cityCode!==record.cityCode)
        this.setState({
            citys:preCitys
        })
    }
    /**
     * 增加城市
     */
    handAddCity = () => {
        let selectCitys = this.state.citys || []
        for(var i=0; i<selectCitys.length; i++){
            if (selectCitys[i].cityCode == selectCity.cityCode){
                alert('该城市已添加，请勿重复添加！');
                return;
            }
        }
        selectCitys.push({province:selectCity.province,provinceCode:selectCity.provinceCode,city:selectCity.city,cityCode:selectCity.cityCode});
        this.setState({
            citys : selectCitys
        })
    }

    /**
     *
     * @returns {*}
     */
    render() {
        const {getFieldDecorator} = this.props.form;
        let pagination = null;
        let _this = null;
        let that = this;
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

        const rowSelection = {
            type:'radio',
            onSelect(record, selected, selectedRows) {
                if(selected){
                    selectChecker = record;
                }
                that.setState({
                    checker : selectChecker
                });
            }
        };

        const columnsCity = [
            {
                title: '省份',
                dataIndex: 'province',
                key: 'province'
            },
            {
                title: '城市',
                dataIndex: 'city',
                key: 'city'
            },
            {
                title:'操作',
                key:'deleteOperate',
                dataIndex: 'deleteOperate',
                render: (text, record) => {
                    return (
                        this.state.citys.length > 0
                            ? (
                                <Popconfirm title="确定删除?" onConfirm={() => this.handleDelete(record)}>
                                    <a href="javascript:;">删除</a>
                                </Popconfirm>
                            ) : null
                    );
                }
            }
        ]

        const columnsChecker = [
            {
                title: '姓名',
                dataIndex: 'nickname',
                key: 'nickname'
            },
            {
                title: '电话',
                dataIndex: 'phone',
                key: 'phone'
            }
        ]

        /**
         * 搜索框组件
         */
        let searchBtn = <Button type="primary" onClick={this.handSearch}>查询</Button>;

        let submitBtn = <Button type="primary" onClick={this.handAddCity}>增加</Button>;

        let checkerSelectView = (

            <FormItem label="查定员：">
                <input value={selectChecker.nickname} placeholder="请选择查定员" disabled={true}/>
            </FormItem>

        );

        let checkerSearchView = (
            <FormItem>

                {getFieldDecorator(`phone`)(
                    <Input placeholder="请输入姓名或手机号" autosize />
                )}
            </FormItem>
        );


        let citySelectView = (
            <div>

                <FormItem label="地理位置：">
                    <RJAreaCascader allowClear={true} showSearch={true} cascaderLevel={2}
                                    onProvinceChange={(v) => {
                                        selectCity.province = v.label;
                                        selectCity.provinceCode = v.key;
                                    }}
                                    onCityChange={(v) => {
                                        selectCity.city = v.label;
                                        selectCity.cityCode = v.key;
                                        this.cityInUse(v.key);
                                    }}/>
                </FormItem>
                &nbsp;&nbsp;{submitBtn}

            </div>

        );

        let showSelectCitys = (
            <div className="table-content" style={{width:'50%'}}>
                <Table columns={columnsCity} dataSource={this.state.citys} rowKey='cityCode'
                       bordered/>
            </div>
        );


        if (this.stateAlready) {

            return (
                <div>
                    <h1>质保-新增查定员地理位置</h1>
                    <br/><br/>
                    <div style={{marginLeft: 200, marginRight:10}} >
                        <Form layout="inline">
                            {checkerSelectView}
                            {checkerSearchView}
                            {searchBtn}
                        </Form>
                        <div>
                            <div className="table-content" style={{width:'50%'}}>
                                <Table columns={columnsChecker} dataSource={this.state.checkerList} rowKey='phone'
                                       onChange={this.hanldeTableChange}
                                       rowSelection={rowSelection}
                                       bordered/>
                            </div>
                        </div>
                        <Form layout="inline">
                            {citySelectView}
                            {showSelectCitys}
                        </Form>
                        <FormItem
                            label="备注："
                            required={false}
                        >
                            {getFieldDecorator(`remarks`)(
                                <Input type={'textarea'} placeholder="备注" autosize style={{width:'50%'}}/>
                            )}
                        </FormItem>
                        <div>
                            <SubmitButton
                                type="primary"
                                style={{marginLeft: 200, marginRight:10}}
                                onClick={() =>this.handSubmit()}>保存</SubmitButton>
                            <SubmitButton
                                type="primary"
                                style={{marginRight:10}}
                                onClick={() =>this.handSubmit('active')}>立即使用</SubmitButton>
                            <Button onClick={() => location.href = `checkerAreaIndex.html`}>返回</Button>
                        </div>
                    </div>

                </div>
            );
        }

        return null;
    }

}

AddCheckerArea = Form.create()(AddCheckerArea);
ReactDom.render(<div><AddCheckerArea></AddCheckerArea></div>, document.querySelector("#content"));
