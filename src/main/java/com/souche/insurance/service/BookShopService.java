package com.souche.insurance.service;

import com.souche.insurance.model.shop.BookShopDO;
import com.souche.insurance.model.shop.BookShopModel;
import com.souche.insurance.model.shop.BookShopQueryParam;
import com.souche.optimus.common.page.Page;

/**
 * @author : Arthur
 * @date 创建时间：Dec 4, 2018 2:18:29 PM
 */
public interface BookShopService {

	Page<BookShopModel> queryPageShopList(BookShopQueryParam queryParam);
	
	Boolean updateOrder(BookShopQueryParam param);

	Boolean insertShop(BookShopDO shopDO);

}
