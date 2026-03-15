package space.lasf.order.core.component;

import jakarta.annotation.Resource;
import java.net.URI;
import java.time.Instant;
import java.util.Locale;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;
import org.springframework.cglib.proxy.UndeclaredThrowableException;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import space.lasf.order.core.exception.BusinessException;
import space.lasf.order.core.exception.ControllerException;
import space.lasf.order.core.util.ResponseError;

@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    private static final String ERROR_STATUS = "error";
    private static final URI INTERNAL_ERROR_TYPE = URI.create("http://localhost:8000/errors/500");

    @Resource
    private MessageSource messageSource;

    @SuppressWarnings("PMD.LooseCoupling")
    private HttpHeaders headers() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

    private ResponseError responseError(final String message, final HttpStatus statusCode) {
        ResponseError responseError = new ResponseError();
        responseError.setStatus(ERROR_STATUS);
        responseError.setError(message);
        responseError.setStatusCode(statusCode.value());
        return responseError;
    }

    private ResponseEntity<Object> errorResponse(
            final Exception e, final WebRequest request, final HttpStatus statusCode, final String message) {
        return handleExceptionInternal(e, responseError(message, statusCode), headers(), statusCode, request);
    }

    private String serverErrorMessage(final Exception e) {
        if (messageSource == null) {
            return e.getMessage();
        }
        return messageSource.getMessage("error.server", new Object[] {e.getMessage()}, Locale.getDefault());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGeneral(final Exception e, final WebRequest request) {
        if (e instanceof UndeclaredThrowableException exception) {
            Throwable undeclaredThrowable = exception.getUndeclaredThrowable();
            if (undeclaredThrowable instanceof BusinessException businessException) {
                return handleBusinessException(businessException, request);
            }
        }

        return errorResponse(e, request, HttpStatus.INTERNAL_SERVER_ERROR, serverErrorMessage(e));
    }

    @ExceptionHandler({IllegalArgumentException.class})
    public ResponseEntity<Object> handleIllegalArgumentException(
            final IllegalArgumentException e, final WebRequest request) {
        return errorResponse(e, request, HttpStatus.BAD_REQUEST, e.getMessage());
    }

    @ExceptionHandler({BusinessException.class})
    public ResponseEntity<Object> handleBusinessException(final BusinessException e, final WebRequest request) {
        return errorResponse(e, request, HttpStatus.UNPROCESSABLE_ENTITY, e.getMessage());
    }

    @ExceptionHandler({NoSuchElementException.class})
    public ResponseEntity<Object> handleNotFoundException(final NoSuchElementException e, final WebRequest request) {
        return errorResponse(e, request, HttpStatus.NOT_FOUND, e.getMessage());
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            final MethodArgumentNotValidException e,
            final HttpHeaders headers,
            final HttpStatusCode status,
            final WebRequest request) {
        String validationMessage = e.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .filter(message -> message != null && !message.isBlank())
                .collect(Collectors.joining(", "));
        if (validationMessage.isBlank()) {
            validationMessage = "Validation error";
        }
        return errorResponse(e, request, HttpStatus.BAD_REQUEST, validationMessage);
    }

    @ExceptionHandler(value = {ControllerException.class})
    public ResponseEntity<ProblemDetail> handleIllegalStateException(final ControllerException ex) {
        ProblemDetail problemDetail =
                ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, ex.getErrorMessage());
        problemDetail.setTitle("Controller Exception");
        problemDetail.setDetail(ex.getErrorMessage());
        problemDetail.setType(INTERNAL_ERROR_TYPE);
        problemDetail.setProperty("isBusinessError", "true");
        problemDetail.setProperty("timestamp", Instant.now());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(problemDetail);
    }
}
