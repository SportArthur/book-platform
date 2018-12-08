package com.souche.insurance.dao;

import com.souche.insurance.model.BookOrderDO;
import com.souche.insurance.model.BookOrderModel;
import com.souche.insurance.model.BookOrderQueryParam;
import com.souche.optimus.common.page.Page;

/**
 * @author : Arthur
 * @date 创建时间：Dec 4, 2018 10:10:03 PM
 */
public interface BookOrderDao {

	Page<BookOrderModel> queryPageOrderList(BookOrderQueryParam orderQueryParam);

	Boolean updateOrder(BookOrderDO orderDO);

	Boolean insertOrder(BookOrderDO orderDO);

}
