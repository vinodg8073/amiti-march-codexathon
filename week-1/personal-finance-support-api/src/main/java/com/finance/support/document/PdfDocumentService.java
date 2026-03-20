package com.finance.support.document;

import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;

@Service
public class PdfDocumentService {

    public byte[] generateReportPdf(GenerateReportPdfRequest request) {
        String preview = "PDF placeholder for report: " + request.reportName() + " | rows=" + request.rows().size();
        return preview.getBytes(StandardCharsets.UTF_8);
    }
}
