//package com.souche.insurance.json.admin.order;
//
//import java.util.Map;
//
//import org.springframework.beans.factory.annotation.Autowired;
//
//import com.alibaba.fastjson.JSONObject;
//import com.google.common.collect.Maps;
//import com.souche.insurance.service.contract.QaShopContractService;
//import com.souche.optimus.core.annotation.Param;
//import com.souche.optimus.core.annotation.View;
//import com.souche.optimus.core.sad.AbstractReactAction;
//import com.souche.optimus.core.sad.Props;
//import com.souche.optimus.core.sad.ReactAction;
//import com.souche.optimus.core.sad.State;
//
///**
// * 车商合同详情页面接口
// * @author arthur
// *
// */
//@View(value = "shopContractDetailAction", desc = "车商合同详情页面接口")
//public class BookOrderDetail extends AbstractReactAction {
//
//    @Autowired
//    private QaShopContractService qaShopContractService;
//
//    @Override
//    public Map<String, Object> init(Props props) {
//        Map<String, Object> map = Maps.newHashMap();
//        map.put("list", qaShopContractService.getContractPicBySerialNo(props.get("contractSerialNumber").toString()));
//        return map;
//    }
//
//    @ReactAction(desc = "查询车商合同图片")
//    public void showContractDetail(@Param(value = "state.query", defaultValue = "") JSONObject query) {
//        State state = super.getState();
//        state.set("list", qaShopContractService.getContractPicBySerialNo(query.getString("contractSerialNumber")));
//    }
//   
//}
