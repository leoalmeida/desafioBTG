package space.lasf.order.core.component;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import java.util.Locale;
import java.util.NoSuchElementException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.cglib.proxy.UndeclaredThrowableException;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import space.lasf.order.core.exception.BusinessException;
import space.lasf.order.core.exception.ControllerException;
import space.lasf.order.core.util.ResponseError;

class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler handler;
    private MessageSource messageSource;
    private WebRequest request;

    @BeforeEach
    void setUp() {
        handler = new GlobalExceptionHandler();
        messageSource = org.mockito.Mockito.mock(MessageSource.class);
        ReflectionTestUtils.setField(handler, "messageSource", messageSource);
        request = new ServletWebRequest(new MockHttpServletRequest());
    }

    @Test
    void handleIllegalArgumentExceptionShouldReturnBadRequest() {
        ResponseEntity<Object> response =
                handler.handleIllegalArgumentException(new IllegalArgumentException("invalid input"), request);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        ResponseError body = (ResponseError) response.getBody();
        assertNotNull(body);
        assertEquals("error", body.getStatus());
        assertEquals(400, body.getStatusCode());
        assertEquals("invalid input", body.getError());
    }

    @Test
    void handleBusinessExceptionShouldReturnUnprocessableEntity() {
        ResponseEntity<Object> response =
                handler.handleBusinessException(new BusinessException("business error"), request);

        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, response.getStatusCode());
        ResponseError body = (ResponseError) response.getBody();
        assertNotNull(body);
        assertEquals(422, body.getStatusCode());
        assertEquals("business error", body.getError());
    }

    @Test
    void handleNotFoundExceptionShouldReturnNotFound() {
        ResponseEntity<Object> response =
                handler.handleNotFoundException(new NoSuchElementException("missing order"), request);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        ResponseError body = (ResponseError) response.getBody();
        assertNotNull(body);
        assertEquals(404, body.getStatusCode());
        assertEquals("missing order", body.getError());
    }

    @Test
    void handleGeneralShouldUseMessageSourceForInternalError() {
        when(messageSource.getMessage(eq("error.server"), any(Object[].class), any(Locale.class)))
                .thenReturn("internal server error");

        ResponseEntity<Object> response = handler.handleGeneral(new RuntimeException("boom"), request);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        ResponseError body = (ResponseError) response.getBody();
        assertNotNull(body);
        assertEquals(500, body.getStatusCode());
        assertEquals("internal server error", body.getError());
    }

    @Test
    void handleGeneralShouldUnwrapUndeclaredBusinessException() {
        UndeclaredThrowableException wrapped =
                new UndeclaredThrowableException(new BusinessException("wrapped business"));

        ResponseEntity<Object> response = handler.handleGeneral(wrapped, request);

        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, response.getStatusCode());
        ResponseError body = (ResponseError) response.getBody();
        assertNotNull(body);
        assertEquals("wrapped business", body.getError());
    }

    @Test
    void handleControllerExceptionShouldReturnProblemDetail() throws Exception {
        ResponseEntity<ProblemDetail> response =
                handler.handleIllegalStateException(new ControllerException("controller error"));

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        ProblemDetail body = response.getBody();
        assertNotNull(body);
        assertEquals("Controller Exception", body.getTitle());
        assertEquals("controller error", body.getDetail());
        assertEquals("http://localhost:8000/errors/500", body.getType().toString());
    }
}
