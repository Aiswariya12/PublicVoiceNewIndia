package com.newindia.issue;

import com.newindia.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "issue_timeline")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class IssueTimeline {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "issue_id", nullable = false)
    private Issue issue;

    @Enumerated(EnumType.STRING)
    private IssueStatus status; // What the status became

    private String notes; // e.g., "Verified by officer"

    @ManyToOne
    @JoinColumn(name = "action_by")
    private User actionBy; // Who did it

    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() { timestamp = LocalDateTime.now(); }
}