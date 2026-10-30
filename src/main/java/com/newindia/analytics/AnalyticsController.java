package com.newindia.analytics;

import com.newindia.issue.Issue;
import com.newindia.issue.IssueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {
    private final IssueRepository issueRepository;

    @GetMapping("/summary")
    public Map<String, Long> getSummary() {
        List<Issue> issues = issueRepository.findAll();
        Map<String, Long> stats = new HashMap<>();
        
        stats.put("totalReported", (long) issues.size());
        stats.put("pending", issues.stream().filter(i -> i.getStatus() == com.newindia.issue.IssueStatus.PENDING).count());
        stats.put("resolvedByGovt", issues.stream().filter(i -> i.getResolutionSource() == com.newindia.issue.ResolutionSource.GOVERNMENT_RESOLVED).count());
        stats.put("resolvedByCommunity", issues.stream().filter(i -> i.getResolutionSource() == com.newindia.issue.ResolutionSource.COMMUNITY_RESOLVED).count());
        
        return stats;
    }
}