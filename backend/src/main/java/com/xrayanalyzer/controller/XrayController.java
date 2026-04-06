package com.xrayanalyzer.controller;

import com.xrayanalyzer.model.XrayReport;
import com.xrayanalyzer.repository.XrayReportRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/xray")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class XrayController {

    private final XrayReportRepository reportRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${python.ai.url}")
    private String pythonAiUrl;

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("X-Ray Analyzer API running!");
    }

    @PostMapping("/analyze")
    public ResponseEntity<XrayReport> analyzeXray(
            @RequestParam("image") MultipartFile imageFile,
            @RequestParam String patientName,
            @RequestParam String patientAge) {

        try {
            // Send image to Python AI
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = 
                new LinkedMultiValueMap<>();
            body.add("file", new ByteArrayResource(
                imageFile.getBytes()) {
                @Override
                public String getFilename() {
                    return imageFile.getOriginalFilename();
                }
            });

            HttpEntity<MultiValueMap<String, Object>> request =
                new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                pythonAiUrl + "/analyze",
                HttpMethod.POST,
                request,
                Map.class
            );

            Map<String, Object> aiResult = response.getBody();

            // Save to DB
            XrayReport report = new XrayReport();
            report.setPatientName(patientName);
            report.setPatientAge(patientAge);
            report.setPrediction((String) aiResult.get("prediction"));
            report.setConfidence(
                ((Number) aiResult.get("confidence")).doubleValue()
            );
            report.setProbabilities(
                objectMapper.writeValueAsString(
                    aiResult.get("probabilities")
                )
            );
            report.setAiReport((String) aiResult.get("report"));
            report.setHeatmapBase64((String) aiResult.get("heatmap"));
            report.setAnalyzedAt(LocalDateTime.now());

            XrayReport saved = reportRepository.save(report);
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/reports")
    public ResponseEntity<List<XrayReport>> getAllReports() {
        return ResponseEntity.ok(
            reportRepository.findAllByOrderByAnalyzedAtDesc()
        );
    }

    @GetMapping("/reports/{id}")
    public ResponseEntity<XrayReport> getReport(
            @PathVariable Long id) {
        return reportRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/reports/{id}/review")
    public ResponseEntity<XrayReport> markReviewed(
            @PathVariable Long id) {
        return reportRepository.findById(id)
            .map(report -> {
                report.setDoctorReviewed(true);
                return ResponseEntity.ok(
                    reportRepository.save(report)
                );
            })
            .orElse(ResponseEntity.notFound().build());
    }
}