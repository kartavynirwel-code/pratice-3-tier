package com.practice.tasktracker;

import java.net.InetAddress;
import java.sql.Connection;
import java.util.LinkedHashMap;
import java.util.Map;
import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class SystemController {

    private final DataSource dataSource;
    private final String env;
    private final String dbHost;
    private final String dbPort;
    private final String serverPort;

    public SystemController(DataSource dataSource,
                            @Value("${app.env}") String env,
                            @Value("${app.db-host}") String dbHost,
                            @Value("${app.db-port}") String dbPort,
                            @Value("${server.port}") String serverPort) {
        this.dataSource = dataSource;
        this.env = env;
        this.dbHost = dbHost;
        this.dbPort = dbPort;
        this.serverPort = serverPort;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        boolean dbUp = dbReachable();
        Map<String, String> body = new LinkedHashMap<>();
        body.put("status", dbUp ? "UP" : "DOWN");
        body.put("db", dbUp ? "UP" : "DOWN");
        return ResponseEntity.status(dbUp ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE).body(body);
    }

    @GetMapping("/info")
    public Map<String, Object> info() throws Exception {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("hostname", InetAddress.getLocalHost().getHostName());
        body.put("environment", env);
        body.put("serverPort", serverPort);
        body.put("dbHost", dbHost);
        body.put("dbPort", dbPort);
        body.put("dbReachable", dbReachable());
        body.put("javaVersion", System.getProperty("java.version"));
        return body;
    }

    private boolean dbReachable() {
        try (Connection c = dataSource.getConnection()) {
            return c.isValid(2);
        } catch (Exception e) {
            return false;
        }
    }
}
