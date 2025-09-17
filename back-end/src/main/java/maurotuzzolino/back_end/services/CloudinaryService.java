package maurotuzzolino.back_end.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    // Inietto l'istanza di Cloudinary configurata in CloudinaryConfig
    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    // Metodo per caricare un'immagine su Cloudinary
    public String uploadImage(MultipartFile file) throws IOException {
        // upload dell'immagine: la metto nella cartella profile_pictures e imposto resource_type=image
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "folder", "profile_pictures",
                "resource_type", "image"
        ));

        // ritorno l'URL sicuro dell'immagine appena caricata
        return uploadResult.get("secure_url").toString();
    }
}
