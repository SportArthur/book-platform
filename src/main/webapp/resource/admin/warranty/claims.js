webpackJsonp([1],{29:function(e,t,a){"use strict";function n(e){if(void 0===e)return"-";switch(e){case 0:return"已预定";case 1:return"已服务";case 2:return"已关闭";default:return"-"}}function i(e){if(void 0===e)return"-";switch(e){case 0:return"未授权";case 1:return"已授权";case 2:return"已取消";default:return"-"}}function r(e,t){var a="YYYY年MM月DD日";return void 0===e?"-":(void 0!==t&&(a=t),l(e).format(a))}function s(e,t){return void 0===e||void 0===t?"-":(t-e)/1e3}Object.defineProperty(t,"__esModule",{value:!0}),t.convertOrderStatus=n,t.convertAuthStatus=i,t.formatTime=r,t.convertExtTableMileage=s;var l=a(13)},583:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}var i=a(4),r=n(i),s=a(14),l=n(s),o=a(1),d=n(o),u=a(3),c=n(u),f=a(2),m=n(f),p=a(0),h=n(p),v=a(9),g=n(v),y=a(26),O=n(y);a(27);var C=a(11),b=a(22),I=a(64),w=n(I),V=C.Form.Item,M=(C.Modal.confirm,C.Select.Option,C.Select.OptGroup,C.DatePicker.MonthPicker,C.DatePicker.RangePicker,a(13)),S=0,k=!0,U=(0,l.default)(C.Radio,{value:"0"},void 0,"是"),R=(0,l.default)(C.Radio,{value:"1"},void 0,"否"),E=(0,l.default)(C.DatePicker,{}),L=(0,l.default)("br",{}),P=(0,l.default)(C.Radio.Group,{},void 0,(0,l.default)(C.Radio,{value:"1"},void 0,"正常理赔"),(0,l.default)(C.Radio,{value:"3"},void 0,"免赔"),(0,l.default)(C.Radio,{value:"2"},void 0,"拒赔")),D=(0,l.default)(C.DatePicker,{}),N=(0,l.default)("label",{},void 0,"联系人:"),T=(0,l.default)(C.Input,{disabled:!0}),A=(0,l.default)("label",{},void 0,"联系电话:"),x=(0,l.default)(C.Input,{disabled:!0}),F=(0,l.default)("label",{},void 0,"联系地址:"),z=(0,l.default)(C.Input,{disabled:!0}),Y=(0,l.default)(C.Icon,{type:"plus"}),_=function(e){function t(){(0,d.default)(this,t);var a=(0,c.default)(this,e.call(this));return a.hanldeTableChange=function(e){a.state.pageSize=e.pageSize,a.state.page=e.current,a.getList(a.props)},a.handleMaintenanceTableChange=function(e){a.state.maintenance.pageSize=e.pageSize,a.state.maintenance.page=e.current,a.getMaintenanceByFilter()},a.onPolicyChange=function(e){a.props.form},a.addComponent=function(){var e=a.props.form,t=e.getFieldValue("keys");a.state.list.warrantyVO.carComponentVOs.length>0&&(S+=a.state.list.warrantyVO.carComponentVOs.length);var n=t.concat(S);S++,e.setFieldsValue({keys:n})},a.remove=function(e){var t=a.props.form,n=t.getFieldValue("keys"),i=t.getFieldValue("carComponentVOs");i[e].price=void 0,i[e].auditPrice=void 0,t.setFieldsValue({keys:n.filter(function(t){return t!==e}),carComponentVOs:i})},a.chooseMaintenance=function(){a.state.chooseMaintenanceVisible=!0,a.getMaintenanceByFilter()},a.handleOk=function(){a.setState({chooseMaintenanceVisible:!1}),a.props.form.setFieldsValue({maintenanceName:a.state.selectedMaintenance.name,maintenanceContacts:a.state.selectedMaintenance.contacts,maintenanceContactPhone:a.state.selectedMaintenance.contactPhone,maintenanceAddress:a.state.selectedMaintenance.address})},a.handleConfirmOk=function(){a.setState({confirmDialogVisible:!1,confirmMsg:""}),a.state.ignoreWarn=!0,a.schemeFinish().then(function(e){e.success&&(location.href="repairOrderManage.html")})},a.handleCancel=function(){a.setState({chooseMaintenanceVisible:!1})},a.handleConfirmCancel=function(){a.setState({confirmDialogVisible:!1})},a.handSubmit=function(){a.state.maintenance.name=a.props.form.getFieldsValue().maintenanceNameSearch,a.getMaintenanceByFilter()},a.handleProvinceChange=function(e){a.state.maintenance.provinceCode=e.key},a.handleCityChange=function(e){a.state.maintenance.cityCode=e.key},a.saveOrUpdate=function(e){var t=a.props.form.getFieldsValue(),n=a.state.list.warrantyVO,i=t.repairMode,r=void 0;if(r=a.state.cover?a.state.hisCover?a.state.hisCover.concat(a.state.cover):a.state.cover:a.state.hisCover,a.state.type=e,1==i){if(a.state.saveOrUpdateInfo.picUrlList=r,a.state.saveOrUpdateInfo.id=n.id,a.state.saveOrUpdateInfo.maintenanceId=null==a.state.selectedMaintenance.id?n.maintenanceId:a.state.selectedMaintenance.id,a.state.saveOrUpdateInfo.repairMode=t.repairMode,a.state.saveOrUpdateInfo.repairSchema=t.repairSchema,a.state.saveOrUpdateInfo.breakDownList=t.components,a.state.saveOrUpdateInfo.carComponentVOs=t.carComponentVOs,a.state.saveOrUpdateInfo.insuranceActiveNow=t.isActiveImmediately,a.state.saveOrUpdateInfo.insuranceMileage=t.mileage,a.state.saveOrUpdateInfo.insuranceActiveTime=t.activeDate,a.state.saveOrUpdateInfo.componentPrice=a.state.sum,a.state.saveOrUpdateInfo.auditComponentPrice=a.state.checkSum,a.state.saveOrUpdateInfo.labourPrice=t.hourCost?t.hourCost:0,a.state.saveOrUpdateInfo.auditLabourPrice=t.checkHourCost?t.checkHourCost:0,a.state.saveOrUpdateInfo.totalPrice=a.state.sumTotal,a.state.saveOrUpdateInfo.auditTotalPrice=a.state.checkSumTotal,a.state.saveOrUpdateInfo.claimMileage=t.claimMileage,a.state.saveOrUpdateInfo.claimDate=t.claimDate,"submit"==e){var s=a.state.saveOrUpdateInfo;for(var l in s)if("insuranceMileage"!=l&&"insuranceActiveTime"!=l&&"insuranceActiveNow"!=l&&"claimMileage"!=l&&"claimDate"!=l&&(!s[l]||0===s[l].length))return alert("请填写完整信息");s.carComponentVOs.forEach(function(e){for(var t in e)if(!e[t]&&("name"===t||"auditPrice"===t||"code"===t||"count"===t||"name"===t||"price"===t))return alert("请填写完整的组件信息")})}a.state.ignoreWarn=!1,a.schemeFinish().then(function(e){e.success&&(e.msg&&"success"!=e.msg?a.setState({confirmDialogVisible:!0,confirmMsg:e.msg}):location.href="repairOrderManage.html")})}else if(2==i){if(a.state.saveOrUpdateInfo.id=n.id,a.state.saveOrUpdateInfo.repairMode=t.repairMode,a.state.saveOrUpdateInfo.repairSchema=t.repairSchema,a.state.saveOrUpdateInfo.maintenanceId=null==a.state.selectedMaintenance.id?n.maintenanceId:a.state.selectedMaintenance.id,a.state.saveOrUpdateInfo.breakDownList=t.components,a.state.saveOrUpdateInfo.picUrlList=r,a.state.saveOrUpdateInfo.carComponentVOs=t.carComponentVOs,a.state.saveOrUpdateInfo.componentPrice=a.state.sum,a.state.saveOrUpdateInfo.auditComponentPrice=a.state.checkSum,a.state.saveOrUpdateInfo.labourPrice=t.hourCost?t.hourCost:0,a.state.saveOrUpdateInfo.auditLabourPrice=t.checkHourCost?t.checkHourCost:0,a.state.saveOrUpdateInfo.totalPrice=a.state.sumTotal,a.state.saveOrUpdateInfo.auditTotalPrice=a.state.checkSumTotal,a.state.saveOrUpdateInfo.refuseReason=t.refuseReason,a.state.saveOrUpdateInfo.insuranceActiveNow=t.isActiveImmediately,a.state.saveOrUpdateInfo.insuranceMileage=t.mileage,a.state.saveOrUpdateInfo.insuranceActiveTime=t.activeDate,a.state.saveOrUpdateInfo.claimMileage=t.claimMileage,a.state.saveOrUpdateInfo.claimDate=t.claimDate,"submit"==e){var o=a.state.saveOrUpdateInfo;for(var l in o)if(!(o[l]&&0!==o[l].length||"refuseReason"!==l&&"breakDownList"!==l))return alert("请填写[拒赔原因]和[故障部位]")}a.state.ignoreWarn=!0,a.schemeFinish().then(function(e){e.success&&(location.href="repairOrderManage.html")})}else if(3==i){if(a.state.saveOrUpdateInfo.id=n.id,a.state.saveOrUpdateInfo.repairMode=t.repairMode,a.state.saveOrUpdateInfo.breakDownList=t.components,a.state.saveOrUpdateInfo.picUrlList=r,a.state.saveOrUpdateInfo.refuseReason=t.freeReason,a.state.saveOrUpdateInfo.claimMileage=t.claimMileage,a.state.saveOrUpdateInfo.claimDate=t.claimDate,"submit"===e){var d=a.state.saveOrUpdateInfo;for(var l in d)if((!d[l]||0===d[l].length)&&"picUrlList"!==l)return alert("请填写完整信息(除资料上传)")}a.freeAwarded().then(function(e){e.success&&(location.href="repairOrderManage.html")})}},a.getUrlRelativePath=function(e){return null!=e&&e.length>0&&(e=e.map(function(e){var t=e.split("//"),a=t[1].indexOf("/");return t[1].substring(a+1)})),e},a.onChangeCover=function(e){"string"==typeof e&&e.length>0&&(e=new Array(e)),e=e.length>0?a.getUrlRelativePath(e):null,a.state.cover=e},a.beforeUpload=function(e){return!0},a.state={productForAdd:{},query:{},status:{},policy:1,chooseMaintenanceVisible:!1,confirmDialogVisible:!1,confirmMsg:"",maintenance:{page:1,pageSize:6},maintenanceList:[],page:1,pageSize:10,selectedMaintenance:{},saveOrUpdateInfo:{},type:"",ignoreWarn:!1},a}return(0,m.default)(t,e),t.prototype.render=function(){var e=this,t=this.props.form,a=t.getFieldDecorator,n=t.getFieldValue,i=null;this.props._this&&this.props._this;var s=this;this.state.list&&(this.state.list.totalNumber,this.state.list.currentIndex,this.state.list.pageSize),this.state.maintenanceList&&(i={size:"small",total:this.state.maintenanceList.totalNumber,current:this.state.maintenanceList.currentIndex,pageSize:this.state.maintenanceList.pageSize,showQuickJumper:!0,pageSizeOptions:["10","20","50"],onShowSizeChange:function(e,t){},onChange:function(e,t){},showTotal:function(e){return"共"+e+"条"}});var o={type:"radio",onChange:function(e,t){},onSelect:function(e){s.state.selectedMaintenance=e}},d=this.baseUri+"/api/CommonApi/uploadNew.json",u={labelCol:{xs:{span:24},sm:{span:8}},wrapperCol:{xs:{span:24},sm:{span:16}}},c=function(e){var t=/^(\-)*(\d+).*$/;return"string"==typeof e?isNaN(Number(e))?"":e.replace(t,"$1$2"):"number"==typeof e?isNaN(e)?"":String(e).replace(t,"$1$2"):""},f=void 0;if(this.stateAlready){for(var m=this.state.list.warrantyVO.carComponentVOs,p=new Array,v=0;v<m.length;v++)p.push(v);a("keys",{initialValue:p});var g=n("keys");f=g.map(function(t){if(1==e.state.policy)return h.default.createElement(V,(0,r.default)({},u,{label:"组件",required:!1,key:t}),a("carComponentVOs["+t+"].code",{initialValue:m[t]?m[t].code:null})((0,l.default)(C.Input,{placeholder:"零件编号",style:{width:"20%",marginRight:8}})),a("carComponentVOs["+t+"].name]",{initialValue:m[t]?m[t].name:null,validateTrigger:["onChange","onBlur"],rules:[{required:!0,whitespace:!0,message:"Please input passenger's name or delete this field."}]})((0,l.default)(C.Input,{placeholder:"零件名称",style:{width:"20%",marginRight:8}})),a("carComponentVOs["+t+"].price",{initialValue:m[t]?m[t].price:null})((0,l.default)(C.InputNumber,{placeholder:"单价",style:{width:"10%",marginLeft:8}})),"元",a("carComponentVOs["+t+"].auditPrice]",{initialValue:m[t]?m[t].auditPrice:null})((0,l.default)(C.InputNumber,{placeholder:"核定单价",style:{width:"10%",marginLeft:8}})),"元",(0,l.default)("label",{style:{marginLeft:8}},void 0,"数量"),a("carComponentVOs["+t+"].count",{initialValue:m[t]?m[t].count:"1"})((0,l.default)(C.InputNumber,{min:1,style:{width:"10%",marginLeft:8},formatter:c,parser:c})),g.length>0?(0,l.default)(C.Icon,{className:"dynamic-delete-button",type:"minus-circle-o",onClick:function(){return e.remove(t)}}):null)})}var y=n("carComponentVOs");if(y){for(var O=0,I=0,v=0;v<y.length;v++)if(y[v]){var S=y[v].price,_=y[v].auditPrice,W=y[v].count;void 0!=S&&""!=S&&void 0!=W&&""!=W&&(O+=S*W),void 0!=_&&""!=_&&void 0!=W&&""!=W&&(I+=_*W)}this.state.sum=O,this.state.checkSum=I}var H={style:{marginLeft:"20%"}},B={style:{marginLeft:"25%",fontSize:"125%",marginRight:"25%"}},q=[{title:"维修商",dataIndex:"name",key:"name",render:function(e,t){return(0,l.default)("div",{},void 0,t.name," ",t.id)}}];if(this.stateAlready){var G=this.state.list.insuranceOrder.isFactoryInsurance;this.state.list.warrantyVO.picUrlList&&(this.state.list.warrantyVO.picUrlList=this.state.list.warrantyVO.picUrlList.map(function(t){if(0!=t.indexOf("http")){t=e.state.list.warrantyVO.imageHead+t}return t}),k&&(this.state.hisCover=this.state.list.warrantyVO.picUrlList,k=!1));var K=(0,l.default)("div",{},void 0,h.default.createElement(V,(0,r.default)({},u,{label:"工时费:"}),a("hourCost",{initialValue:this.state.list.warrantyVO.labourPrice})((0,l.default)(C.InputNumber,{min:0,style:{width:100}})),"元",(0,l.default)("label",{style:{marginLeft:8}},void 0,"核定工时费:"),a("checkHourCost",{initialValue:this.state.list.warrantyVO.auditLabourPrice})((0,l.default)(C.InputNumber,{min:0,style:{width:100}})),"元")),$=n("hourCost"),J=n("checkHourCost");this.state.checkSumTotal=0,this.state.sumTotal=0,$?void 0!=this.state.sum?this.state.sumTotal=this.state.sum+parseInt($):this.state.sumTotal=parseInt($):void 0!=this.state.sum&&(this.state.sumTotal=this.state.sum),J?void 0!=this.state.checkSum?this.state.checkSumTotal=this.state.checkSum+parseInt(J):this.state.checkSumTotal=parseInt(J):void 0!=this.state.checkSum&&(this.state.checkSumTotal=this.state.checkSum);var Q=G&&"Y"==G?(0,l.default)("div",{},void 0,h.default.createElement(V,(0,r.default)({label:"质保是否立即生效"},u),a("isActiveImmediately",{initialValue:this.state.list.warrantyVO?this.state.list.warrantyVO.insuranceActiveNow:"0"})((0,l.default)(C.Radio.Group,{onChange:this.onPolicyChange},void 0,U,R))),"0"==n("isActiveImmediately")?h.default.createElement(V,(0,r.default)({label:"里程数"},u),a("mileage",{initialValue:this.state.list.warrantyVO.insuranceMileage})((0,l.default)(C.InputNumber,{style:{width:"200"},formatter:c,parser:c})),"公里"):"","0"==n("isActiveImmediately")?h.default.createElement(V,(0,r.default)({label:"生效时间"},u),a("activeDate",{initialValue:M(this.state.list.warrantyVO.insuranceActiveTime)})(E)):""):"",j=[{label:"发动机",value:1},{label:"变速箱",value:2},{label:"驱动系统",value:4},{label:"转向系统",value:5},{label:"制动系统",value:3},{label:"悬挂系统",value:6},{label:"燃油系统",value:7},{label:"冷却系统",value:9},{label:"空调系统",value:8},{label:"电器系统",value:10},{label:"其他",value:11}],X=(0,l.default)(C.Modal,{title:"提示",width:600,visible:this.state.confirmDialogVisible,onOk:this.handleConfirmOk,onCancel:this.handleConfirmCancel},void 0,this.state.confirmMsg),Z=(0,l.default)(C.Modal,{title:"选择维修商",width:600,visible:this.state.chooseMaintenanceVisible,onOk:this.handleOk,onCancel:this.handleCancel},void 0,(0,l.default)(C.Form,{layout:"inline"},void 0,(0,l.default)(V,{label:"名称"},void 0,a("maintenanceNameSearch")((0,l.default)(C.Input,{style:{width:100}}))),(0,l.default)(V,{label:"省市"},void 0,a("provinceCitySearch")((0,l.default)(b.RJAreaCascader,{allowClear:!0,cascaderLevel:2,onProvinceChange:this.handleProvinceChange,onCityChange:this.handleCityChange}))),(0,l.default)(C.Button,{type:"primary",onClick:this.handSubmit},void 0,"搜索"),L,(0,l.default)("div",{className:"table-content"},void 0,(0,l.default)(C.Table,{columns:q,dataSource:this.state.maintenanceList.items,pagination:i,onChange:this.handleMaintenanceTableChange,rowSelection:o,bordered:!0}))));return(0,l.default)("div",{},void 0,(0,l.default)(w.default,{_this:this}),h.default.createElement("h2",H,"索赔处理"),(0,l.default)(C.Form,{},void 0,h.default.createElement(V,(0,r.default)({label:"索赔方式"},u),a("repairMode",{initialValue:this.state.list.warrantyVO.repairMode})(P)),h.default.createElement(V,(0,r.default)({label:"车辆报修公里数"},u),a("claimMileage",{initialValue:this.state.list.warrantyVO.claimMileage})((0,l.default)(C.InputNumber,{style:{width:"200"},formatter:c,parser:c})),"公里"),h.default.createElement(V,(0,r.default)({label:"车辆报修日期"},u),a("claimDate",{initialValue:M(this.state.list.warrantyVO.claimDate)})(D)),"3"!=n("repairMode")?Q:"",(0,l.default)("div",{style:"3"!=n("repairMode")?{display:"block"}:{display:"none"}},void 0,h.default.createElement(V,(0,r.default)({label:"维修商名称"},u),a("maintenanceName",{initialValue:this.state.list.warrantyVO.repairShopName})((0,l.default)(C.Input,{style:{width:200},onClick:this.chooseMaintenance}))),h.default.createElement(C.Row,(0,r.default)({gutter:50},B),(0,l.default)(C.Col,{span:8},void 0,N,a("maintenanceContacts",{initialValue:this.state.list.warrantyVO.contacts})(T)),(0,l.default)(C.Col,{span:8},void 0,A,a("maintenanceContactPhone",{initialValue:this.state.list.warrantyVO.repairShopPhone})(x)),(0,l.default)(C.Col,{span:8},void 0,F,a("maintenanceAddress",{initialValue:this.state.list.warrantyVO.repairShopAddr})(z)))),h.default.createElement(V,(0,r.default)({label:"故障部位:"},u),a("components",{initialValue:this.state.list.warrantyVO.breakDownList})((0,l.default)(C.Checkbox.Group,{style:{width:"100%"},options:j}))),h.default.createElement(V,(0,r.default)({},u,{label:"资料上传"}),(0,l.default)(b.RJImgUploader,{action:d,beforeUpload:this.beforeUpload,defaultValue:this.state.hisCover,onRemove:function(t){var a=(t.file,t.updatedDefaultValues);e.setState({hisCover:a}),e.state.hisCover=a},onChange:function(t){return e.onChangeCover(t)}},void 0)),(0,l.default)("div",{style:3!=n("repairMode")?{display:"block"}:{display:"none"}},void 0,h.default.createElement(V,(0,r.default)({},u,{label:"维修方案"}),a("repairSchema",{initialValue:this.state.list.warrantyVO.repairSchema})((0,l.default)(C.Input,{type:"textarea",style:{width:600,height:300}}))),f,h.default.createElement(V,(0,r.default)({},u,{label:"更换部件"}),(0,l.default)(C.Button,{type:"dashed",onClick:this.addComponent,style:{width:200}},void 0,Y,"添加更换部件")),h.default.createElement(V,(0,r.default)({},u,{label:"配件费小计:"}),this.state.sum,"元",(0,l.default)("label",{style:{marginLeft:"30"}},void 0,"核定配件费小计: "),this.state.checkSum,"元"),K,h.default.createElement(V,(0,r.default)({},u,{label:"总价"}),this.state.sumTotal,"元",(0,l.default)("label",{style:{marginLeft:"30"}},void 0,"核定总价: "),this.state.checkSumTotal,"元")),h.default.createElement(V,(0,r.default)({},u,{label:"免赔原因:",style:"3"==n("repairMode")?{display:"block"}:{display:"none"}}),a("freeReason",{initialValue:this.state.list.warrantyVO.refuseReason})((0,l.default)(C.Input,{type:"textarea",style:{width:"400"}}))),h.default.createElement(V,(0,r.default)({},u,{label:"拒赔原因:",style:"2"==n("repairMode")?{display:"block"}:{display:"none"}}),a("refuseReason",{initialValue:this.state.list.warrantyVO.refuseReason})((0,l.default)(C.Input,{type:"textarea",style:{width:"400"}})))),X,Z,(0,l.default)("div",{},void 0,(0,l.default)("div",{},void 0,(0,l.default)(C.Button,{type:"primary",style:{marginLeft:500,marginRight:10},onClick:function(){return e.saveOrUpdate("createOrUpdate")}},void 0,"保存"),(0,l.default)(C.Button,{onClick:function(){return e.saveOrUpdate("submit")}},void 0,"提交"))))}return null},t}(O.default);_=C.Form.create()(_),g.default.render((0,l.default)("div",{},void 0,(0,l.default)(_,{})),document.querySelector("#content"))},64:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var i=a(4),r=n(i),s=a(14),l=n(s),o=a(1),d=n(o),u=a(3),c=n(u),f=a(2),m=n(f),p=a(0),h=n(p),v=a(11),g=(a(22),a(29)),y=a(13),O=(v.Form.Item,(0,l.default)("br",{})),C=function(e){function t(a){(0,d.default)(this,t);var n=(0,c.default)(this,e.call(this,a));return n.state={selectedRowKeys:[]},n.setModalVisible=function(e){n.setState({modalVisible:e}),n.setState({selectedRowKeys:[]})},n.handSubmit=function(e){n.props.form.validateFieldsAndScroll(function(e,t){if(!e){var a=n.props.form.getFieldsValue(),i=n.props._this;i.state.remoteQuery=a,i.state.remotePage=1,i.getRemotePageResult()}})},n.handleReset=function(){n.props.form.resetFields(),n.setState({remoteQuery:{}})},n.addProducts=function(e){n.setModalVisible(!1);var t=n.props._this;0!=n.state.selectedRowKeys.length&&t.addRuleProductLink().then(function(e){t.getPageResult()})},n.onSelectChange=function(e){n.setState({selectedRowKeys:e})},n.state={modalVisible:!1,chooseMaintenanceVisible:!1},n}return(0,m.default)(t,e),t.prototype.render=function(){var e=(this.props.form.getFieldDecorator,null);this.props._this&&(e=this.props._this);e.state.allList&&(e.state.allList.totalNumber,e.state.allList.currentIndex,e.state.allList.pageSize),e.state.maintenanceList&&(e.state.maintenanceList.totalNumber,e.state.maintenanceList.currentIndex,e.state.maintenanceList.pageSize);var t=(this.state.selectedRowKeys,{style:{marginLeft:"15%"}}),a={style:{marginLeft:"20%"}},n={style:{marginLeft:"25%",fontSize:"125%"}},i={style:{marginLeft:"25%",fontSize:"125%",marginRight:"25%"}},s=[{title:"创建时间",dataIndex:"dateCreate",key:"dateCreate"},{title:"报修人",dataIndex:"customerName",key:"customerName"},{title:"故障现象描述",dataIndex:"malfunctionInfo",key:"malfunctionInfo"},{title:"处理结果",dataIndex:"repairMode",key:"repairMode",render:function(e,t){var a="";switch(t.repairMode){case"0":a="待查定";break;case"1":a="正常理赔";break;case"2":a="拒赔";break;case"3":a="免赔"}return(0,l.default)("div",{},void 0,a)}},{title:"核定赔付金额",dataIndex:"totalPrice",key:"totalPrice",render:function(e,t){return(0,l.default)("div",{},void 0,t.totalPrice,"元")}},{title:"审查员",dataIndex:"subscriber",key:"subscriber"},{title:"操作",dataIndex:"option",key:"option",render:function(e,t){return(0,l.default)("div",{},void 0,(0,l.default)("a",{onClick:function(){return location.href="viewWarranty.html?id="+t.id}},void 0,"查看理赔方案"))}}],o=void 0;o="Y"!=e.state.list.insuranceOrder.isFactoryInsurance||e.state.list.warrantyVO.insuranceActiveNow&&"1"!=e.state.list.warrantyVO.insuranceActiveNow?"大搜车质保":"厂家质保("+y(e.state.list.insuranceOrder.factoryInsuranceEndDate).format("YYYY-MM-DD")+"到期)";var d=void 0;d=e.state.list.insuranceOrder.qaStart?y(e.state.list.insuranceOrder.qaStart).format("YYYY-MM-DD")+" 至 "+y(e.state.list.insuranceOrder.qaEnd).format("YYYY-MM-DD"):"无";var u=new Array;if(e.state.list.warrantyAuditHistoryList)for(var c=e.state.list.warrantyAuditHistoryList,f=0;f<c.length;f++)if(0==f)u.push((0,l.default)(v.Timeline.Item,{},void 0,(0,l.default)("div",{style:{fontSize:14}},void 0,"发起人:       ",c[f].name," ",c[f].phone,"    发起时间: ",c[f].dateCreate)));else if("0"==c[f].type)u.push((0,l.default)(v.Timeline.Item,{},void 0,(0,l.default)("div",{style:{fontSize:14}},void 0,"查定员:       ",c[f].name," ",c[f].phone,"    提交时间: ",c[f].dateCreate)));else{var m=void 0;0!=c[f].auditResult&&(m=(0,l.default)("div",{},void 0,"驳回原因:   ",c[f].refuseReason)),u.push((0,l.default)(v.Timeline.Item,{},void 0,(0,l.default)("div",{style:{fontSize:14}},void 0,"审核人:       ",c[f].name," ",c[f].phone,"    审核时间: ",c[f].dateCreate,O,"审核结果:   ",0==c[f].auditResult?"通过":"驳回","    ",m)))}return(0,l.default)("div",{},void 0,h.default.createElement("h1",t,"报修管理"),h.default.createElement("h2",a,"报修信息"),h.default.createElement(v.Row,(0,r.default)({gutter:50},n),(0,l.default)(v.Col,{span:10},void 0,"报修人姓名:",e.state.list.warrantyVO.customerName),(0,l.default)(v.Col,{span:10},void 0,"报修人电话:",e.state.list.warrantyVO.phone)),h.default.createElement(v.Row,(0,r.default)({gutter:50},n),(0,l.default)(v.Col,{span:10},void 0,"当前表显里程:",e.state.list.warrantyVO.mileage,"公里"),(0,l.default)(v.Col,{span:10},void 0,"车辆所在地:",e.state.list.warrantyVO.province,e.state.list.warrantyVO.city,e.state.list.warrantyVO.carAddr)),h.default.createElement(v.Row,(0,r.default)({gutter:50},n),(0,l.default)(v.Col,{span:10},void 0,"故障现象描述:",e.state.list.warrantyVO.malfunctionInfo)),h.default.createElement(v.Row,(0,r.default)({gutter:50},n),(0,l.default)(v.Col,{span:10},void 0,"创建人:",e.state.list.warrantyVO.subscriber),(0,l.default)(v.Col,{span:10},void 0,"创建时间:",e.state.list.warrantyVO.dateCreate)),h.default.createElement("h2",a,"车辆信息"),h.default.createElement(v.Row,(0,r.default)({gutter:50},n),(0,l.default)(v.Col,{span:10},void 0,"车辆名称:",e.state.list.insuranceOrder.carName),(0,l.default)(v.Col,{span:10},void 0,"VIN码:",e.state.list.warrantyVO.vin)),h.default.createElement(v.Row,(0,r.default)({gutter:50},n),(0,l.default)(v.Col,{span:10},void 0,"发车时表显里程:",e.state.list.insuranceOrder.mileage,"公里"),(0,l.default)(v.Col,{span:10},void 0,"开启时表显里程:",e.state.list.insuranceOrder.tableMileage?1e4*e.state.list.insuranceOrder.tableMileage:"","公里")),h.default.createElement(v.Row,(0,r.default)({gutter:50},n),(0,l.default)(v.Col,{span:10},void 0,"车源类型:",e.state.list.insuranceCarWrapperModel.importType),(0,l.default)(v.Col,{span:10},void 0,"座位数:",e.state.list.insuranceCarWrapperModel.seetNumber,"座")),h.default.createElement(v.Row,(0,r.default)({gutter:50},n),(0,l.default)(v.Col,{span:10},void 0,"使用性质:",e.state.list.insuranceCarWrapperModel.useTypeName),(0,l.default)(v.Col,{span:10},void 0,"车身结构:",e.state.list.insuranceCarWrapperModel.bodyName)),h.default.createElement(v.Row,(0,r.default)({gutter:50},n),(0,l.default)(v.Col,{span:10},void 0,"燃油类型:",e.state.list.warrantyVO.fuelType),(0,l.default)(v.Col,{span:10},void 0,"变速箱:",e.state.list.warrantyVO.gearBoxType)),h.default.createElement(v.Row,(0,r.default)({gutter:50},n),(0,l.default)(v.Col,{span:10},void 0,"初次上牌时间:",e.state.list.warrantyVO.firstLicensePlateDate),(0,l.default)(v.Col,{span:10},void 0,"排量:",e.state.list.warrantyVO.engineVolume,"L")),h.default.createElement(v.Row,(0,r.default)({gutter:50},n),(0,l.default)(v.Col,{span:10},void 0,"进气方式:",e.state.list.warrantyVO.intakeType),(0,l.default)(v.Col,{span:10},void 0,"车商:",e.state.list.insuranceOrder.shopName,"(",e.state.list.insuranceOrder.sellerName,")")),h.default.createElement(v.Row,(0,r.default)({gutter:50},n),(0,l.default)(v.Col,{span:10},void 0,"客户信息:",e.state.list.insuranceOrder.buyerName," ",e.state.list.insuranceOrder.buyerPhone),(0,l.default)(v.Col,{span:10},void 0,"是否有事故记录:",e.state.list.insuranceCarWrapperModel.hasAccidentRecord)),h.default.createElement(v.Row,(0,r.default)({gutter:50},n),(0,l.default)(v.Col,{span:10},void 0,"生产日期:",e.state.list.insuranceCarWrapperModel.productionDate)),h.default.createElement("h2",a,"质保方案"),h.default.createElement(v.Row,(0,r.default)({gutter:50},n),(0,l.default)(v.Col,{span:10},void 0,"质保信息:",e.state.list.insuranceOrder.insuranceOrderSchemeInfo.productName),(0,l.default)(v.Col,{span:10},void 0,"当前质保类型:",o)),h.default.createElement(v.Row,(0,r.default)({gutter:50},n),(0,l.default)(v.Col,{span:10},void 0,"质保状态:",(0,g.convertQaActive)(e.state.list.insuranceOrder.qaActive)),(0,l.default)(v.Col,{span:10},void 0,"报修范围:",e.state.list.insuranceOrder.insuranceOrderSchemeInfo.parts)),h.default.createElement(v.Row,(0,r.default)({gutter:50},n),(0,l.default)(v.Col,{span:10},void 0,"质保期限:",e.state.list.insuranceOrder.insuranceOrderSchemeInfo.expires),(0,l.default)(v.Col,{span:10},void 0,"免赔期限:",e.state.list.insuranceOrder.insuranceOrderSchemeInfo.freeCompensage)),h.default.createElement(v.Row,(0,r.default)({gutter:50},n),(0,l.default)(v.Col,{span:10},void 0,"赔付限额:",e.state.list.insuranceOrder.insuranceOrderSchemeInfo.compensateLimit,"元/每年"),(0,l.default)(v.Col,{span:10},void 0,"增值服务:",e.state.list.insuranceOrder.insuranceOrderSchemeInfo.freeService)),h.default.createElement(v.Row,(0,r.default)({gutter:50},n),(0,l.default)(v.Col,{span:10},void 0,"质保有效期:",d),(0,l.default)(v.Col,{span:10},void 0,"保费共计:",e.state.list.insuranceOrder.usedPrice,"元")),h.default.createElement("h2",a,"延保信息"),h.default.createElement(v.Row,(0,r.default)({gutter:50},n),(0,l.default)(v.Col,{span:10},void 0,"延保状态:",(0,g.convertExtInsureStatus)(e.state.list.insuranceOrder.extInsureChanceStatus)),(0,l.default)(v.Col,{span:10},void 0,"融租信息:",(0,g.convertLeaseAfterStatus)(e.state.list.insuranceOrder.extInsureChanceLeaseHandleType))),h.default.createElement(v.Row,(0,r.default)({gutter:50},n),(0,l.default)(v.Col,{span:10},void 0,"融租期理赔:","Y"==e.state.list.insuranceOrder.extInsureChanceEffectiveClaimStatus?"有":"无"),(0,l.default)(v.Col,{span:10},void 0,"融租期行驶里程:",(0,g.convertExtTableMileage)(e.state.list.insuranceOrder.extInsureChanceInitGpsMileage,e.state.list.insuranceOrder.extInsureChanceContractEndGpsMileage),"公里")),h.default.createElement(v.Row,(0,r.default)({gutter:50},n),(0,l.default)(v.Col,{span:10},void 0,"生效日:",(0,g.formatTime)(e.state.list.insuranceOrder.extInsureChanceEffectiveStartDate)),(0,l.default)(v.Col,{span:10},void 0,"截止日:",(0,g.formatTime)(e.state.list.insuranceOrder.extInsureChanceEffectiveEndDate))),h.default.createElement(v.Row,(0,r.default)({gutter:50},n),(0,l.default)(v.Col,{span:10},void 0,"关闭原因:",e.state.list.insuranceOrder.extInsureChanceNotAccordDesc)),h.default.createElement("h2",a,"历史赔付"),h.default.createElement(v.Table,(0,r.default)({},i,{columns:s,dataSource:e.state.list.historyRepairList,size:"small",bordered:!0})),h.default.createElement("h2",a,"审核信息"),h.default.createElement(v.Timeline,i,u))},t}(p.Component);C=v.Form.create()(C),t.default=C,e.exports=t.default}},[583]);