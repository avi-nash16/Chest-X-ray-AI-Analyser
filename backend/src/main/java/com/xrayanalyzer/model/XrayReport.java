package com.xrayanalyzer.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "xray_reports")
@Data
public class XrayReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String patientName;
    private String patientAge;
    private String prediction;
    private Double confidence;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String probabilities;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String aiReport;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String heatmapBase64;

    private String imagePath;
    private LocalDateTime analyzedAt;
    private Boolean doctorReviewed = false;
}