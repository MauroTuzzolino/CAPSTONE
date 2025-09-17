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

    // Chiave API SendGrid dal properties
    @Value("${sendgrid.api-key}")
    private String apiKey;

    // Email e nome del mittente
    @Value("${sendgrid.from-email}")
    private String fromEmail;

    @Value("${sendgrid.from-name}")
    private String fromName;

    // Metodo principale per inviare una mail
    public void sendEmail(String toEmail, String subject, String contentText) throws IOException {
        // Creo mittente e destinatario
        Email from = new Email(fromEmail, fromName);
        Email to = new Email(toEmail);

        // Creo il contenuto della mail (plain text)
        Content content = new Content("text/plain", contentText);

        // Creo l'oggetto Mail completo
        Mail mail = new Mail(from, subject, to, content);

        // Configuro il client SendGrid con la chiave API
        SendGrid sg = new SendGrid(apiKey);
        Request request = new Request();

        try {
            request.setMethod(Method.POST);            // POST per inviare la mail
            request.setEndpoint("mail/send");          // endpoint SendGrid
            request.setBody(mail.build());             // corpo della richiesta con la mail

            // Invio la mail e prendo la risposta
            Response response = sg.api(request);

            // Log della risposta (utile per debug)
            System.out.println("Status Code: " + response.getStatusCode());
            System.out.println("Body: " + response.getBody());
            System.out.println("Headers: " + response.getHeaders());
        } catch (IOException ex) {
            // Propago l'eccezione se l'invio fallisce
            throw ex;
        }
    }
}
