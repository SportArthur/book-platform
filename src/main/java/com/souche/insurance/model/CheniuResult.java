package com.souche.insurance.model;

import com.souche.optimus.core.web.Result;

/**
 * xumingming 16/3/29.
 */
public class CheniuResult<T> extends Result {

    private int resultId;

    private String message;

    private T data;

    public int getResultId() {
        return resultId;
    }

    public CheniuResult<T> setResultId(int resultId) {
        this.resultId = resultId;
        return this;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public static <T> CheniuResult<T> success(T data, String message) {
        CheniuResult<T> r = new CheniuResult<T>();
        r.setData(data);
        r.setSuccess(true);
        r.setCode("200");
        r.setMsg(message);
        r.setResultId(0);
        return r;
    }


    public static <T> CheniuResult<T> success() {
        CheniuResult<T> r = new CheniuResult<T>();
        r.setSuccess(true);
        r.setCode("200");
        r.setMsg("success");
        r.setResultId(0);
        return r;
    }

    public static <T> CheniuResult<T> fail(String msg, int resultId) {
        CheniuResult<T> r = new CheniuResult<T>();
        r.setSuccess(false);
        r.setMsg(msg);
        r.setResultId(resultId);
        return r;
    }


    public static <T> CheniuResult<T> fail(T data, String msg, int resultId) {
        CheniuResult<T> r = new CheniuResult<T>();
        r.setSuccess(false);
        r.setData(data);
        r.setMsg(msg);
        r.setResultId(resultId);
        return r;
    }
    public static <T> CheniuResult<T> fail(T data, String msg, int resultId,String code) {
        CheniuResult<T> r = new CheniuResult<T>();
        r.setSuccess(false);
        r.setData(data);
        r.setCode(code);
        r.setMsg(msg);
        r.setResultId(resultId);
        return r;
    }
}
