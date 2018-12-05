package com.souche.insurance.screen;

import javax.servlet.http.HttpServletRequest;

import com.souche.optimus.core.annotation.View;
import com.souche.optimus.core.controller.Context;
import com.souche.optimus.core.controller.Navigator;

@View
public class Index {
	public void execute(Context context, HttpServletRequest request, Navigator navigator) {
		navigator.redirectTo("/admin/order/OrderIndex.html");
	}
}