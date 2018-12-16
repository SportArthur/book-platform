package com.souche.insurance.service.impl;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.souche.insurance.common.exception.InsuranceServiceException;
import com.souche.insurance.dao.BookShopDao;
import com.souche.insurance.model.shop.BookShopDO;
import com.souche.insurance.model.shop.BookShopModel;
import com.souche.insurance.model.shop.BookShopQueryParam;
import com.souche.insurance.service.BookShopService;
import com.souche.optimus.common.page.Page;
import com.souche.optimus.common.util.JsonUtils;

import lombok.extern.slf4j.Slf4j;

/**
 * @author : Arthur
 * @date 创建时间：Dec 16, 2018 9:57:29 AM
 */
@Slf4j
@Service("bookShopService")
public class BookShopServiceImpl implements BookShopService {

	@Autowired
	private BookShopDao bookShopDao;

	@Override
	public Page<BookShopModel> queryPageShopList(BookShopQueryParam queryParam) {
		log.info("店铺查询参数：param={}", JSONObject.toJSON(queryParam));
		try {
			return bookShopDao.queryPageShopList(queryParam);
		} catch (Exception e) {
			log.error("find shop list fault! msg={}", e.getMessage());
			throw new InsuranceServiceException("查询失败！");
		}
	}

	@Override
	public Boolean updateOrder(BookShopQueryParam param) {
		try {
			log.info("更新店铺授权参数:param={}", JsonUtils.toJson(param));
			BookShopDO orderDO = new BookShopDO();
			BeanUtils.copyProperties(param, orderDO);
			return bookShopDao.updateOrder(orderDO);
		} catch (Exception e) {
			log.error("更新店铺授权参数失败！", e);
			throw new InsuranceServiceException("更新店铺授权参数失败！");
		}
	}

	@Override
	public Boolean insertShop(BookShopDO shopDO) {
		try {
			log.info("新增店铺:param={}", JsonUtils.toJson(shopDO));
			return bookShopDao.insertShop(shopDO);
		} catch (Exception e) {
			log.error("新增店铺失败！", e);
			throw new InsuranceServiceException("新增店铺失败！");
		}
	}

}
