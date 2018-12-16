package com.souche.insurance.dao.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.souche.insurance.dao.BookShopDao;
import com.souche.insurance.model.shop.BookShopDO;
import com.souche.insurance.model.shop.BookShopModel;
import com.souche.insurance.model.shop.BookShopQueryParam;
import com.souche.optimus.common.page.Page;
import com.souche.optimus.common.util.StringUtil;
import com.souche.optimus.dao.BasicDao;
import com.souche.optimus.dao.query.OrderParam;
import com.souche.optimus.dao.query.QueryObj;
import com.souche.optimus.dao.query.QueryParam;

/**
 * @author : Arthur
 * @date 创建时间：Dec 16, 2018 10:05:18 AM
 */
@Service
public class BookShopDaoImpl implements BookShopDao {

	@Autowired
	private BasicDao basicDao;

	@Override
	public Page<BookShopModel> queryPageShopList(BookShopQueryParam param) {
		BookShopDO shopDO = new BookShopDO();

		if (param.getId() != null) {
			shopDO.setId(param.getId());
		}
		if (StringUtil.isNotEmpty(param.getShopPhone())) {
			shopDO.setShopPhone(param.getShopPhone());
		}
		if (StringUtil.isNotEmpty(param.getShopOwnerName())) {
			shopDO.setShopOwnerName(param.getShopOwnerName());
		}

		QueryObj queryObj = new QueryObj();
		queryObj.setQuerydo(shopDO);
		queryObj.setPageSize(param.getPageSize());
		queryObj.setPage(param.getPage());
		QueryParam queryParam = new QueryParam();

		if (StringUtil.isNotEmpty(param.getShopName())) {
			queryParam.andParameter(" shopName like %#{shopName}% ", param.getShopName());
		}
		if (param.getAuthStatus() != null) {
			queryParam.andParameter(" authStatus = #{authStatus} ", param.getAuthStatus());
		}
		if (StringUtil.isNotEmpty(param.getDateCreateStart())) {
			queryParam.andParameter(" dateCreate >= #{dateCreateStart} ", param.getDateCreateStart());
		}
		if (StringUtil.isNotEmpty(param.getDateCreateEnd())) {
			queryParam.andParameter(" dateCreate <= #{dateCreateEnd} ", param.getDateCreateEnd());
		}
		queryObj.setQueryParam(queryParam);
		List<OrderParam> orderParams = new ArrayList<OrderParam>();
		orderParams.add(new OrderParam("dateCreate", OrderParam.ORDER_DESC));
		queryObj.setOrderParams(orderParams);
		Page<BookShopModel> page = basicDao.queryPage(queryObj, BookShopModel.class);
		return page;
	}

	@Override
	public Boolean updateOrder(BookShopDO shopDO) {
		return basicDao.update(shopDO) > 0;
	}

	@Override
	public Boolean insertShop(BookShopDO shopDO) {
		return basicDao.insert(shopDO) > 0;
	}

	@Override
	public BookShopDO queryShopByShopCode(Integer shopCode) {
		BookShopDO shopDO = new BookShopDO();
		shopDO.setId(shopCode);
		QueryObj queryObj = new QueryObj();
		queryObj.setQuerydo(shopDO);
		return basicDao.findObjectByQuery(queryObj, BookShopDO.class);
	}

}
