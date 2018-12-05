package com.souche.insurance.service;

import com.souche.insurance.model.BookOrderModel;
import com.souche.insurance.model.BookOrderQueryParam;
import com.souche.optimus.common.page.Page;

/**
 * @author : Arthur
 * @date 创建时间：Dec 4, 2018 2:18:29 PM
 */
public interface BookOrderService {

	Page<BookOrderModel> queryPageOrderList(BookOrderQueryParam orderQueryParam);
	
}
