package com.newindia.issue;

import com.newindia.department.Department;
import com.newindia.location.Location;
import com.newindia.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "issues")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Issue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    private IssueCategory category;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private IssueStatus status = IssueStatus.PENDING;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private ResolutionSource resolutionSource = ResolutionSource.PENDING;

    @ManyToOne
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @ManyToOne
    @JoinColumn(name = "reporter_id", nullable = false)
    private User reporter;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department assignedDepartment;

    private LocalDateTime reportedAt;
    private LocalDateTime resolvedAt;

    @PrePersist
    protected void onCreate() { reportedAt = LocalDateTime.now(); }
}
