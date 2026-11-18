
package com.documind_backend.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.documind_backend.dto.ChatMessageResponse;
import com.documind_backend.dto.ConversationResponse;
import com.documind_backend.repository.AIConversationRepository;
import com.documind_backend.repository.ChatMessageRepository;

@RestController
@RequestMapping("/api/ai/conversations")
public class ConversationController {

    private final AIConversationRepository conversationRepository;
    private final ChatMessageRepository chatMessageRepository;

    public ConversationController(
            AIConversationRepository conversationRepository,
            ChatMessageRepository chatMessageRepository
    ) {
        this.conversationRepository = conversationRepository;
        this.chatMessageRepository = chatMessageRepository;
    }

    // Get all saved conversations
    @GetMapping
    public List<ConversationResponse> getConversations() {

        return conversationRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(conversation -> new ConversationResponse(
                        conversation.getConversationId(),
                        conversation.getDocumentId(),
                        conversation.getCreatedAt()
                ))
                .toList();
    }

    // Get all messages of a particular conversation
    @GetMapping("/{conversationId}/messages")
    public List<ChatMessageResponse> getMessages(
            @PathVariable UUID conversationId
    ) {

        if (!conversationRepository.existsByConversationId(conversationId)) {
            throw new RuntimeException("Conversation not found");
        }

        return chatMessageRepository
                .findByConversationIdOrderByCreatedAtAsc(conversationId)
                .stream()
                .map(message -> new ChatMessageResponse(
                        message.getId(),
                        message.getRole(),
                        message.getContent(),
                        message.getCreatedAt()
                ))
                .toList();
    }
}
