package com.souche.insurance.common;

/**
 * Created by wanglei on 16/6/17.
 * 业务异常
 */
public class ServiceException extends RuntimeException {
    /**
	 *
	 */
	private static final long serialVersionUID = 1L;
	private String            code;
    private String            msg;
    private Exception         exception;

    public ServiceException(String code, String msg, Exception e) {
    	super(code+"_"+msg,e);
        this.code = code;
        this.msg = msg;
        this.exception = e;
    }

    public ServiceException(String code, String msg) {
    	super(code+"_"+msg);
        this.code = code;
        this.msg = msg;
    }

    //如果不需要携带明确的code，那么使用这个构造函数
    public ServiceException(String msg) {
    	super(msg);
        this.msg = msg;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public Exception getException() {
        return exception;
    }

    public void setException(Exception exception) {
        this.exception = exception;
    }
}
