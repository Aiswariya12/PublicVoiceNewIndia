package com.newindia.issue;

import com.newindia.common.exception.ResourceNotFoundException;
import com.newindia.department.Department;
import com.newindia.department.DepartmentRepository;
import com.newindia.issue.dto.CreateIssueRequest;
import com.newindia.issue.dto.IssueResponse;
import com.newindia.location.Location;
import com.newindia.location.LocationRepository;
import com.newindia.user.User;
import com.newindia.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IssueService {

    private final IssueRepository issueRepository;
    private final LocationRepository locationRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final IssueTimelineRepository timelineRepository;

    public IssueResponse reportIssue(CreateIssueRequest request, String userEmail) {
        User reporter = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Location location = locationRepository.findById(request.locationId())
                .orElseThrow(() -> new ResourceNotFoundException("Location not found"));

        Issue issue = Issue.builder()
                .title(request.title())
                .description(request.description())
                .category(request.category())
                .location(location)
                .reporter(reporter)
                .build();

        issueRepository.save(issue);
        logTimeline(issue, IssueStatus.PENDING, "Issue reported by citizen", reporter);
        return mapToResponse(issue);
    }

    @Transactional
    public IssueResponse verifyIssue(Long issueId, String verifierEmail) {
        Issue issue = issueRepository.findById(issueId).orElseThrow();
        User verifier = userRepository.findByEmail(verifierEmail).orElseThrow();

        issue.setStatus(IssueStatus.VERIFIED);
        issueRepository.save(issue);
        logTimeline(issue, IssueStatus.VERIFIED, "Issue verified as valid", verifier);
        return mapToResponse(issue);
    }

    @Transactional
    public IssueResponse resolveIssue(Long issueId, String sourceStr, Long departmentId, String officerEmail) {
        Issue issue = issueRepository.findById(issueId).orElseThrow();
        User officer = userRepository.findByEmail(officerEmail).orElseThrow();

        issue.setStatus(IssueStatus.RESOLVED);
        issue.setResolutionSource(ResolutionSource.valueOf(sourceStr.toUpperCase()));
        issue.setResolvedAt(LocalDateTime.now());

        if (departmentId != null) {
            Department dept = departmentRepository.findById(departmentId).orElse(null);
            issue.setAssignedDepartment(dept);
        }

        issueRepository.save(issue);
        logTimeline(issue, IssueStatus.RESOLVED, "Issue resolved by " + sourceStr, officer);
        return mapToResponse(issue);
    }

    public IssueResponse createIssue(CreateIssueRequest request, String userEmail) {
        return reportIssue(request, userEmail);
    }

    public IssueResponse updateStatus(Long issueId, IssueStatus newStatus) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found"));
        issue.setStatus(newStatus);
        issueRepository.save(issue);
        return mapToResponse(issue);
    }

    public List<IssueResponse> getAllIssues() {
        return issueRepository.findAll().stream().map(this::mapToResponse).toList();
    }

    private void logTimeline(Issue issue, IssueStatus status, String notes, User actor) {
        timelineRepository.save(IssueTimeline.builder()
                .issue(issue).status(status).notes(notes).actionBy(actor).build());
    }

    private IssueResponse mapToResponse(Issue issue) {
        return new IssueResponse(
            issue.getId(), issue.getTitle(), issue.getDescription(), issue.getCategory(),
            issue.getStatus(), issue.getResolutionSource(), issue.getLocation().getName(),
            issue.getReporter().getFullName(), issue.getReportedAt()
        );
    }
}