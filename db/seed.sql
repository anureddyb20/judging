-- ==============================================================================
-- VICEVERSE SEED DATA SCRIPT
-- ==============================================================================

-- 1. Insert Event Settings
INSERT INTO public.event_settings (
    id, event_name, event_phase, submission_deadline, judging_deadline, scoring_method,
    show_live_score, show_rubric_breakdown, show_judge_identity, show_rank, show_leaderboard,
    anonymous_judging, submissions_locked, results_locked
) VALUES (
    1,
    'VICEVERSE // THE ULTIMATE INNOVATION HEIST',
    'ACTIVE',
    NOW() + INTERVAL '4 hours',
    NOW() + INTERVAL '8 hours',
    'average',
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    TRUE,
    FALSE,
    FALSE,
    FALSE
) ON CONFLICT (id) DO NOTHING;

-- 2. Insert Missions
INSERT INTO public.missions (id, code, title, category, description, core_focus, badge_color, icon_name)
VALUES
(
    'a0000000-0000-0000-0000-000000000001',
    'MSN-AI',
    'AGENTIC AI',
    'IT',
    'Moving beyond simple chatbots to build autonomous AI agents that can think, plan, use tools, and execute complex workflows without constant human intervention.',
    '["Autonomous LLM workflows", "Multi-agent systems", "Task automation", "Decision-making systems"]'::jsonb,
    '#fdbf15',
    'cpu'
),
(
    'a0000000-0000-0000-0000-000000000002',
    'MSN-SEC',
    'CYBER SECURITY',
    'IT',
    'Securing the digital perimeter. Identifying vulnerabilities, auditing system architectures, and mitigating threats before malicious actors can exploit them.',
    '["Network security", "Penetration testing", "Cryptography", "Secure web architecture", "Threat detection"]'::jsonb,
    '#ff007f',
    'shield'
),
(
    'a0000000-0000-0000-0000-000000000003',
    'MSN-CV',
    'COMPUTER VISION',
    'IT',
    'Enabling machines to "see" and interpret visual data from the world, transforming raw pixels into actionable spatial intelligence.',
    '["Object tracking", "Image classification", "Facial recognition", "Real-time video analytics", "Spatial computing"]'::jsonb,
    '#00f0ff',
    'eye'
),
(
    'a0000000-0000-0000-0000-000000000004',
    'MSN-ROB',
    'ROBOTICS & DRONES',
    'NON-IT',
    'Designing and controlling autonomous physical machines capable of navigating environments, manipulating objects, or automating manual workflows.',
    '["Kinematics", "Drone navigation algorithms", "Micro-controller integration", "Sensor telemetry", "Mechanical automation"]'::jsonb,
    '#39ff14',
    'bot'
),
(
    'a0000000-0000-0000-0000-000000000005',
    'MSN-IOT',
    'EMBEDDED & COGNITIVE TECH',
    'NON-IT',
    'Merging intelligence with hardware by deploying smart algorithms directly onto resource-constrained microcontrollers and edge hardware.',
    '["Edge AI/TinyML", "IoT architectures (ESP32/Pi)", "Real-time data collection", "Low-power hardware automation"]'::jsonb,
    '#ff5e00',
    'circuit-board'
),
(
    'a0000000-0000-0000-0000-000000000006',
    'MSN-VLSI',
    'VLSI SYSTEMS',
    'NON-IT',
    'Operating at the silicon level. Designing, simulating, and validating massive integrated circuits that pack thousands of logical components onto a single microchip.',
    '["Verilog/VHDL simulation", "Digital system design", "FPGA prototyping", "Semiconductor logic optimization"]'::jsonb,
    '#bf00ff',
    'cpu'
)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Default Rubric and Criteria
INSERT INTO public.rubrics (id, name, is_active, scoring_method)
VALUES (
    'b0000000-0000-0000-0000-000000000001',
    'VICEVERSE OFFICIAL HEIST RUBRIC v1.0',
    TRUE,
    'average'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.rubric_criteria (id, rubric_id, name, description, max_marks, weight, order_index)
VALUES
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Innovation & Novelty', 'Uniqueness of the concept, creative approach to solving the problem, differentiation from existing solutions.', 20.00, 1.0, 1),
('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'Technical Feasibility & Architecture', 'Soundness of technical stack, architectural robustness, scalability, and code quality/simulation depth.', 20.00, 1.0, 2),
('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'Practical Impact & Utility', 'Real-world applicability, problem severity addressed, clear value proposition for users or industry.', 20.00, 1.0, 3),
('c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000001', 'Prototype Execution & Demo', 'Completeness of working prototype, polish of UI/UX or hardware integration, stability during demonstration.', 20.00, 1.0, 4),
('c0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000001', 'Pitch & Presentation Clarity', 'Clear articulation of the solution, effective delivery, concise defense against judge questions.', 20.00, 1.0, 5)
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Schedule
INSERT INTO public.event_schedule (id, phase_number, phase_name, time_slot, date_slot, description, order_index)
VALUES
('d0000000-0000-0000-0000-000000000001', 'PHASE 1', 'ENTRY INFILTRATION', 'Closes June 22', 'June 22', 'Operatives must register their crews and secure cognitive branch clearance before the gates close.', 1),
('d0000000-0000-0000-0000-000000000002', 'PHASE 2', 'BRIEFING & INTEL DROP', '09:00 AM - 10:30 AM', 'June 23', 'On-site check-in, syndicate badge allocation, and declassification of secret challenges.', 2),
('d0000000-0000-0000-0000-000000000003', 'PHASE 3', 'THE HEIST BEGINS', '10:30 AM - 02:00 PM', 'June 23', 'High-stakes ideation session. Squads conceptualize, design, and compile their pitch decks.', 3),
('d0000000-0000-0000-0000-000000000004', 'PHASE 4', 'OPERATIVE MENTORING', '02:00 PM - 04:00 PM', 'June 23', 'Crews present prototypes to syndicate mentors for real-time tactical feedback and refinement.', 4),
('d0000000-0000-0000-0000-000000000005', 'PHASE 5', 'THE FINAL PITCH', '04:00 PM onwards', 'June 23', 'Demolition pitch before the syndicate judges. Best solutions secure the bounties.', 5)
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Initial Announcements
INSERT INTO public.announcements (id, title, content, priority, created_at)
VALUES
('e0000000-0000-0000-0000-000000000001', 'SYSTEM INITIALIZED', 'Welcome Operatives to VICEVERSE 2026. All submission channels and rubric telemetry are now live.', 'info', NOW()),
('e0000000-0000-0000-0000-000000000002', 'ROUND 1 JUDGING ACTIVE', 'Syndicate Judges are currently reviewing tactical submissions. Monitor your live score HUD for real-time mark updates.', 'warning', NOW())
ON CONFLICT (id) DO NOTHING;
