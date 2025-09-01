package maurotuzzolino.back_end.exceptions;


public class EmailAlreadyExistsException extends RuntimeException {
    public EmailAlreadyExistsException(String email) {
        super("L'email '" + email + "' è già registrata");
    }
}
