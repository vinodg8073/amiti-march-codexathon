package com.finance.support.document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;
import java.util.Map;

public record GenerateReportPdfRequest(
    @NotBlank String userId,
    @NotBlank String reportName,
    @NotEmpty List<Map<String, Object>> rows
) {
}
