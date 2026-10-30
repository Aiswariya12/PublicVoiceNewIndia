package com.newindia.issue.dto;
import com.newindia.issue.*;
import java.time.LocalDateTime;

public record IssueResponse(
    Long id, String title, String description, IssueCategory category,
    IssueStatus status, ResolutionSource resolutionSource, 
    String locationName, String reporterName, LocalDateTime reportedAt
) {}