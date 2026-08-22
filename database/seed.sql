-- Seed data for demo project
-- This creates a demo project with realistic fake data

-- Create demo user (password: admin123)
INSERT INTO users (id, username, email, hashed_password, is_active, is_admin, role, created_at, updated_at)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'admin',
    'admin@recon.local',
    '$2b$12$LJ3m4ys4Ht0itNQ.GQxJCep9NlTq5WqQd8q1qFqFqFqFqFqFqFqFq',
    true,
    true,
    'admin',
    NOW(),
    NOW()
) ON CONFLICT DO NOTHING;

-- Create demo project
INSERT INTO projects (id, name, description, owner_id, is_active, created_at, updated_at)
VALUES (
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    'Demo Project',
    'Simulated reconnaissance project for demo.local - ALL DATA IS FAKE',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    true,
    NOW(),
    NOW()
) ON CONFLICT DO NOTHING;

-- Create demo targets
INSERT INTO targets (id, project_id, value, target_type, status, tags, scope_confirmed, scan_profile, created_at, updated_at)
VALUES
    ('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'demo.local', 'domain', 'active', '["demo", "ctf"]', true, 'standard_pentest', NOW(), NOW()),
    ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a34', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'api.demo.local', 'domain', 'active', '["api"]', true, 'standard_pentest', NOW(), NOW()),
    ('c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a35', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'dev.demo.local', 'domain', 'active', '["dev"]', true, 'quick', NOW(), NOW()),
    ('c4eebc99-9c0b-4ef8-bb6d-6bb9bd380a36', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'mail.demo.local', 'domain', 'active', '["mail"]', true, 'standard_pentest', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Create demo scan jobs
INSERT INTO scan_jobs (id, scan_id, project_id, target_id, scan_type, profile, status, progress, current_stage, started_at, completed_at, created_at)
VALUES
    ('d1eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'SCAN-2026-000001', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'full', 'standard_pentest', 'completed', 100, 'done', NOW() - INTERVAL '5 minutes', NOW() - INTERVAL '2 minutes', NOW() - INTERVAL '5 minutes'),
    ('d2eebc99-9c0b-4ef8-bb6d-6bb9bd380a45', 'SCAN-2026-000002', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a34', 'passive', 'passive_only', 'completed', 100, 'done', NOW() - INTERVAL '10 minutes', NOW() - INTERVAL '8 minutes', NOW() - INTERVAL '10 minutes')
ON CONFLICT DO NOTHING;

-- Create demo subdomains
INSERT INTO subdomains (id, scan_id, project_id, target_id, hostname, resolved_ip, http_status, title, technology, source, is_alive, created_at)
VALUES
    ('e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'SCAN-2026-000001', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'www.demo.local', '10.0.0.2', 200, 'Demo Corp - Welcome', 'Nginx', 'dns', true, NOW()),
    ('e2eebc99-9c0b-4ef8-bb6d-6bb9bd380a56', 'SCAN-2026-000001', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'api.demo.local', '10.0.0.5', 200, 'API Gateway', 'Nginx', 'dns', true, NOW()),
    ('e3eebc99-9c0b-4ef8-bb6d-6bb9bd380a57', 'SCAN-2026-000001', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'dev.demo.local', '10.0.0.8', 200, 'Dev Environment', 'Apache', 'dns', true, NOW()),
    ('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a58', 'SCAN-2026-000001', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'mail.demo.local', '10.0.0.9', 200, 'Webmail', 'Dovecot', 'dns', true, NOW()),
    ('e5eebc99-9c0b-4ef8-bb6d-6bb9bd380a59', 'SCAN-2026-000001', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'vpn.demo.local', '10.0.0.15', NULL, NULL, NULL, 'crt.sh', false, NOW()),
    ('e6eebc99-9c0b-4ef8-bb6d-6bb9bd380a60', 'SCAN-2026-000001', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'portal.demo.local', '10.0.0.20', 302, 'Login Portal', 'Laravel', 'dns', true, NOW()),
    ('e7eebc99-9c0b-4ef8-bb6d-6bb9bd380a61', 'SCAN-2026-000001', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'staging.demo.local', '10.0.0.25', 401, 'Staging Server', 'Nginx', 'dns', true, NOW())
ON CONFLICT DO NOTHING;

-- Create demo ports
INSERT INTO ports (id, scan_id, project_id, target_id, host, ip_address, port_number, protocol, state, service_name, version, source, created_at)
VALUES
    ('f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a62', 'SCAN-2026-000001', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', '10.0.0.2', '10.0.0.2', 22, 'tcp', 'open', 'SSH', 'OpenSSH 8.9', 'nmap', NOW()),
    ('f2eebc99-9c0b-4ef8-bb6d-6bb9bd380a63', 'SCAN-2026-000001', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', '10.0.0.2', '10.0.0.2', 80, 'tcp', 'open', 'HTTP', 'nginx/1.24.0', 'nmap', NOW()),
    ('f3eebc99-9c0b-4ef8-bb6d-6bb9bd380a64', 'SCAN-2026-000001', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', '10.0.0.2', '10.0.0.2', 443, 'tcp', 'open', 'HTTPS', 'nginx/1.24.0', 'nmap', NOW()),
    ('f4eebc99-9c0b-4ef8-bb6d-6bb9bd380a65', 'SCAN-2026-000001', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', '10.0.0.5', '10.0.0.5', 443, 'tcp', 'open', 'HTTPS', 'nginx/1.24.0', 'nmap', NOW()),
    ('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'SCAN-2026-000001', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', '10.0.0.5', '10.0.0.5', 8080, 'tcp', 'open', 'HTTP', 'nginx/1.24.0', 'nmap', NOW()),
    ('f6eebc99-9c0b-4ef8-bb6d-6bb9bd380a67', 'SCAN-2026-000001', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', '10.0.0.8', '10.0.0.8', 22, 'tcp', 'open', 'SSH', 'OpenSSH 8.9', 'nmap', NOW()),
    ('f7eebc99-9c0b-4ef8-bb6d-6bb9bd380a68', 'SCAN-2026-000001', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', '10.0.0.8', '10.0.0.8', 80, 'tcp', 'open', 'HTTP', 'Apache/2.4.57', 'nmap', NOW()),
    ('f8eebc99-9c0b-4ef8-bb6d-6bb9bd380a69', 'SCAN-2026-000001', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', '10.0.0.8', '10.0.0.8', 3306, 'tcp', 'open', 'MySQL', 'MySQL 8.0.35', 'nmap', NOW()),
    ('f9eebc99-9c0b-4ef8-bb6d-6bb9bd380a70', 'SCAN-2026-000001', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', '10.0.0.9', '10.0.0.9', 25, 'tcp', 'open', 'SMTP', 'Postfix', 'nmap', NOW()),
    ('faeebc99-9c0b-4ef8-bb6d-6bb9bd380a71', 'SCAN-2026-000001', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', '10.0.0.9', '10.0.0.9', 993, 'tcp', 'open', 'IMAPS', 'Dovecot', 'nmap', NOW()),
    ('fbeebc99-9c0b-4ef8-bb6d-6bb9bd380a72', 'SCAN-2026-000001', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', '10.0.0.9', '10.0.0.9', 995, 'tcp', 'open', 'POP3S', 'Dovecot', 'nmap', NOW())
ON CONFLICT DO NOTHING;

-- Create demo technologies
INSERT INTO technologies (id, scan_id, project_id, target_id, host, technology_name, version, category, evidence, confidence, source, created_at)
VALUES
    ('fa1ebc99-9c0b-4ef8-bb6d-6bb9bd380a73', 'SCAN-2026-000001', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'www.demo.local', 'Nginx', '1.24.0', 'web_server', 'Server: nginx/1.24.0', 95, 'whatweb', NOW()),
    ('fa2ebc99-9c0b-4ef8-bb6d-6bb9bd380a74', 'SCAN-2026-000001', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'www.demo.local', 'PHP', '8.2', 'language', 'X-Powered-By: PHP/8.2.15', 80, 'whatweb', NOW()),
    ('fa3ebc99-9c0b-4ef8-bb6d-6bb9bd380a75', 'SCAN-2026-000001', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'api.demo.local', 'Nginx', '1.24.0', 'web_server', 'Server: nginx/1.24.0', 95, 'whatweb', NOW()),
    ('fa4ebc99-9c0b-4ef8-bb6d-6bb9bd380a76', 'SCAN-2026-000001', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'api.demo.local', 'Node.js', '18.19', 'language', 'X-Powered-By: Express', 85, 'whatweb', NOW()),
    ('fa5ebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'SCAN-2026-000001', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'dev.demo.local', 'Apache', '2.4.57', 'web_server', 'Server: Apache/2.4.57', 90, 'whatweb', NOW()),
    ('fa6ebc99-9c0b-4ef8-bb6d-6bb9bd380a78', 'SCAN-2026-000001', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'dev.demo.local', 'WordPress', '6.4.2', 'cms', 'wp-content/themes/...', 95, 'whatweb', NOW()),
    ('fa7ebc99-9c0b-4ef8-bb6d-6bb9bd380a79', 'SCAN-2026-000001', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'portal.demo.local', 'Laravel', '10', 'framework', 'X-Powered-By: Laravel', 80, 'whatweb', NOW()),
    ('fa8ebc99-9c0b-4ef8-bb6d-6bb9bd380a80', 'SCAN-2026-000001', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'www.demo.local', 'Let''s Encrypt', NULL, 'ssl', 'Certificate Issuer: Let''s Encrypt Authority X3', 100, 'tls', NOW())
ON CONFLICT DO NOTHING;

-- Create demo findings
INSERT INTO findings (id, scan_id, project_id, target_id, title, description, severity, asset, asset_type, evidence, detection_method, confidence, status, created_at)
VALUES
    ('fb1ebc99-9c0b-4ef8-bb6d-6bb9bd380a81', 'SCAN-2026-000001', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'MySQL Port Exposed', 'MySQL database port 3306 is accessible from external network', 'medium', '10.0.0.8:3306', 'port', 'Port 3306 open on 10.0.0.8 running MySQL 8.0.35', 'nmap', 90, 'open', NOW()),
    ('fb2ebc99-9c0b-4ef8-bb6d-6bb9bd380a82', 'SCAN-2026-000001', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Staging Environment Accessible', 'Staging server at staging.demo.local returns 401 but is accessible', 'low', 'staging.demo.local', 'subdomain', 'HTTP 401 response from staging.demo.local', 'httpx', 70, 'open', NOW()),
    ('fb3ebc99-9c0b-4ef8-bb6d-6bb9bd380a83', 'SCAN-2026-000001', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Development Server Exposed', 'Development environment accessible at dev.demo.local', 'low', 'dev.demo.local', 'subdomain', 'HTTP 200 from dev.demo.local - WordPress 6.4.2', 'httpx', 85, 'open', NOW()),
    ('fb4ebc99-9c0b-4ef8-bb6d-6bb9bd380a84', 'SCAN-2026-000001', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Server Version Disclosure', 'Web server headers disclose version information', 'informational', 'www.demo.local', 'service', 'Server: nginx/1.24.0', 'httpx', 95, 'open', NOW()),
    ('fb5ebc99-9c0b-4ef8-bb6d-6bb9bd380a85', 'SCAN-2026-000001', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'PHP Version Disclosure', 'X-Powered-By header reveals PHP version', 'informational', 'www.demo.local', 'service', 'X-Powered-By: PHP/8.2.15', 'httpx', 90, 'open', NOW()),
    ('fb6ebc99-9c0b-4ef8-bb6d-6bb9bd380a86', 'SCAN-2026-000001', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'API Debug Endpoint Detected', 'Development API endpoint accessible on production server', 'medium', 'api.demo.local:8080', 'url', 'HTTP 200 on http://api.demo.local:8080/debug', 'httpx', 75, 'open', NOW())
ON CONFLICT DO NOTHING;

-- Create demo DNS records
INSERT INTO dns_records (id, scan_id, project_id, target_id, domain, record_type, record_value, ttl, source, created_at)
VALUES
    ('fc1ebc99-9c0b-4ef8-bb6d-6bb9bd380a87', 'SCAN-2026-000001', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'demo.local', 'A', '10.0.0.2', 3600, 'dns', NOW()),
    ('fc2ebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 'SCAN-2026-000001', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'demo.local', 'AAAA', '2001:db8::1', 3600, 'dns', NOW()),
    ('fc3ebc99-9c0b-4ef8-bb6d-6bb9bd380a89', 'SCAN-2026-000001', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'demo.local', 'MX', 'mail.demo.local', 3600, 'dns', NOW()),
    ('fc4ebc99-9c0b-4ef8-bb6d-6bb9bd380a90', 'SCAN-2026-000001', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'demo.local', 'NS', 'ns1.demo.local', 86400, 'dns', NOW()),
    ('fc5ebc99-9c0b-4ef8-bb6d-6bb9bd380a91', 'SCAN-2026-000001', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'demo.local', 'TXT', 'v=spf1 include:_spf.demo.local ~all', 3600, 'dns', NOW()),
    ('fc6ebc99-9c0b-4ef8-bb6d-6bb9bd380a92', 'SCAN-2026-000001', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'demo.local', 'SOA', 'ns1.demo.local admin.demo.local 2024010101 3600 900 604800 86400', 86400, 'dns', NOW())
ON CONFLICT DO NOTHING;
