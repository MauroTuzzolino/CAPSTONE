package maurotuzzolino.back_end.DTO;

import java.time.LocalDateTime;

public class CommentDTO {
    public Long id;
    public Long authorId;
    public String authorUsername;
    public String content;
    public LocalDateTime createdAt;
}
