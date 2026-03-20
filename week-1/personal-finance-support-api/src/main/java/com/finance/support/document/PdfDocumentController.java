package com.finance.support.document;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/support/documents")
@Validated
public class PdfDocumentController {

    private final PdfDocumentService pdfDocumentService;

    public PdfDocumentController(PdfDocumentService pdfDocumentService) {
        this.pdfDocumentService = pdfDocumentService;
    }

    @PostMapping(path = "/reports/pdf", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<byte[]> generateReportPdf(@RequestBody GenerateReportPdfRequest request) {
        byte[] document = pdfDocumentService.generateReportPdf(request);
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=finance-report-preview.pdf")
            .contentType(MediaType.APPLICATION_PDF)
            .body(document);
    }
}
