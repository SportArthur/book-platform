package com.souche.insurance.web.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;
import org.springframework.web.util.UrlPathHelper;

import com.alibaba.fastjson.JSON;

/**
 * 请求拦截参数
 *
 * @author hehaibo
 *
 */
public class RequestInterceptor extends HandlerInterceptorAdapter {

	private Logger logger = LoggerFactory.getLogger(RequestInterceptor.class);

	private UrlPathHelper urlPathHelper = new UrlPathHelper();

	@Override
	public boolean preHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler) throws Exception {
		try {
			String lookupPath = this.urlPathHelper.getLookupPathForRequest(request);
			if(!StringUtils.contains(lookupPath, "upload.json"))
			{
			    logger.info("请求地址:{},参数:{}", lookupPath,
                    JSON.toJSONString(request.getParameterMap()));
			}
		} catch (Exception e) {
			logger.error("RequestInterceptor error：",e);
			return true;
		}
		return true;
	}

}
