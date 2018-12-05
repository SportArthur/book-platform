package com.souche.insurance.json.common;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

import lombok.extern.slf4j.Slf4j;

/**
 * 下载文件相关通用
 * @author hehaibo
 *
 */
@Slf4j
public abstract class AbstractDownloadApi {

    public static final String APPLICATION_OCTET_STREAM = "application/octet-stream;charset=utf-8";
    public static final String APPLICATION_OCTET_PDF    = "application/pdf;charset=utf-8";
    public static final String APPLICATION_EXCEL = "application/vnd.ms-excel;charset=utf8";
    public static final String APPLICATION_CSV = "application/csv;charset=utf8";

    protected String encodeFileName(HttpServletRequest request, String fileName) {
        if (StringUtils.isEmpty(fileName)) {
            return StringUtils.EMPTY;
        }
        try {
            String userAgent = request.getHeader("User-Agent").toLowerCase();
            if (userAgent.indexOf("firefox") > 0 || userAgent.indexOf("chrome") > 0
                || userAgent.indexOf("applewebkit") > 0) {
                return new String(fileName.getBytes("UTF-8"), "ISO-8859-1");// firefox浏览器
            } else if (userAgent.toUpperCase().indexOf("MSIE") > 0) {
                return URLEncoder.encode(fileName, "UTF-8");// IE浏览器
            } else {
                return new String(fileName.getBytes("UTF-8"), "ISO-8859-1");// firefox浏览器
            }
        } catch (UnsupportedEncodingException e) {
            log.error("UnsupportedEncodingException:" + fileName, e);
        }
        return fileName;
    }

    protected void writeOutputStream(HttpServletRequest request, HttpServletResponse response,
                                     String fileName, InputStream inputStream,
                                     String contentType) throws IOException {
        if (inputStream == null) {
            return;
        }
        // 写入客户端
        response.addHeader("Content-Disposition",
            "attachment; filename=" + encodeFileName(request, fileName));
        response.setContentType(contentType);
        BufferedInputStream bufferedInputStream = null;
        try {
            // 不需要关闭
            OutputStream out = response.getOutputStream();
            bufferedInputStream = new BufferedInputStream(inputStream);
            byte[] buf = new byte[2048];
            int len = 0;
            while ((len = bufferedInputStream.read(buf)) > 0) {
                out.write(buf, 0, len);
            }
            // 必须flush
            out.flush();
        } finally {
            if (bufferedInputStream != null) {
                bufferedInputStream.close();
            }
        }
    }
}
