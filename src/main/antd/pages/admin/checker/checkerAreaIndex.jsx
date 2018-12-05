import React from 'react';
import ReactDom from 'react-dom';
import SADPage from '@souche-f2e/sad';
import '../../../styles/index.less';
import { containsResource } from '../../utils/utils';

/**
 * 这里声明要引入的组件
 */
import { Form, Input, Button, Table, Select, Popconfirm} from 'antd';
import { RJAreaCascader } from '@souche-f2e/sad/components/RJAntd';

const FormItem = Form.Item;
const { Option } = Select;

/**
 * 质保查定员管辖地理位置页面
 */
class CheckerAreaIndex extends SADPage {
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
        this.getList();
    }

    /**
     * 搜索查询
     */
    handSubmit = () => {
        this.state.query = this.props.form.getFieldsValue();
        this.getList().then(data => {
            if (data.success) {
                return;
            }
        });
    }

    /**
     * 上架
     */
    handOnShelf = (checkerId) => {
        this.state.checkerId = checkerId;
        this.state.actionType = 1;
        this.onOffShelfChecker().then(data => {
            this.getList();
        });
    }

    /**
     * 下架
     */
    handOffShelf = (checkerId) => {
        this.state.checkerId = checkerId;
        this.state.actionType = 2;
        this.onOffShelfChecker().then(data => {
            this.getList();
        });
    }

    /**
     * 清除查询条件
     */
    handleReset = () => {
        this.props.form.resetFields();
        this.setState({query: {}});
    }

    // 数据筛选
    handleProvinceChange = (value) => {
        this.state.province = value.label;
    }
    handleCityChange = (value) => {
        this.state.city = value.label;
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

        const columns = [
            {
                title: '查定员',
                dataIndex: 'checkerName',
                key: 'checkerName'
            },
            {
                title: '管理省市',
                dataIndex: 'areaList',
                key: 'areaList',
                width: 550,
                render: (text, record) => {
                    let areaStr = '';
                    if(record.areaList && record.areaList.length > 0){
                        for(var i =0; i<record.areaList.length; i++){
                            areaStr += record.areaList[i].province + ',' + record.areaList[i].city + '；';
                        }
                    }
                    return areaStr;
                }
            },
            {
                title: '备注',
                dataIndex: 'remarks',
                width: 200,
                key: 'remarks'
            },
            {
                title: '创建时间',
                dataIndex: 'dateCreate',
                key: 'dateCreate'
            },
            {
                title: '状态',
                render: (text, record) => {
                    if(record.checkerOpenStatus =='1'){
                        return <span>已上架</span>
                    }else{
                        return <span>已下架</span>
                    }
                }
            },
            {
                title: '操作',
                dataIndex: 'option',
                width: 100,
                key: 'option',
                render: (text, record) => {
                    let editBtn = <a onClick={() => location.href = `editCheckerArea.html?checkerId=${record.checkerId}&checkerName=${record.checkerName}`}>修改</a>;
                    let onShelfBtn = <Popconfirm title="确定上架吗?" onConfirm={() => this.handOnShelf(record.checkerId)}><a>上架</a></Popconfirm>
                    let offShelfBtn = <Popconfirm title="确定上架吗?" onConfirm={() => this.handOffShelf(record.checkerId)}><a>下架</a></Popconfirm>
                    let option = null;
                    if (record.checkerOpenStatus != '1') {
                        option = (<div>{containsResource('DSC_ZHIBAO_CHECKER_EDIT')?editBtn:''} {containsResource('DSC_ZHIBAO_CHECKER_ONOFFSHELF')?onShelfBtn:''} </div>);
                    } else {
                        option = (<div>{containsResource('DSC_ZHIBAO_CHECKER_EDIT')?editBtn:''} {containsResource('DSC_ZHIBAO_CHECKER_ONOFFSHELF')?offShelfBtn:''} </div>);
                    }

                    return (<div>{option}</div>)

                    return (
                        <div>{option}</div>
                    )
                }
            }]

        /**
         * 搜索框组件
         */
        let submitBtn = <Button type="primary" onClick={this.handSubmit}>搜索</Button>;
        let resetBtn = <Button onClick={this.handleReset}>清除</Button>;
        let addBtn = <Button type="primary" size="large">
                        <a target="_blank" href="/admin/checker/addCheckerArea.html">新建</a>
                    </Button>;

        let firstSearchView = (
            <span>
                <FormItem label="查定员">
                            {
                                getFieldDecorator('checkerName', {
                                })(
                                    <Input  style={{ width: 200}} placeholder="请输入"/>
                                )
                            }
                 </FormItem>
                 <FormItem label="状态">
                            {
                                getFieldDecorator('checkerAreaOpenStatus', {
                                })(
                                    <Select placeholder="全部" style={{ width: 200 }}>
                                        <Option value="0">全部</Option>
                                        <Option value="1">已上架</Option>
                                        <Option value="2">已下架</Option>
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
                     {containsResource('DSC_ZHIBAO_CHECKER_ADD') ? addBtn : ''}
                 </FormItem>
            </span>

        );


        if (this.stateAlready) {
            return (
                <div>
                    <h1>质保-查定员地理位置管理</h1>
                    <br/><br/>
                    <Form layout="inline">
                        {firstSearchView}
                    </Form>
                    <div>
                        <div>
                            <Table columns={columns} dataSource={this.state.list.items} rowKey="checkerId" pagination={pagination}
                                   onChange={this.hanldeTableChange}
                                   bordered/>
                        </div>
                    </div>
                </div>
            );
        }

        return null;
    }

}


CheckerAreaIndex = Form.create()(CheckerAreaIndex);
ReactDom.render(<div><CheckerAreaIndex></CheckerAreaIndex></div>, document.querySelector("#content"));
