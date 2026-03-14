package space.lasf.order.core.exception;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ControllerException extends Exception {

    private final String errorMessage;

    public ControllerException(final String errorMessage) {
        super(errorMessage);
        this.errorMessage = errorMessage;
    }
}
