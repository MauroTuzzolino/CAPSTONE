package maurotuzzolino.back_end.services;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class EmailService {

    @Value("${sendgrid.api-key}")
    private String apiKey;

    @Value("${sendgrid.from-email}")
    private String fromEmail;

    @Value("${sendgrid.from-name}")
    private String fromName;
    
    public void sendEmail(String toEmail, String subject, String contentText) throws IOException {
        // Mittente e destinatario
        Email from = new Email(fromEmail, fromName);
        Email to = new Email(toEmail);

        // Contenuto
        Content content = new Content("text/plain", contentText);

        // Mail completa
        Mail mail = new Mail(from, subject, to, content);

        // Configuro SendGrid
        SendGrid sg = new SendGrid(apiKey);
        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sg.api(request);

            // Log della risposta (opzionale, utile per debug)
            System.out.println("Status Code: " + response.getStatusCode());
            System.out.println("Body: " + response.getBody());
            System.out.println("Headers: " + response.getHeaders());
        } catch (IOException ex) {
            // Propago l'eccezione se l'invio fallisce
            throw ex;
        }
    }
}
