package com.minemind.digitaltwin.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.minemind.digitaltwin.dto.DigitalTwinStateDto;
import com.minemind.digitaltwin.service.DigitalTwinService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
@RequiredArgsConstructor
public class SimulationWebSocketHandler extends TextWebSocketHandler {

    private final DigitalTwinService digitalTwinService;
    private final ObjectMapper objectMapper;
    private final Set<WebSocketSession> sessions = ConcurrentHashMap.newKeySet();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        sessions.add(session);
        log.info("Digital twin simulation WebSocket client connected: {}", session.getId());
        try {
            DigitalTwinStateDto state = digitalTwinService.getSnapshot();
            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(state)));
        } catch (IOException e) {
            log.error("Failed to send initial simulation state", e);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.remove(session);
        log.info("Digital twin simulation WebSocket client disconnected: {}", session.getId());
    }

    public void broadcastState() {
        if (sessions.isEmpty()) {
            return;
        }
        DigitalTwinStateDto state = digitalTwinService.getSnapshot();
        try {
            String payload = objectMapper.writeValueAsString(state);
            TextMessage message = new TextMessage(payload);
            for (WebSocketSession session : sessions) {
                if (session.isOpen()) {
                    session.sendMessage(message);
                }
            }
        } catch (Exception e) {
            log.error("Failed to broadcast digital twin state frame", e);
        }
    }
}
