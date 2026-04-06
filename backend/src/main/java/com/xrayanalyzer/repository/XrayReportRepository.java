package com.xrayanalyzer.repository;

import com.xrayanalyzer.model.XrayReport;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface XrayReportRepository 
    extends JpaRepository<XrayReport, Long> {
    List<XrayReport> findAllByOrderByAnalyzedAtDesc();
}