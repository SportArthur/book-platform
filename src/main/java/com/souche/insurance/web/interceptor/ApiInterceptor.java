package com.souche.insurance.web.interceptor;

import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 车牛端校验
 * xumingming 16/4/5.
 */
public class ApiInterceptor extends HandlerInterceptorAdapter {

    @Override
    public final boolean preHandle(final HttpServletRequest request, final HttpServletResponse response, final Object handler) throws Exception {
        if (!(handler instanceof HandlerMethod)) {
            return true; // 排除其他请求
        }

        if (request.getAttribute("__request_url") == null) {
            request.setAttribute("__request_url", request.getRequestURI());
        }
        response.addHeader("P3P", "CP=\"IDC DSP COR CURa ADMa OUR IND PHY ONL COM STA\"");
        if (!response.containsHeader("Access-Control-Allow-Origin")) {
            response.addHeader("Access-Control-Allow-Origin", "*");
        }
        if (!response.containsHeader("Access-Control-Allow-Credentials")) {
            response.addHeader("Access-Control-Allow-Credentials", "true");
        }
        return true;
    }
}
