
package com.documind_backend.dto;

public record DashboardStatsResponse(
        long totalDocuments,
        long aiConversations,
        long studySessions
) {}
