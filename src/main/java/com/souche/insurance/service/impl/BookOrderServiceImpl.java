package com.souche.insurance.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.souche.insurance.common.exception.InsuranceServiceException;
import com.souche.insurance.dao.BookOrderDao;
import com.souche.insurance.model.BookOrderModel;
import com.souche.insurance.model.BookOrderQueryParam;
import com.souche.insurance.service.BookOrderService;
import com.souche.optimus.common.page.Page;
import com.souche.optimus.common.util.JsonUtils;

import lombok.extern.slf4j.Slf4j;

/**
 * @author : Arthur
 * @date 创建时间：Dec 4, 2018 2:19:50 PM
 */
@Slf4j
@Service("bookOrderService")
public class BookOrderServiceImpl implements BookOrderService {
	
	@Autowired
	private BookOrderDao bookOrderDao;

	@Override
	public Page<BookOrderModel> queryPageOrderList(BookOrderQueryParam orderQueryParam) {
		try {
			log.info("获取车商合同列表:param={}", JsonUtils.toJson(orderQueryParam));
			return bookOrderDao.queryPageOrderList(orderQueryParam);
		} catch (Exception e) {
			log.error("获取车商合同列表失败！", e);
			throw new InsuranceServiceException("获取车商合同列表失败！");
		}
	}

}
