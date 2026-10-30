package com.newindia.issue;

import com.newindia.issue.dto.CreateIssueRequest;
import com.newindia.issue.dto.IssueResponse;
import com.newindia.issue.dto.UpdateStatusRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
@RequiredArgsConstructor
public class IssueController {

    private final IssueService issueService;

    // 1. Citizen reports an issue
    @PostMapping
    public ResponseEntity<IssueResponse> reportIssue(@RequestBody CreateIssueRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(issueService.createIssue(request, email));
    }

    // 2. View all issues
    @GetMapping
    public ResponseEntity<List<IssueResponse>> getAllIssues() {
        return ResponseEntity.ok(issueService.getAllIssues());
    }

    // 3. Officer updates the status
    @PutMapping("/{id}/status")
    public ResponseEntity<IssueResponse> updateStatus(
            @PathVariable Long id, 
            @RequestBody UpdateStatusRequest request) {
        
        return ResponseEntity.ok(issueService.updateStatus(id, request.status()));
    }
}