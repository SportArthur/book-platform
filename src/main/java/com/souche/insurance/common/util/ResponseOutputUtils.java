package com.souche.insurance.common.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.util.StringUtils;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;

@Slf4j
public final class ResponseOutputUtils {
    private static final String DEFAULT_ENCODING = "UTF-8";

    private ResponseOutputUtils() {
    }

    public static void write(HttpServletResponse response, String data, String contentType) {
        OutputStream os = null;
        try {
            if (StringUtils.hasText(data)) {
                if (!response.containsHeader("Access-Control-Allow-Origin")) {
                    response.addHeader("Access-Control-Allow-Origin", "*");
                }
                os = response.getOutputStream();
                response.setContentType(contentType);
                os.write(data.getBytes(DEFAULT_ENCODING));
                os.flush();
            }
        } catch (Exception ex) {
            log.error("write data to response error", ex);
        } finally {
            if (os != null) {
                try {
                    os.close();
                } catch (IOException e) {
                    log.error("close OutputStream error", e);
                }
            }
        }
    }
}
