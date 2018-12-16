package com.souche.insurance.json.admin.shop;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

import com.alibaba.fastjson.JSONObject;
import com.google.common.collect.Maps;
import com.souche.insurance.model.shop.BookShopQueryParam;
import com.souche.insurance.service.BookShopService;
import com.souche.optimus.core.annotation.Json;
import com.souche.optimus.core.annotation.Param;
import com.souche.optimus.core.annotation.View;
import com.souche.optimus.core.sad.AbstractReactAction;
import com.souche.optimus.core.sad.Props;
import com.souche.optimus.core.sad.ReactAction;
import com.souche.optimus.core.sad.State;

/**
 * 店铺列表页面接口
 * 
 * @author arthur
 *
 */
@View(value = "bookShopIndexAction", desc = "首页接口")
public class BookShopIndex extends AbstractReactAction {

	@Autowired
	private BookShopService bookShopService;

	@Override
	public Map<String, Object> init(Props props) {
		Map<String, Object> map = Maps.newHashMap();
		BookShopQueryParam param = new BookShopQueryParam();
		map.put("list", bookShopService.queryPageShopList(param));
		return map;
	}

	@ReactAction(desc = "获取店铺列表")
	public void getList(@Json(value = "state.query", defaultValue = "") JSONObject query,
			@Param(value = "state.page", defaultValue = "1") Integer page,
			@Param(value = "state.pageSize", defaultValue = "10") Integer pageSize) {
		State state = super.getState();
		BookShopQueryParam param = JSONObject.parseObject(query.toJSONString(), BookShopQueryParam.class);
		param.setPage(page);
		param.setPageSize(pageSize);
		state.set("list", bookShopService.queryPageShopList(param));
	}

	@ReactAction(desc = "修改授权状态")
	public void handleAuthStatus(@Json(value = "state.query", defaultValue = "") JSONObject query) {
		State state = super.getState();
		BookShopQueryParam param = JSONObject.parseObject(query.toJSONString(), BookShopQueryParam.class);
		state.set("result", bookShopService.updateOrder(param));
	}

}
