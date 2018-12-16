package com.souche.insurance.web.exception;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Component;

import com.google.common.collect.Maps;
import com.souche.insurance.common.exception.InsuranceServiceException;
import com.souche.optimus.core.exception.ExceptionHandler;
import com.souche.optimus.core.web.Result;
import com.souche.optimus.exception.ErrorMessage;
import com.souche.optimus.exception.HttpStatusCodes;
import com.souche.optimus.exception.system.OptimusParamMissException;

import lombok.extern.slf4j.Slf4j;

/**
 * 异常处理类
 * 
 * @author arthur
 *
 */
@Component
@Slf4j
public class InsuranceExceptionHandler implements ExceptionHandler {

    private final static Map<String, ErrorMessage> exceptionMessageMap = Maps.newHashMap();
    static {
        addExceptionMessage("RpcException",
                ErrorMessage.errorMessage(HttpStatusCodes.STATUS_503, "503", "内部服务异常"));
    }

    @Override
    public Result<Object> handleException(HttpServletRequest request, Throwable e)
            throws Throwable {
    		log.error("请求API出现异常："+request.getRequestURI(),e);
        if(e instanceof InsuranceServiceException) {
            return Result.fail("503", ((InsuranceServiceException) e).getMsg());
        }else if(e instanceof OptimusParamMissException){
        	return Result.fail("503", e.getMessage());
    	}else {
            return Result.fail("503", "未知异常!");
        }
    }

    public static void addExceptionMessage(String exceptionSimpleName, ErrorMessage errMsg) {
        exceptionMessageMap.put(exceptionSimpleName, errMsg);
    }

    public static void addExceptionMessage(Throwable e, ErrorMessage errMsg) {
        exceptionMessageMap.put(e.getClass().getSimpleName(), errMsg);
    }
}


