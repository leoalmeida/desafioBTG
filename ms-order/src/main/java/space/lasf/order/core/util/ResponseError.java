package space.lasf.order.core.util;

import java.util.Date;

public class ResponseError {
    private static final int BAD_REQUEST_STATUS_CODE = 400;

    private Date timestamp = new Date();
    private String status = "error";
    private int statusCode = BAD_REQUEST_STATUS_CODE;
    private String error;

    public String getError() {
        return error;
    }

    public void setError(final String error) {
        this.error = error;
    }

    public Date getTimestamp() {
        return new Date(timestamp.getTime());
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(final String status) {
        this.status = status;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(final int statusCode) {
        this.statusCode = statusCode;
    }
}
