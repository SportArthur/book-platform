package com.souche.insurance.web.interceptor;

import com.souche.insurance.common.util.ResponseOutputUtils;
import com.souche.optimus.common.util.JsonUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

public class ExceptionResolver implements HandlerExceptionResolver {
    private final Logger LOG = LoggerFactory.getLogger(ExceptionResolver.class);

    @Override
    public ModelAndView resolveException(HttpServletRequest request, HttpServletResponse response, Object bean, Exception ex) {
        @SuppressWarnings({"unchecked"})
        Map<String, String[]> params = request.getParameterMap();

        Map<String, String> pp = new HashMap<String, String>();

        for (Map.Entry<String, String[]> entry : params.entrySet()) {
            int i = 0;
            for (String v : entry.getValue()) {
                if (entry.getValue().length > 1) {
                    pp.put(entry.getKey() + "[" + i + "]", v);
                    i++;
                } else {
                    pp.put(entry.getKey(), v);
                }
            }
        }

        LOG.error("system error with request url=" + request.getRequestURI() + ", params=" + pp.toString(), ex);

        ResponseOutputUtils.write(response, JsonUtils.toJson("system error " + ex.toString()), "application/json");

        return null;
    }

}