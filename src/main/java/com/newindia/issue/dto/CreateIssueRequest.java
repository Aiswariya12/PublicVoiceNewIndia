package com.newindia.issue.dto;
import com.newindia.issue.IssueCategory;

public record CreateIssueRequest(String title, String description, IssueCategory category, Long locationId) {}