package com.newindia.issue;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueTimelineRepository extends JpaRepository<IssueTimeline, Long> {
    List<IssueTimeline> findByIssueIdOrderByTimestampAsc(Long issueId);
}
