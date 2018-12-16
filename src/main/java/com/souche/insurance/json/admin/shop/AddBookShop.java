package com.souche.insurance.json.admin.shop;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

import com.alibaba.fastjson.JSONObject;
import com.google.common.collect.Maps;
import com.souche.insurance.model.shop.BookShopDO;
import com.souche.insurance.service.BookShopService;
import com.souche.optimus.core.annotation.Json;
import com.souche.optimus.core.annotation.Param;
import com.souche.optimus.core.annotation.View;
import com.souche.optimus.core.sad.AbstractReactAction;
import com.souche.optimus.core.sad.Props;
import com.souche.optimus.core.sad.ReactAction;
import com.souche.optimus.core.sad.State;

/**
 * 新增店铺页面接口
 * 
 * @author arthur
 *
 */
@View(value = "addBookShopAction", desc = "新增店铺页面接口")
public class AddBookShop extends AbstractReactAction {

	@Autowired
	private BookShopService bookShopService;

	@Override
	public Map<String, Object> init(Props props) {
		Map<String, Object> map = Maps.newHashMap();
		return map;
	}

	@ReactAction(desc = "新增店铺")
	public void addShop(@Json(value = "state.query", defaultValue = "") JSONObject query,
			@Param(value = "state.page", defaultValue = "1") Integer page,
			@Param(value = "state.pageSize", defaultValue = "10") Integer pageSize) {
		State state = super.getState();
		BookShopDO shopDO = JSONObject.parseObject(query.toJSONString(), BookShopDO.class);
		state.set("list", bookShopService.insertShop(shopDO));
	}

}
