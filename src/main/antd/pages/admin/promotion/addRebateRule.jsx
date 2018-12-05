import React,{Component} from 'react';
import ReactDom from 'react-dom';
import SADPage from '@souche-f2e/sad';
import '../../../styles/index.less';

/*
 * 这里声明要引入的组件
 */
import { Form, Icon, Input,InputNumber, Button, Table, Pagination, Select, Checkbox, Modal, DatePicker, Row, Col, Radio, Popconfirm} from 'antd';
import { RJAreaCascader,SubmitButton,RJSelect, RJMultiCarSeries} from '@souche-f2e/sad/components/RJAntd';
import { RJImgUploader } from '@souche-f2e/sad/components/RJAntd';


const {  RangePicker } = DatePicker;
const resetAreaCascader = RJAreaCascader.resetAreaCascader;

const addKey2TableData = tableData=>{
    return tableData.map(data=>{
        data.key = data.shopCode
        return data
    })
}

let flag = 0

const deleteFromFirst2Second = (ary1,ary2,field)=>{
    const collectFields = ary2.map(ary=>ary[field])
    return ary1.filter(ary=>!collectFields.includes(ary[field]))
}

const union = (ary1,ary2,field)=>{
    const collectFields = ary1.map(ary=>ary[field])
    return ary1.concat(ary2.filter(ary=>!collectFields.includes(ary[field])))
}

const FormItem = Form.Item;

const moment = require('moment');
let shopArray = [];

let uuid = 0;

/**
 * 质保返佣规则页面
 */
class AddRebateRule extends SADPage {
    constructor() {
        super();
        this.state = {
            query: {},
            status: {},
            policy: 1,
            startTime: null,
            endTime: null,
            endOpen: false,
            ruleInfo:[],
            schemePage: {
                page:1,
                pageSize:6
            },
            addSchemeVisible: false,
            addShopVisible: false,
            schemeList: {},
            list: {},
            schemeSearchInfo: {},
            defaultDiscount: 60
        }
    }

    /**
     * 切换分页
     * @param pagination
     */
    handleTableChange = (pagination) => {
        this.state.pageSize = pagination.pageSize;
        this.state.page = pagination.current;
        this.getShopByFilter();
    }

    /**
     * 车商搜索查询
     */
    handleShopSearch = () => {
        let query = this.props.form.getFieldsValue();
        this.state.query.shopName = query.shopName;
        this.state.pageSize = 10;
        this.state.page = 1;
        this.getShopByFilter().then(data => {
            if (data.success) {
                return;
            }
        });
    }

    /**
     * 提交
     */
    handSubmit = (status) => {

        this.props.form.validateFieldsAndScroll((errors, values) => {
            console.log(errors);
            console.log(this.state.shops);
            if (!!errors) {
                return;
            }

            this.state.query = this.props.form.getFieldsValue();
            if(!moment.isMoment(this.state.startTime)){
                this.state.startTime=moment(this.state.startTime);
            }
            if(!moment.isMoment(this.state.endTime)){
                this.state.endTime=moment(this.state.endTime);
            }

            let _startTime=this.state.startTime.format('YYYY-MM-DD');
            if(moment(_startTime).isBefore(moment(moment().format('YYYY-MM-DD')))){
                Modal.error({
                    title: '错误',
                    content: '有效期开始时间不能小于当前时间',
                });
                return;
            }
            this.state.query.startTime = this.state.startTime.format('YYYY-MM-DD');
            // this.state.query.endTime = this.state.endTime.format('YYYY-MM-DD')

            this.state.query.endTime = this.state.endTime;

            if(this.state.query.ruleInfo == null || this.state.query.ruleInfo.length == 0) {
                Modal.error({
                    title: '错误',
                    content: '请添加返佣规则',
                });
                return;
            }
            let ruleInfos = this.state.query.ruleInfo;
            let ruleInfoFlag = true;
            if(ruleInfos != null) {
                ruleInfos.map(item => {
                    if(item.min>=item.max){
                        Modal.error({
                            title: '错误',
                            content: '销售金额或订单数量上限值不能小于下限值',
                        });
                        ruleInfoFlag=false;
                        return false;
                    }
                })
                if(!ruleInfoFlag){
                    return;
                }
            }


            if(this.state.query.shopType == '1' && (this.state.shops == null || this.state.shops.length == 0)){
                Modal.error({
                    title: '错误',
                    content: '请添加店铺',
                });
                return false;
            }
            if(this.state.query.schemeType == '1' && (this.state.schemes == null || this.state.schemes.length == 0)){
                Modal.error({
                    title: '错误',
                    content: '请添加方案',
                });
                return false;
            }
            if(this.state.query.carType == '1') {
                if(this.state.selectedCar == null || this.state.selectedCar.length == 0) {
                    Modal.error({
                        title: '错误',
                        content: '请添加品牌车型',
                    });
                    return false;
                }else {
                    if(this.state.selectedCar[0].length == 0 && this.state.selectedCar[1].length == 0
                        && this.state.selectedCar[2].length == 0) {
                        Modal.error({
                            title: '错误',
                            content: '请添加品牌车型',
                        });
                        return false;
                    }
                }
                let cars = new Array();
                this.state.selectedCar.map((carArray, index) => {
                    carArray.map(car => {
                        let carInfo = {};
                        if(index == 0) {
                            // 精确到品牌
                            carInfo.brandCode = car.code;
                            carInfo.brandName = car.label;
                            cars.push(carInfo);
                        }else if(index == 1) {
                            // 精确到车系
                            carInfo.seriesCode = car.code;
                            carInfo.seriesName = car.label;
                            carInfo.brandCode = car.parent.value;
                            carInfo.brandName = car.parent.title;
                            cars.push(carInfo);
                        }else if(index == 2) {
                            // 精确到车型
                            carInfo.modelCode = car.code;
                            carInfo.modelName = car.label;
                            carInfo.seriesCode = car.parent.value;
                            carInfo.seriesName = car.parent.title;
                            carInfo.brandCode = car.parent.parent.value;
                            carInfo.brandName = car.parent.parent.title;
                            cars.push(carInfo);
                        }
                        console.log(car);
                        console.log(index);
                    });
                });
                this.state.query.cars = cars;
            }

            this.state.query.status= status;
            this.state.query.shops = this.state.shops;
            if(this.state.schemes != null && this.state.schemes.length > 0) {
                let schemeIdArray = new Array();
                this.state.schemes.map(scheme => {
                    schemeIdArray.push({'schemeId': scheme.id});
                });
                this.state.query.schemes = schemeIdArray;
            }

            this.addQaRebateActivity().then(data => {
                console.log(data);
                if (data.success) {
                    alert(this.state.msg);
                    location.href = `rebateRuleIndex.html`;
                    return;
                }
            });

        })

    }

    /**
     * 清除查询条件
     */
    handleReset = () => {
        this.props.form.resetFields();
        this.setState({query: {}});
        resetAreaCascader();
    }

    onPolicyChange = (e) => {
        console.log(e);
        const { form } = this.props;
        this.setState({
            policy: e.target.value,
        });
        let hisRuleInfo = form.getFieldValue('ruleInfo');
        let keys = form.getFieldValue('keys');
        if(hisRuleInfo && hisRuleInfo.length > 0) {
            form.setFieldsValue({
                ruleInfo: [],
                keys: []
            });
        }
        uuid = 0;
        if(e.target.value == 1) {

        }else {
            // form.resetFields(new Array('keys'))
        }
    }

    addRebateRate = () => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(uuid);
        uuid++;

        let ruleInfo=null;
        console.log(this.state.ruleInfo);
        if(this.state.ruleInfo.length==0){
            ruleInfo={
                min:1,
                max:2,
                discount:''
            };
            //添加一个元素
            this.state.ruleInfo.push(ruleInfo);
        }else{
            let ruleInfoLength=this.state.ruleInfo.length;
            let prevmin=this.state.ruleInfo[ruleInfoLength-1].max+1;
            let max=prevmin+1;

            ruleInfo= {
                min:prevmin,
                max:max,
                discount:''
            };
            //添加一个元素
            this.state.ruleInfo.push(ruleInfo);
        }

        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys,
        });

    }

    remove = (k) => {
        const {form} = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');

        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
        //删除最后一个元素

        this.state.ruleInfo.pop();
    }

    onChangeCover = (images) => {
        this.state.query.iconUrl = images;
    }

    // onTableSelectChange = (selectedRowKeys) => {
    //
    //     this.setState({selectedRowKeys});
    // }

    //----时间选择框
    onDateChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    }

    onDateStartChange = (value) => {
        this.onDateChange('startTime', value);
    }

    onendTimeChange = (value) => {
        console.log(value.valueOf());
        value = value.endOf('day');
        console.log(value.valueOf());
        this.onDateChange('endTime', value);
    }

    disabledStartDate = (startTime) => {
        const endTime = this.state.endTime;
        if (!startTime || !endTime) {
            return false;
        }
        return startTime.valueOf() > endTime.valueOf();
    }

    disabledEndDate = (endTime) => {
        const startTime = this.state.startTime;
        if (!endTime || !startTime) {
            return false;
        }
        return endTime.valueOf() <= startTime.valueOf();
    }

    handleStartOpenChange = (open) => {
        if (!open) {
            this.setState({ endOpen: true });
        }
    }

    handleEndOpenChange = (open) => {
        this.setState({ endOpen: open });
    }

    //----时间选择框 end

    minChange1 =(value,index)=>{
        if(index==0){
            this.state.ruleInfo[index].min=value;
            if(this.state.ruleInfo[index].max < value){
                this.state.ruleInfo[index].max=value+1;
            }
        }
    }

    maxChange1 =(value,index)=>{
        this.state.ruleInfo[index].max=value;
        if(this.state.ruleInfo.length-1>index){
            this.state.ruleInfo[index+1].min=value+1;
        }
        const { form } = this.props;
        const ruleInfoArray = form.getFieldValue('ruleInfo');
        form.setFieldsValue({
            ruleInfo: this.state.ruleInfo
        });
    }

    addScheme = () => {
        this.state.addSchemeVisible = true;
        this.getSchemeByFilter();
    }

    handleSchemeCancel = () => {
        this.setState({
            addSchemeVisible: false,
        });
    }

    handleSchemeOk = () => {
        this.setState({
            addSchemeVisible: false
        });
    }

    convertToSchemeShow = (record) => {
        return `${record.qaName}${record.productName}${record.expiresYear}年期(${record.engineVolumeDown}-${record.engineVolumeUp}L)`;
    }

    addShop = () => {
        this.state.addShopVisible = true;
        this.getShopByFilter();
    }

    handleShopCancel = () => {
        this.setState({
            addShopVisible: false,
        });
    }

    handleShopOk = () => {
        this.setState({
            addShopVisible: false
        });
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

    handleSchemeSubmit = () => {
        this.state.schemeSearchInfo.productName = this.props.form.getFieldsValue().productName;
        this.state.schemeSearchInfo.qaName = this.props.form.getFieldsValue().qaName;
        this.state.schemeSearchInfo.expiresYear = this.props.form.getFieldsValue().expiresYear;
        this.state.schemePage.pageSize = 6;
        this.state.schemePage.page = 1;
        this.getSchemeByFilter().then(data => {
            if (data.success) {
                return;
            }
        });
    }

    onChangeCar = (value, label, extra) => {
        console.log(value);
        console.log(label);
        console.log(extra);
        this.state.selectedCar = extra;
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
        let that = this;
        if (this.state.list) {
            pagination = {
                size: 'small',
                total: this.state.list.totalNumber,
                current: this.state.list.currentIndex,
                pageSize: this.state.list.pageSize,
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

        const schemeRowSelection = {
            onSelect(record, selected, selectedRows) {
                let preSchemes = that.state.schemes || [];

                if(selected){
                    preSchemes.push(record);
                }else{
                    preSchemes = preSchemes.filter(scheme => scheme.id!==record.id);
                }

                that.setState({
                    schemes : preSchemes
                });
            },
            onSelectAll(selected, selectedRows, changeRows) {
                let preSchemes = that.state.schemes || [];
                // debugger
                if(selected){
                    //求并集
                    preSchemes = union(preSchemes,selectedRows,'id');
                    // preShops = [...preShops,...selectedRows]
                }else{
                    preSchemes = deleteFromFirst2Second(preSchemes,changeRows,'id');
                }
                that.setState({
                    schemes : preSchemes
                });
            },
        };

        const rowSelection = {
            onSelect(record, selected, selectedRows) {
                let preShops = that.state.shops || [];

                if(selected){
                    preShops.push(record);
                }else{
                    preShops = preShops.filter(shop=>shop.shopCode!==record.shopCode);
                }

                that.setState({
                    shops : preShops
                });
            },
            onSelectAll(selected, selectedRows, changeRows) {
                let preShops = that.state.shops || [];
                // debugger
                if(selected){
                    //求并集
                    preShops = union(preShops,selectedRows,'shopCode');
                    // preShops = [...preShops,...selectedRows]
                }else{
                    preShops = deleteFromFirst2Second(preShops,changeRows,'shopCode');
                }
                that.setState({
                    shops : preShops
                });
            },
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
                title: '城市',
                dataIndex: 'cityName',
                key: 'cityName'
            }
        ];

        /**
         * 搜索框组件
         */
        let resetBtn = <Button onClick={this.handleReset}>清除</Button>;
        let imgUploadUrl = `${this.baseUri}/api/CommonApi/uploadNew.json`;
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

        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 20, offset: 4 },
            }
        };

        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');

        const validatorRate = obj=>{
            if(obj===undefined) return true
            const lastObj = obj[obj.length-1]
            return lastObj.min!==''&&
                lastObj.min!==undefined&&
                lastObj.max!==''&&
                lastObj.max !==undefined&&
                lastObj.discount!==''&&
                lastObj.discount !==undefined
        }

        const validateRuleInfo = (objs, keys) => {
            console.log('enter validate');
            console.log(objs);
            console.log(keys);
            if(objs === undefined) return true;
            for(var i = 0; i < keys.length; i++) {
                let obj = objs[i];
                if(obj.min == null || obj.max == null || obj.discount == null) {
                    return false;
                }
            }
            return true;
        };

        const limitInteger = (value) => {
            const reg = /^(\-)*(\d+).*$/;
            // console.log(value);
            if(typeof value === 'string') {
                return !isNaN(Number(value)) ? value.replace(reg, '$2') : '';
            } else if (typeof value === 'number') {
                return !isNaN(value) ? String(value).replace(reg, '$2') : '';
            } else {
                return '';
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
                    console.log(record);
                    return <div>{this.convertToSchemeShow(record)}</div>;
                }
            }
        ];

        const addSchemeDialog = (
            <Modal title="选择质保方案"
                   width={600}
                   visible={this.state.addSchemeVisible}
                   onOk={this.handleSchemeOk}
                   onCancel={this.handleSchemeCancel}
                   footer={[]}>
                <Form layout="inline">
                    <FormItem label="产品类型">
                        {
                            getFieldDecorator('qaName', {
                                initialValue: ''
                            })(
                                <Select style={{width:100}}>
                                    <Option value="">全部</Option>
                                    <Option value="省心保">省心保</Option>
                                    <Option value="基础保">基础保</Option>
                                    <Option value="养车保">养车保</Option>
                                </Select>
                            )
                        }
                    </FormItem>
                    <FormItem label="年限">
                        {
                            getFieldDecorator('expiresYear', {
                                initialValue: ''
                            })(
                                <Select>
                                    <Option value="">全部</Option>
                                    <Option value="1">1年</Option>
                                    <Option value="2">2年</Option>
                                    <Option value="3">3年</Option>
                                </Select>
                            )
                        }
                    </FormItem>
                    <FormItem label="方案名称">
                        {
                            getFieldDecorator('productName')(
                                <Input style={{ width: 100}} placeholder={'请输入方案名称'}/>
                            )
                        }
                    </FormItem>
                    <Button type="primary" onClick={this.handleSchemeSubmit}>搜索</Button>
                    <br/>
                    <div className="table-content">
                        <Table columns={schemeColumn} dataSource={this.state.schemeList.items}
                               pagination={paginationScheme}
                               onChange={this.handleSchemeTableChange}
                               rowSelection={schemeRowSelection}
                               rowKey={'id'}
                               bordered/>
                    </div>
                </Form>
            </Modal>);

        const addShopDialog = (
            <Modal title="选择车商"
                   width={700}
                   visible={this.state.addShopVisible}
                   onOk={this.handleShopOk}
                   onCancel={this.handleShopCancel}
                   footer={[]}>
                <Form layout="inline">
                    <span>
                        <FormItem {...formItemLayout} label="车商名称">
                        {
                            getFieldDecorator('shopName')(
                                <Input placeholder="请输入车商名称" style={{marginLeft: 8}}/>
                            )
                        }
                    </FormItem>
                        <FormItem style={{marginLeft: 30}} label="省市">
                            <RJAreaCascader allowClear={true} showSearch={true} cascaderLevel={2}
                                            onProvinceChange={(v) => {
                                                this.state.query.provinceCode=v.key
                                            }}
                                            onCityChange={(v) => {
                                                this.state.query.cityCode=v.key
                                            }}/>
                        </FormItem>
                        <Button type="primary" onClick={this.handleShopSearch}>搜索</Button>
                    </span>
                    <div className="table-content">
                        <Table columns={columns} dataSource={this.state.list.items} rowKey='shopCode'  pagination={pagination}
                               onChange={this.handleTableChange}
                               rowSelection={rowSelection}
                               bordered/>
                    </div>
                </Form>
            </Modal>);

        const formItems = keys.map((k, index) => {
            // console.log(keys);
            // console.log(k);
            // console.log(index);
            // console.log(getFieldValue('ruleInfo'));
            if(this.state.policy == 0) {
                return (
                    <Row>
                        <Col span={24}>
                            <table style={{width:'80%',border:0,textAlign:'center', marginLeft: '20%'}}>
                                <tr>
                                    <td style={{width:'25%'}}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="订单数下限"
                                            required={false}
                                            key={k}
                                        >
                                            {
                                                getFieldDecorator(`ruleInfo[${index}].min`, {
                                                    initialValue:keys[0] == k ? 1 : (+getFieldValue(`ruleInfo[${keys[index - 1]}].max`) + 1),
                                                    rules: [{
                                                        required: true,
                                                        message: '订单数下限必填',

                                                    }],
                                                })(
                                                    <InputNumber
                                                        // onChange={(value)=>{this.minChange1(value,index)}}
                                                        //          min={index>0?+getFieldValue(`ruleInfo[${keys[index-1]}].max`)+1:0}
                                                                 min={1}
                                                                 disabled={index>0} precision={0} step={1}
                                                                 style={{width:'100%'}} placeholder="订单数下限" formatter={limitInteger}
                                                                 parser={limitInteger}/>
                                                )
                                            }
                                        </FormItem>
                                    </td>
                                    <td style={{width:'25%'}}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="订单数上限"
                                            required={false}
                                            key={k}
                                        >
                                            {getFieldDecorator(`ruleInfo[${index}].max`, {
                                                initialValue: null,
                                                rules: [{
                                                    required: true,
                                                    message: "订单数上限必填",
                                                }],
                                            })(
                                                <InputNumber
                                                    min={keys[0] == k ? 1 : (+getFieldValue(`ruleInfo[${keys[index - 1]}].max`) + 2)}
                                                    // onChange={(value)=>{this.maxChange1(value,index)}}
                                                    style={{width:'100%'}} precision={0} step={1}
                                                    placeholder="订单数上限" formatter={limitInteger}
                                                    parser={limitInteger}/>
                                            )}
                                        </FormItem>
                                    </td>
                                    <td style={{width:'25%'}}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="打折比例%"
                                            required={false}
                                            key={k}
                                        >
                                            {getFieldDecorator(`ruleInfo[${index}].discount`,{
                                                initialValue: null,
                                                rules: [{
                                                    required: true,
                                                    message: '打折比例必填',
                                                }]
                                            })(
                                                <InputNumber style={{width:'100%'}} precision={0} min={1} max={this.state.defaultDiscount} step={1}  placeholder="打折比例 %"  formatter={limitInteger}
                                                             parser={limitInteger}/>
                                            )}

                                        </FormItem>
                                    </td>
                                    <td style={{width:'25%'}}>
                                        <FormItem
                                            {...formItemLayoutWithOutLabel}>
                                        {keys.length > 0 && index===keys.length-1? (
                                            <Icon
                                                className="dynamic-delete-button"
                                                type="minus-circle-o"
                                                onClick={() => this.remove(k)}
                                            />
                                        ) : null}
                                        </FormItem>
                                    </td>
                                </tr>
                            </table>
                        </Col>
                    </Row>
                );
            }else {
                return (
                    <Row>
                        <Col span={24}>
                            <table style={{width:'80%',border:0,textAlign:'center', marginLeft: '20%'}}>
                                <tr>
                                    <td style={{width:'15%'}}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="金额下限(元)"
                                            required={false}
                                            key={k}
                                        >
                                            {
                                                getFieldDecorator(`ruleInfo[${index}].min`, {
                                                    initialValue:keys[0] == k ? 1 : (+getFieldValue(`ruleInfo[${keys[index - 1]}].max`) + 1),
                                                    rules: [{
                                                        required: true,
                                                        message: '金额下限必填',
                                                    }],
                                                })(
                                                    <InputNumber style={{width:'100%'}}
                                                                 // onChange={(value)=>{this.minChange1(value,index)}}
                                                                 disabled={index>0} precision={0} min={1} step={1}
                                                                 // min={index>0?+getFieldValue(`ruleInfo[${keys[index-1]}].max`)+1:0}
                                                                 placeholder="金额下限" formatter={limitInteger}
                                                                 parser={limitInteger}/>
                                                )
                                            }
                                        </FormItem>
                                    </td>
                                    <td style={{width:'15%'}}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="金额上限(元)"
                                            required={false}
                                            key={k}
                                        >
                                            {getFieldDecorator(`ruleInfo[${index}].max`, {
                                                // validateTrigger: ['onChange', 'onBlur'],
                                                initialValue: null,
                                                rules: [{
                                                    required: true,
                                                    message: "金额上限必填",
                                                }],
                                            })(
                                                <InputNumber style={{width:'100%'}}
                                                             // onChange={(value)=>{this.maxChange1(value,index)}}
                                                             min={keys[0] == k ? 1 : (+getFieldValue(`ruleInfo[${keys[index - 1]}].max`) + 2)}
                                                             precision={0} step={1}
                                                             // disabled={getFieldValue(`ruleInfo[${k}].min`)==='' || getFieldValue(`ruleInfo[${k}].min`)===undefined}
                                                             placeholder="金额上限"
                                                             formatter={limitInteger}
                                                             parser={limitInteger}/>
                                            )}
                                        </FormItem>
                                    </td>
                                    <td style={{width:'15%'}}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="返佣金额(元)"
                                            required={false}
                                            key={k}
                                        >
                                            {getFieldDecorator(`ruleInfo[${index}].discount`,{
                                                initialValue: null,
                                                rules: [{
                                                    required: true,
                                                    message: '返佣金额必填',
                                                }]
                                            })(
                                                <InputNumber style={{width:'100%'}} placeholder="请输入" precision={0} min={1} step={1} formatter={limitInteger}
                                                             parser={limitInteger}/>
                                            )}
                                        </FormItem>
                                    </td>
                                    <td style={{width:'15%'}}>
                                        <FormItem
                                            {...formItemLayoutWithOutLabel}>
                                        {keys.length > 0 && index===keys.length-1 ? (
                                        <Icon
                                            className="dynamic-delete-button"
                                            type="minus-circle-o"
                                            onClick={() => this.remove(k)}
                                        />
                                    ) : null}
                                        </FormItem>
                                    </td>
                                </tr>
                            </table>
                        </Col>
                    </Row>
                );
            }
        });

        let showSchemes = (
            <div className="table-content" style={{width:'60%'}}>
                <Table columns={schemeColumn} dataSource={this.state.schemes} rowKey='id'
                    // onChange={this.hanldeTableChange}
                    // rowSelection={rowSelection}
                       bordered
                />
            </div>
        );

        let showShops = (
            <div className="table-content" style={{width:'60%'}}>
                <Table columns={columns} dataSource={this.state.shops} rowKey='shopCode'
                       // onChange={this.hanldeTableChange}
                       // rowSelection={rowSelection}
                       bordered
                       />
            </div>
        );

        let showContent = (
                <Form>
                    <Row>
                        <Col span={24} key='salesName'>
                            <FormItem {...formItemLayout} label="活动名称">
                                        {
                                            getFieldDecorator('name', {
                                                rules: [{
                                                    required: true, message: '请输入活动名称(50字以内)',
                                                    max: 50
                                                }]
                                            })(
                                                <Input style={{ width: 300}} placeholder="请输入50字以内"/>
                                            )
                                        }
                             </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} key="desc">
                            <FormItem {...formItemLayout} label="活动描述">
                                {
                                    getFieldDecorator('description')(
                                        <Input type='textarea' style={{ width: 300, height: 160}} placeholder="请输入"/>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} key="iconUrl">
                            <FormItem {...formItemLayout} label="图标">
                                {
                                    getFieldDecorator('iconUrl', {
                                        // initialValue:this.state.defaultValue,
                                        rules: [{
                                            required: true, message: '请上传图标',
                                        }]
                                    })(
                                        <RJImgUploader
                                            action={imgUploadUrl}
                                            defaultValue={this.state.defaultValue}
                                            num={1}
                                            onRemove={
                                                ({file, updatedDefaultValues}) => {this.setState({ defaultValue: updatedDefaultValues })}
                                            }
                                            onChange = {this.onChangeCover}
                                            >
                                        </RJImgUploader>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} key="startTime">
                            <FormItem {...formItemLayout} label="有效期开始时间">
                                {getFieldDecorator('startTime',{
                                    rules: [{
                                        required: true, message: '有效期开始时间'
                                    }]
                                })(
                                    <DatePicker
                                        disabledDate={this.disabledStartDate}
                                        format="YYYY-MM-DD"
                                        value={this.state.startTime}
                                        placeholder="开始时间"
                                        onChange={this.onDateStartChange}
                                        onOpenChange={this.handleStartOpenChange}
                                    />
                                )}
                            </FormItem>

                            <FormItem {...formItemLayout} label="有效期结束时间">
                                {getFieldDecorator('endTime',{
                                    rules: [{
                                        required: true, message: '有效期结束时间'
                                    }]
                                })(
                                    <DatePicker
                                        disabledDate={this.disabledEndDate}
                                        format="YYYY-MM-DD"
                                        value={this.state.endTime}
                                        placeholder="结束时间"
                                        onChange={this.onendTimeChange}
                                        open={this.state.endOpen}
                                        onOpenChange={this.handleEndOpenChange}
                                    />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} key="type">
                            <FormItem {...formItemLayout} label="政策规则" >
                                {
                                    getFieldDecorator('type',{
                                        initialValue:this.state.policy,
                                        rules: [{
                                            required: true, message: '政策规则必填',
                                        }]
                                    })(
                                        <Radio.Group onChange={this.onPolicyChange} >
                                            <Radio value={0}>满单折</Radio>
                                            <Radio value={1}>满额返</Radio>
                                        </Radio.Group>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    {formItems}
                    <Row>
                        <Col span={24} key="dashed">
                            <FormItem {...formItemLayout} label="添加返佣规则">
                                <Button type="dashed"
                                        onClick={this.addRebateRate}
                                        disabled={!validateRuleInfo(getFieldValue('ruleInfo'), keys)}
                                        style={{width:'30%'}}>
                                    <Icon type="plus" />
                                </Button>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem {...formItemLayout} label="质保方案" >
                                {
                                    getFieldDecorator('schemeType',{
                                        initialValue: '0',
                                        rules: [{
                                            required: true, message: '质保方案必填',
                                        }]
                                    })(
                                        <Radio.Group>
                                            <Radio value={'0'}>全部质保方案</Radio>
                                            <Radio value={'1'}>部分质保方案</Radio>
                                        </Radio.Group>
                                    )
                                }
                                {getFieldValue('schemeType') == '1' ?
                                    (<Button type="primary" onClick={this.addScheme}>添加方案</Button>) :
                                    null
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row style={getFieldValue('schemeType') == '0' ? {display: 'block'} : {display: 'none'}}>
                        <Col span={24}>
                            <FormItem {...formItemLayout} label="已选方案">
                                全部质保方案
                            </FormItem>
                        </Col>
                    </Row>
                    <Row style={getFieldValue('schemeType') == '1' ? {display: 'block'} : {display: 'none'}}>
                        <Col span={24}>
                            <FormItem {...formItemLayout} label="已选方案">
                                {showSchemes}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem {...formItemLayout} label="品牌车型" >
                                {
                                    getFieldDecorator('carType',{
                                        initialValue: '0',
                                        rules: [{
                                            required: true, message: '品牌车型必填',
                                        }]
                                    })(
                                        <Radio.Group>
                                            <Radio value={'0'}>全部品牌车型</Radio>
                                            <Radio value={'1'}>部分品牌车型</Radio>
                                        </Radio.Group>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row style={getFieldValue('carType') == '0' ? {display: 'block'} : {display: 'none'}}>
                        <Col span={24}>
                            <FormItem {...formItemLayout} label="已选品牌车型">
                                全部品牌车型
                            </FormItem>
                        </Col>
                    </Row>
                    <Row style={getFieldValue('carType') == '1' ? {display: 'block'} : {display: 'none'}}>
                        <Col span={24}>
                            <FormItem {...formItemLayout} label="已选品牌车型">
                                <RJMultiCarSeries level={3} style={{width: 500}}
                                                  vehicleRange={['SOUCHE','CH168']}
                                                  onChange = {this.onChangeCar}
                                                  dropdownMatchSelectWidth={false} dropDownStyle={{height: 300, width: 600}}/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem {...formItemLayout} label="车商" >
                                {
                                    getFieldDecorator('shopType',{
                                        initialValue: '0',
                                        rules: [{
                                            required: true, message: '车商必填',
                                        }]
                                    })(
                                        <Radio.Group>
                                            <Radio value={'0'}>全部已授权车商</Radio>
                                            <Radio value={'1'}>部分已授权车商</Radio>
                                        </Radio.Group>
                                    )
                                }
                                {getFieldValue('shopType') == '1' ?
                                    (<Button type="primary" onClick={this.addShop}>添加车商</Button>) :
                                    null
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row style={getFieldValue('shopType') == '0' ? {display: 'block'} : {display: 'none'}}>
                        <Col span={24}>
                            <FormItem {...formItemLayout} label="已选车商">
                                全部已授权车商
                            </FormItem>
                        </Col>
                    </Row>
                    <Row style={getFieldValue('shopType') == '1' ? {display: 'block'} : {display: 'none'}}>
                        <Col span={24}>
                            <FormItem {...formItemLayout} label="已选车商">
                                {showShops}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
        );

        if (this.stateAlready) {
            return (
                <div>
                    <h1>新建活动</h1>
                    <br/><br/>
                    {showContent}
                    {addSchemeDialog}
                    {addShopDialog}
                    {/*<Form layout="inline" style={{"padding":"20px"}}>*/}
                        {/*{imgUploadBtn}*/}
                    {/*</Form>*/}
                    <div>
                        <div>
                            <Popconfirm title="确定吗?" onConfirm={() => this.handSubmit('1')}><Button
                                type="primary"
                                style={{marginLeft: 500, marginRight:10}}>上架</Button></Popconfirm>
                            <Button onClick={() => this.handSubmit('0')}>保存</Button>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    }

}


AddRebateRule = Form.create()(AddRebateRule);
ReactDom.render(<div><AddRebateRule></AddRebateRule></div>, document.querySelector("#content"));
