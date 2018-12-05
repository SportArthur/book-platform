package com.souche.insurance.web.interceptor.advice;

import com.souche.insurance.common.ServiceException;
import com.souche.optimus.core.controller.JsonController;
import com.souche.optimus.core.web.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by xingshi
 */
@ControllerAdvice(basePackageClasses = JsonController.class)
@Slf4j
public class JsonApiExceptionAdvice {
    @ExceptionHandler(ServiceException.class)
    public ResponseEntity processServiceException(ServiceException e) {
        return ResponseEntity.ok(Result.fail(e.getCode(), e.getMsg()));
    }

    @ExceptionHandler
    public ResponseEntity defaultErrorHandler(HttpServletRequest req, Exception e) throws Exception {
        log.error(e.getMessage(), e);
        return ResponseEntity.ok(Result.fail("SYSTEM_EXCEPTION", e.getMessage()));
    }
}
