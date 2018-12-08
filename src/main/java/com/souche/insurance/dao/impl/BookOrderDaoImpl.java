package com.souche.insurance.dao.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.souche.insurance.dao.BookOrderDao;
import com.souche.insurance.model.BookOrderDO;
import com.souche.insurance.model.BookOrderModel;
import com.souche.insurance.model.BookOrderQueryParam;
import com.souche.optimus.common.page.Page;
import com.souche.optimus.common.util.StringUtil;
import com.souche.optimus.dao.BasicDao;
import com.souche.optimus.dao.query.OrderParam;
import com.souche.optimus.dao.query.QueryObj;
import com.souche.optimus.dao.query.QueryParam;

/**
 * @author : Arthur
 * @date 创建时间：Dec 4, 2018 10:10:57 PM
 */
@Service
public class BookOrderDaoImpl implements BookOrderDao {

	@Autowired
    private BasicDao basicDao;

	@Override
	public Page<BookOrderModel> queryPageOrderList(BookOrderQueryParam param) {
		BookOrderDO BookOrderDO = new BookOrderDO();

		if (StringUtil.isNotEmpty(param.getShopCode())) {
			BookOrderDO.setShopCode(param.getShopCode());
		}
		if (StringUtil.isNotEmpty(param.getBuyerPhone())) {
			BookOrderDO.setBuyerPhone(param.getBuyerPhone());
		}
		if (StringUtil.isNotEmpty(param.getBuyerName())) {
			BookOrderDO.setBuyerName(param.getBuyerName());
		}

		QueryObj queryObj = new QueryObj();
		queryObj.setQuerydo(BookOrderDO);
		queryObj.setPageSize(param.getPageSize());
		queryObj.setPage(param.getPage());
		QueryParam queryParam = new QueryParam();

		if (param.getOrderStatus() != null) {
			queryParam.andParameter(" orderStatus >= #{orderStatus} ", param.getOrderStatus());
		}
		if (StringUtil.isNotEmpty(param.getDateCreateStart())) {
			queryParam.andParameter(" dateCreate >= #{dateCreateStart} ", param.getDateCreateStart());
		}
		if (StringUtil.isNotEmpty(param.getDateCreateEnd())) {
			queryParam.andParameter(" dateCreate <= #{dateCreateEnd} ", param.getDateCreateEnd());
		}
		if (StringUtil.isNotEmpty(param.getBookTimeStart())) {
			queryParam.andParameter(" bookTime >= #{bookTimeStart} ", param.getBookTimeStart());
		}
		if (StringUtil.isNotEmpty(param.getBookTimeEnd())) {
			queryParam.andParameter(" bookTime <= #{bookTimeEnd} ", param.getBookTimeEnd());
		}
		queryObj.setQueryParam(queryParam);
		List<OrderParam> orderParams = new ArrayList<OrderParam>();
		orderParams.add(new OrderParam("dateCreate", OrderParam.ORDER_DESC));
		queryObj.setOrderParams(orderParams);
		Page<BookOrderModel> page = basicDao.queryPage(queryObj, BookOrderModel.class);
		return page;
	}

	@Override
	public Boolean updateOrder(BookOrderDO orderDO) {
		int update = basicDao.update(orderDO);
		return update > 0;
	}
	
	@Override
	public Boolean insertOrder(BookOrderDO orderDO) {
		int insert = basicDao.insert(orderDO);
		return insert > 0;
	}

}
