package com.newindia.media;

import com.newindia.issue.Issue;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "issue_media")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class IssueMedia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "issue_id", nullable = false)
    private Issue issue;

    @Column(nullable = false)
    private String fileUrl; // e.g., "/uploads/photo123.jpg"

    @Column(nullable = false)
    private String mediaType; // BEFORE_PHOTO, AFTER_RESOLUTION, COMMUNITY_PROGRESS

    private LocalDateTime uploadedAt;

    @PrePersist
    protected void onCreate() { uploadedAt = LocalDateTime.now(); }
}