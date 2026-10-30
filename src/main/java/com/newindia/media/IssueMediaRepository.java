package com.newindia.media;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface IssueMediaRepository extends JpaRepository<IssueMedia, Long> {
    List<IssueMedia> findByIssueId(Long issueId);
}