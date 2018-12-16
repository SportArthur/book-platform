package com.souche.insurance.dao;

import com.souche.insurance.model.shop.BookShopDO;
import com.souche.insurance.model.shop.BookShopModel;
import com.souche.insurance.model.shop.BookShopQueryParam;
import com.souche.optimus.common.page.Page;

/**
 * @author : Arthur
 * @date 创建时间：Dec 16, 2018 9:59:31 AM
 */
public interface BookShopDao {

	Page<BookShopModel> queryPageShopList(BookShopQueryParam queryParam);

	Boolean updateOrder(BookShopDO orderDO);

	Boolean insertShop(BookShopDO shopDO);

	BookShopDO queryShopByShopCode(Integer shopCode);

}
