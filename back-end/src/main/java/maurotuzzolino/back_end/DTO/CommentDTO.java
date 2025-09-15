package maurotuzzolino.back_end.DTO;

import java.time.LocalDateTime;

public class CommentDTO {
    public Long id;
    public Long authorId;
    public String authorUsername;
    public String content;
    public LocalDateTime createdAt;
    public boolean canDelete;

    public Long getId() {
        return id;
    }

    public Long getAuthorId() {
        return authorId;
    }

    public String getAuthorUsername() {
        return authorUsername;
    }

    public String getContent() {
        return content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public boolean isCanDelete() {
        return canDelete;
    }
}
