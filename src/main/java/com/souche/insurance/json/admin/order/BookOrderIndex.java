package com.souche.insurance.json.admin.order;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

import com.alibaba.fastjson.JSONObject;
import com.google.common.collect.Maps;
import com.souche.insurance.model.BookOrderQueryParam;
import com.souche.insurance.service.BookOrderService;
import com.souche.optimus.core.annotation.Json;
import com.souche.optimus.core.annotation.Param;
import com.souche.optimus.core.annotation.View;
import com.souche.optimus.core.sad.AbstractReactAction;
import com.souche.optimus.core.sad.Props;
import com.souche.optimus.core.sad.ReactAction;
import com.souche.optimus.core.sad.State;

/**
 * 订单列表页面接口
 * 
 * @author arthur
 *
 */
@View(value = "bookOrderIndexAction", desc = "首页接口")
public class BookOrderIndex extends AbstractReactAction {

	@Autowired
	private BookOrderService bookOrderService;

	@Override
	public Map<String, Object> init(Props props) {
		Map<String, Object> map = Maps.newHashMap();
		BookOrderQueryParam orderQueryParam = new BookOrderQueryParam();
		orderQueryParam.setPage(1);
		orderQueryParam.setPageSize(10);
		map.put("list", bookOrderService.queryPageOrderList(orderQueryParam));
		return map;
	}

	@ReactAction(desc = "获取车商合同列表")
	public void getList(@Json(value = "state.query", defaultValue = "") JSONObject query,
			@Param(value = "state.page", defaultValue = "1") Integer page,
			@Param(value = "state.pageSize", defaultValue = "10") Integer pageSize) {
		State state = super.getState();
		BookOrderQueryParam orderQueryParam = JSONObject.parseObject(query.toJSONString(), BookOrderQueryParam.class);
		orderQueryParam.setPage(page);
		orderQueryParam.setPageSize(pageSize);
		state.set("list", bookOrderService.queryPageOrderList(orderQueryParam));
	}

}
