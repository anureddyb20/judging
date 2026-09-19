// ==============================================================================
// VICEVERSE DEFAULT DATA & SEED STATE
// ==============================================================================

export const INITIAL_EVENT_SETTINGS = {
  id: 1,
  event_name: 'VICEVERSE // THE ULTIMATE INNOVATION HEIST',
  event_phase: 'JUDGING', // 'UPCOMING' | 'REGISTRATION' | 'ACTIVE' | 'SUBMISSION' | 'JUDGING' | 'RESULTS' | 'COMPLETED'
  submission_deadline: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
  judging_deadline: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
  scoring_method: 'average', // 'average' | 'weighted' | 'sum'
  show_live_score: true,
  show_rubric_breakdown: true,
  show_judge_identity: false,
  show_rank: true,
  show_leaderboard: true,
  anonymous_judging: false,
  submissions_locked: false,
  results_locked: false,
  updated_at: new Date().toISOString()
};

export const INITIAL_MISSIONS = [
  {
    id: 'm1',
    code: 'MSN-AI',
    title: 'AGENTIC AI',
    category: 'IT',
    description: 'Moving beyond simple chatbots to build autonomous AI agents that can think, plan, use tools, and execute complex multi-step workflows without constant human intervention.',
    core_focus: ['Autonomous LLM workflows', 'Multi-agent systems', 'Tool calling & API execution', 'Self-correcting code engines'],
    badge_color: '#fdbf15',
    icon_name: 'Cpu'
  },
  {
    id: 'm2',
    code: 'MSN-SEC',
    title: 'CYBER SECURITY',
    category: 'IT',
    description: 'Securing the digital perimeter. Identifying zero-day vulnerabilities, auditing decentralized architectures, and neutralizing cyber-heist vectors.',
    core_focus: ['Penetration testing suites', 'Autonomous threat detection', 'Zero-trust auth protocols', 'Smart contract auditing'],
    badge_color: '#ff007f',
    icon_name: 'Shield'
  },
  {
    id: 'm3',
    code: 'MSN-CV',
    title: 'COMPUTER VISION',
    category: 'IT',
    description: 'Enabling machines to perceive and interpret visual data from high-risk environments, converting raw streams into instant spatial intelligence.',
    core_focus: ['Real-time object tracking', 'Drone vision analytics', 'Facial & biometric recognition', 'Edge-based image classification'],
    badge_color: '#00f0ff',
    icon_name: 'Eye'
  },
  {
    id: 'm4',
    code: 'MSN-ROB',
    title: 'ROBOTICS & DRONES',
    category: 'NON-IT',
    description: 'Designing autonomous physical machines and aerial swarm drones capable of navigating hazardous terrains and automated payload transport.',
    core_focus: ['Autonomous drone navigation', 'Kinematics & swarm logic', 'Telemetry relay hardware', 'Obstacle avoidance lidar'],
    badge_color: '#39ff14',
    icon_name: 'Bot'
  },
  {
    id: 'm5',
    code: 'MSN-IOT',
    title: 'EMBEDDED & COGNITIVE TECH',
    category: 'NON-IT',
    description: 'Merging silicon with cognitive computing by deploying ultra low-power TinyML models directly onto embedded hardware and IoT meshes.',
    core_focus: ['Edge AI / TinyML', 'ESP32 & Raspberry Pi meshes', 'Industrial sensor telemetry', 'Low-latency mesh protocols'],
    badge_color: '#ff5e00',
    icon_name: 'CircuitBoard'
  },
  {
    id: 'm6',
    code: 'MSN-VLSI',
    title: 'VLSI SYSTEMS',
    category: 'NON-IT',
    description: 'Operating at the nanometer silicon level. Designing, simulating, and optimizing complex integrated circuit architectures and FPGA micro-engines.',
    core_focus: ['Verilog / VHDL synthesis', 'FPGA real-time acceleration', 'Low-power logic design', 'ASIC architecture simulation'],
    badge_color: '#bf00ff',
    icon_name: 'Layers'
  }
];

export const INITIAL_RUBRICS = [
  {
    id: 'r1',
    name: 'VICEVERSE HEIST EVALUATION RUBRIC v2.0',
    is_active: true,
    scoring_method: 'average',
    criteria: [
      {
        id: 'c1',
        rubric_id: 'r1',
        name: 'Innovation & Novelty',
        description: 'Uniqueness of the concept, creative disruption, and non-trivial approach to the mission challenge.',
        max_marks: 20,
        weight: 1.0,
        order_index: 1
      },
      {
        id: 'c2',
        rubric_id: 'r1',
        name: 'Technical Depth & Architecture',
        description: 'Soundness of technical stack, code quality, architectural scalability, and hardware/software integration depth.',
        max_marks: 20,
        weight: 1.0,
        order_index: 2
      },
      {
        id: 'c3',
        rubric_id: 'r1',
        name: 'Practical Impact & Utility',
        description: 'Real-world applicability, problem severity solved, market relevance, and operational scalability.',
        max_marks: 20,
        weight: 1.0,
        order_index: 3
      },
      {
        id: 'c4',
        rubric_id: 'r1',
        name: 'Working Prototype & Demo',
        description: 'Functionality of the live prototype, UI/UX polish, stability during demonstration, and edge-case resilience.',
        max_marks: 20,
        weight: 1.0,
        order_index: 4
      },
      {
        id: 'c5',
        rubric_id: 'r1',
        name: 'Pitch & Syndicate Defense',
        description: 'Clarity of the pitch delivery, persuasive presentation, and crisp tactical answers to judge questions.',
        max_marks: 20,
        weight: 1.0,
        order_index: 5
      }
    ]
  }
];

export const INITIAL_PROFILES = [
  {
    id: 'p_admin',
    email: 'admin@viceverse.com',
    role: 'admin',
    full_name: 'COMMANDER VEX',
    avatar_url: '/assets/avatars/admin.png'
  },
  {
    id: 'p_judge1',
    email: 'judge1@viceverse.com',
    role: 'judge',
    full_name: 'DR. ELENA ROSTOVA',
    avatar_url: '/assets/avatars/judge1.png'
  },
  {
    id: 'p_judge2',
    email: 'judge2@viceverse.com',
    role: 'judge',
    full_name: 'MARCUS "CIPHER" VANCE',
    avatar_url: '/assets/avatars/judge2.png'
  },
  {
    id: 'p_judge3',
    email: 'judge3@viceverse.com',
    role: 'judge',
    full_name: 'DR. ARJUN MENON',
    avatar_url: '/assets/avatars/judge3.png'
  },
  {
    id: 'p_team1',
    email: 'team1@viceverse.com',
    role: 'team',
    full_name: 'NEXUS OVERDRIVE',
    team_code: 'VV-001'
  },
  {
    id: 'p_team2',
    email: 'team2@viceverse.com',
    role: 'team',
    full_name: 'CYBER GHOST SQUAD',
    team_code: 'VV-002'
  },
  {
    id: 'p_team14',
    email: 'team14@viceverse.com',
    role: 'team',
    full_name: 'SYNTHETIC VANGUARD',
    team_code: 'VV-014'
  }
];

export const INITIAL_JUDGES = [
  {
    id: 'j1',
    profile_id: 'p_judge1',
    judge_code: 'JDG-01',
    name: 'Dr. Elena Rostova',
    specialization: 'Agentic AI & Neural Systems',
    organization: 'DeepMind Research Fellow',
    is_active: true
  },
  {
    id: 'j2',
    profile_id: 'p_judge2',
    judge_code: 'JDG-02',
    name: 'Marcus "Cipher" Vance',
    specialization: 'Offensive Cyber & Zero-Day Research',
    organization: 'Apex Threat Labs',
    is_active: true
  },
  {
    id: 'j3',
    profile_id: 'p_judge3',
    judge_code: 'JDG-03',
    name: 'Dr. Arjun Menon',
    specialization: 'Robotics, TinyML & Embedded Edge',
    organization: 'Autonomous Systems Lab',
    is_active: true
  }
];

export const INITIAL_TEAMS = [
  {
    id: 't1',
    team_code: 'VV-001',
    name: 'NEXUS OVERDRIVE',
    mission_id: 'm1',
    leader_profile_id: 'p_team1',
    status: 'active',
    created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    members: [
      { id: 'tm1_1', name: 'Alex Rivera', role_title: 'Crew Lead / AI Architect', email: 'alex@nexus.io', branch: 'CSE' },
      { id: 'tm1_2', name: 'Samantha Wu', role_title: 'Fullstack Operative', email: 'sam@nexus.io', branch: 'IT' },
      { id: 'tm1_3', name: 'David Kim', role_title: 'Backend & Prompt Engineer', email: 'david@nexus.io', branch: 'AI&DS' },
      { id: 'tm1_4', name: 'Zoya Patel', role_title: 'UI/UX & Pitch Lead', email: 'zoya@nexus.io', branch: 'Design' }
    ]
  },
  {
    id: 't2',
    team_code: 'VV-002',
    name: 'CYBER GHOST SQUAD',
    mission_id: 'm2',
    leader_profile_id: 'p_team2',
    status: 'active',
    created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    members: [
      { id: 'tm2_1', name: 'Vikram Rao', role_title: 'Security Lead', email: 'vikram@ghostsquad.dev', branch: 'Cyber Sec' },
      { id: 'tm2_2', name: 'Chloe Dubois', role_title: 'Penetration Tester', email: 'chloe@ghostsquad.dev', branch: 'Cyber Sec' },
      { id: 'tm2_3', name: 'Rahul Sharma', role_title: 'Kernel & Cryptography Eng', email: 'rahul@ghostsquad.dev', branch: 'CSE' }
    ]
  },
  {
    id: 't3',
    team_code: 'VV-003',
    name: 'OCULAR MATRIX',
    mission_id: 'm3',
    leader_profile_id: null,
    status: 'active',
    created_at: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
    members: [
      { id: 'tm3_1', name: 'Maya Lin', role_title: 'Computer Vision Lead', email: 'maya@ocular.ai', branch: 'AI&DS' },
      { id: 'tm3_2', name: 'Kiran Desai', role_title: 'MLOps & Inference Eng', email: 'kiran@ocular.ai', branch: 'CSE' }
    ]
  },
  {
    id: 't4',
    team_code: 'VV-004',
    name: 'AERO SWARM X',
    mission_id: 'm4',
    leader_profile_id: null,
    status: 'active',
    created_at: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    members: [
      { id: 'tm4_1', name: 'Ethan Hunt', role_title: 'Robotics Hardware Lead', email: 'ethan@aeroswarm.org', branch: 'Mech/Robotics' },
      { id: 'tm4_2', name: 'Ananya Roy', role_title: 'Flight Controller Dev', email: 'ananya@aeroswarm.org', branch: 'ECE' }
    ]
  },
  {
    id: 't5',
    team_code: 'VV-005',
    name: 'QUANTUM PULSE',
    mission_id: 'm5',
    leader_profile_id: null,
    status: 'active',
    created_at: new Date(Date.now() - 15 * 3600 * 1000).toISOString(),
    members: [
      { id: 'tm5_1', name: 'Lucas Scott', role_title: 'Embedded Firmware Eng', email: 'lucas@quantumpulse.io', branch: 'ECE' },
      { id: 'tm5_2', name: 'Pooja Hegde', role_title: 'Edge ML Specialist', email: 'pooja@quantumpulse.io', branch: 'ECE' }
    ]
  },
  {
    id: 't6',
    team_code: 'VV-006',
    name: 'SILICON SYNAPSE',
    mission_id: 'm6',
    leader_profile_id: null,
    status: 'active',
    created_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    members: [
      { id: 'tm6_1', name: 'Devendra Joshi', role_title: 'VLSI Architect', email: 'dev@siliconsynapse.org', branch: 'VLSI/ECE' },
      { id: 'tm6_2', name: 'Tara Singh', role_title: 'FPGA Verification Lead', email: 'tara@siliconsynapse.org', branch: 'ECE' }
    ]
  },
  {
    id: 't14',
    team_code: 'VV-014',
    name: 'SYNTHETIC VANGUARD',
    mission_id: 'm1',
    leader_profile_id: 'p_team14',
    status: 'active',
    created_at: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    members: [
      { id: 'tm14_1', name: 'Kaelen Voss', role_title: 'Agentic Architect & Lead', email: 'kaelen@vanguard.sh', branch: 'AI Research' },
      { id: 'tm14_2', name: 'Seraphina Chen', role_title: 'Autonomous Systems Specialist', email: 'sera@vanguard.sh', branch: 'CSE' },
      { id: 'tm14_3', name: 'Dante Moretti', role_title: 'Real-time Telemetry Dev', email: 'dante@vanguard.sh', branch: 'IT' },
      { id: 'tm14_4', name: 'Aria Thorne', role_title: 'Design Director & Strategist', email: 'aria@vanguard.sh', branch: 'Media Tech' }
    ]
  }
];

export const INITIAL_SUBMISSIONS = [
  {
    id: 'sub1',
    team_id: 't1',
    project_title: 'AUTONOMOUS HEIST DISPATCHER (AHD)',
    problem_statement: 'Emergency incident response in smart infrastructures suffers from latency caused by fragmented telemetry and manual triage procedures.',
    solution: 'A hierarchical multi-agent orchestration framework where cognitive LLM agents autonomously triage sensor telemetry, run automated sandbox mitigations, and coordinate tactical response teams.',
    tech_stack: ['Next.js 14', 'LangChain', 'Supabase Vector', 'FastAPI', 'WebSockets'],
    demo_url: 'https://ahd-demo.viceverse.dev',
    github_url: 'https://github.com/nexus-overdrive/autonomous-heist-dispatcher',
    file_url: 'https://viceverse.dev/files/ahd-blueprint.pdf',
    video_url: 'https://youtube.com/watch?v=ahd-demo',
    status: 'submitted',
    submitted_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
  },
  {
    id: 'sub2',
    team_id: 't2',
    project_title: 'AEGIS: ZERO-TRUST HEIST SHIELD',
    problem_statement: 'Modern cloud-native microservices are vulnerable to identity pivoting attacks and compromised lateral credential theft.',
    solution: 'An automated runtime eBPF security monitor that dynamically enforces ephemeral zero-trust tokens and terminates rogue network execution paths in under 3ms.',
    tech_stack: ['Rust', 'eBPF', 'Go', 'gRPC', 'PostgreSQL', 'Docker'],
    demo_url: 'https://aegis-shield.viceverse.dev',
    github_url: 'https://github.com/ghostsquad/aegis-shield',
    file_url: 'https://viceverse.dev/files/aegis-whitepaper.pdf',
    video_url: '',
    status: 'submitted',
    submitted_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
  },
  {
    id: 'sub3',
    team_id: 't3',
    project_title: 'NEURAL PERIMETER RECON',
    problem_statement: 'Surveillance cameras fail in high-glare and smoke environments during emergency security breaches.',
    solution: 'Multi-spectral thermal-to-optical image reconstruction with real-time YOLOv10 object segmentation deployed directly on Nvidia Jetson edge nodes.',
    tech_stack: ['PyTorch', 'TensorRT', 'CUDA', 'OpenCV', 'React'],
    demo_url: 'https://neural-recon.ocular.ai',
    github_url: 'https://github.com/ocular-matrix/neural-recon',
    file_url: 'https://viceverse.dev/files/neural-recon-spec.pdf',
    status: 'submitted',
    submitted_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString()
  },
  {
    id: 'sub4',
    team_id: 't4',
    project_title: 'SWARM-SYNC AUTONOMOUS RESCUE DRONE',
    problem_statement: 'Search and rescue teams lose critical time in dense collapsed structures without GPS connectivity.',
    solution: 'Decentralized drone swarm utilizing visual-inertial odometry (VIO) to map interior mazes and relay topological 3D mesh maps wirelessly.',
    tech_stack: ['ROS 2', 'PX4 Autopilot', 'C++', 'Python', 'WebRTC'],
    demo_url: 'https://aeroswarm.org/demo',
    github_url: 'https://github.com/aero-swarm/drone-mesh',
    file_url: 'https://viceverse.dev/files/swarm-tech.pdf',
    status: 'submitted',
    submitted_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString()
  },
  {
    id: 'sub14',
    team_id: 't14',
    project_title: 'KRONOS // MULTI-AGENT SENTINEL SYSTEM',
    problem_statement: 'High frequency automated exploits outpace human SOC response teams, resulting in catastrophic enterprise data loss during digital incursions.',
    solution: 'An ensemble of collaborative autonomous LLM agents that concurrently monitor attack graphs, generate target sandboxes, synthesize counter-payloads, and patch system kernels on-the-fly.',
    tech_stack: ['Next.js 14', 'Python FastMCP', 'LangGraph', 'Supabase', 'Tailwind', 'Docker'],
    demo_url: 'https://kronos-sentinel.viceverse.dev',
    github_url: 'https://github.com/synthetic-vanguard/kronos-sentinel',
    file_url: 'https://viceverse.dev/files/kronos-blueprint.pdf',
    video_url: 'https://youtube.com/watch?v=kronos-demo',
    status: 'submitted',
    submitted_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
  }
];

export const INITIAL_ASSIGNMENTS = [
  { id: 'as1', judge_id: 'j1', team_id: 't1', status: 'completed', assigned_at: new Date().toISOString() },
  { id: 'as2', judge_id: 'j2', team_id: 't1', status: 'completed', assigned_at: new Date().toISOString() },
  { id: 'as3', judge_id: 'j3', team_id: 't1', status: 'pending', assigned_at: new Date().toISOString() },

  { id: 'as4', judge_id: 'j1', team_id: 't2', status: 'completed', assigned_at: new Date().toISOString() },
  { id: 'as5', judge_id: 'j2', team_id: 't2', status: 'completed', assigned_at: new Date().toISOString() },

  { id: 'as6', judge_id: 'j1', team_id: 't3', status: 'completed', assigned_at: new Date().toISOString() },
  { id: 'as7', judge_id: 'j3', team_id: 't3', status: 'completed', assigned_at: new Date().toISOString() },

  { id: 'as8', judge_id: 'j2', team_id: 't4', status: 'pending', assigned_at: new Date().toISOString() },
  { id: 'as9', judge_id: 'j3', team_id: 't4', status: 'completed', assigned_at: new Date().toISOString() },

  { id: 'as10', judge_id: 'j1', team_id: 't14', status: 'completed', assigned_at: new Date().toISOString() },
  { id: 'as11', judge_id: 'j2', team_id: 't14', status: 'completed', assigned_at: new Date().toISOString() },
  { id: 'as12', judge_id: 'j3', team_id: 't14', status: 'pending', assigned_at: new Date().toISOString() }
];

export const INITIAL_EVALUATIONS = [
  {
    id: 'ev1',
    assignment_id: 'as1',
    judge_id: 'j1',
    team_id: 't1',
    rubric_id: 'r1',
    is_draft: false,
    total_score: 92.00,
    feedback: 'Phenomenal architecture. The multi-agent coordination pipeline demonstrated exceptional resilience during simulated node failure.',
    created_at: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    scores: [
      { criterion_id: 'c1', score: 19.00, comment: 'High novelty in agentic failover mechanisms.' },
      { criterion_id: 'c2', score: 19.00, comment: 'Solid asynchronous message broker setup.' },
      { criterion_id: 'c3', score: 18.00, comment: 'High industry relevance for enterprise cloud security.' },
      { criterion_id: 'c4', score: 18.00, comment: 'Flawless prototype execution in browser demo.' },
      { criterion_id: 'c5', score: 18.00, comment: 'Very confident pitch presentation.' }
    ]
  },
  {
    id: 'ev2',
    assignment_id: 'as2',
    judge_id: 'j2',
    team_id: 't1',
    rubric_id: 'r1',
    is_draft: false,
    total_score: 89.00,
    feedback: 'Security vectors are well mitigated. Would love to see deeper sandboxing for hostile prompt injection.',
    created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    scores: [
      { criterion_id: 'c1', score: 18.00, comment: 'Unique security agent topologies.' },
      { criterion_id: 'c2', score: 18.00, comment: 'Clean code and comprehensive documentation.' },
      { criterion_id: 'c3', score: 18.00, comment: 'Great enterprise adoption potential.' },
      { criterion_id: 'c4', score: 18.00, comment: 'Fast response times in live test.' },
      { criterion_id: 'c5', score: 17.00, comment: 'Good handling of QA round.' }
    ]
  },
  {
    id: 'ev4',
    assignment_id: 'as4',
    judge_id: 'j1',
    team_id: 't2',
    rubric_id: 'r1',
    is_draft: false,
    total_score: 88.00,
    feedback: 'Remarkable eBPF low-level hook implementation. Code is remarkably crisp for a hackathon timeframe.',
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    scores: [
      { criterion_id: 'c1', score: 17.00, comment: 'Inventive use of eBPF tokens.' },
      { criterion_id: 'c2', score: 19.00, comment: 'Deep low-level systems engineering.' },
      { criterion_id: 'c3', score: 18.00, comment: 'Critical necessity for modern Kubernetes security.' },
      { criterion_id: 'c4', score: 17.00, comment: 'Demo showed sub-5ms attack interruption.' },
      { criterion_id: 'c5', score: 17.00, comment: 'Strong technical breakdown.' }
    ]
  },
  {
    id: 'ev5',
    assignment_id: 'as5',
    judge_id: 'j2',
    team_id: 't2',
    rubric_id: 'r1',
    is_draft: false,
    total_score: 94.00,
    feedback: 'Outstanding defensive engineering. The kernel interception demo was pure cyber-heist mastery.',
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    scores: [
      { criterion_id: 'c1', score: 19.00, comment: 'Cutting-edge zero-trust model.' },
      { criterion_id: 'c2', score: 20.00, comment: 'Flawless Rust & eBPF code architecture.' },
      { criterion_id: 'c3', score: 19.00, comment: 'Massive immediate business impact.' },
      { criterion_id: 'c4', score: 18.00, comment: 'Real-time terminal exploit neutralization demoed.' },
      { criterion_id: 'c5', score: 18.00, comment: 'Very professional delivery.' }
    ]
  },
  {
    id: 'ev6',
    assignment_id: 'as6',
    judge_id: 'j1',
    team_id: 't3',
    rubric_id: 'r1',
    is_draft: false,
    total_score: 84.00,
    feedback: 'Impressive neural reconstruction from noisy thermal feeds. Consider optimizing FPS for lower-power devices.',
    created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    scores: [
      { criterion_id: 'c1', score: 17.00, comment: 'Creative fusion of thermal and RGB sensors.' },
      { criterion_id: 'c2', score: 17.00, comment: 'Good model pipeline and quantization.' },
      { criterion_id: 'c3', score: 18.00, comment: 'Very useful for emergency first-responders.' },
      { criterion_id: 'c4', score: 16.00, comment: 'Demo showed slight frame drops under high load.' },
      { criterion_id: 'c5', score: 16.00, comment: 'Clear presentation.' }
    ]
  },
  {
    id: 'ev7',
    assignment_id: 'as7',
    judge_id: 'j3',
    team_id: 't3',
    rubric_id: 'r1',
    is_draft: false,
    total_score: 86.00,
    feedback: 'Edge deployment on Jetson Xavier was very well executed with customized TensorRT engine.',
    created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    scores: [
      { criterion_id: 'c1', score: 18.00, comment: 'Novel approach to low-light vision.' },
      { criterion_id: 'c2', score: 18.00, comment: 'Deep GPU memory optimization.' },
      { criterion_id: 'c3', score: 17.00, comment: 'Clear use cases.' },
      { criterion_id: 'c4', score: 17.00, comment: 'Working real-time hardware stream.' },
      { criterion_id: 'c5', score: 16.00, comment: 'Well answered questions on latency.' }
    ]
  },
  {
    id: 'ev9',
    assignment_id: 'as9',
    judge_id: 'j3',
    team_id: 't4',
    rubric_id: 'r1',
    is_draft: false,
    total_score: 90.00,
    feedback: 'Autonomous swarm mesh communication without GPS is a massive technical feat.',
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    scores: [
      { criterion_id: 'c1', score: 19.00, comment: 'State of the art decentralized swarm logic.' },
      { criterion_id: 'c2', score: 19.00, comment: 'Impressive PX4 ROS2 integration.' },
      { criterion_id: 'c3', score: 18.00, comment: 'High value in disaster management.' },
      { criterion_id: 'c4', score: 17.00, comment: 'Hardware demo performed with 2 micro-drones.' },
      { criterion_id: 'c5', score: 17.00, comment: 'Crisp deck and video proof.' }
    ]
  },
  {
    id: 'ev10',
    assignment_id: 'as10',
    judge_id: 'j1',
    team_id: 't14',
    rubric_id: 'r1',
    is_draft: false,
    total_score: 96.00,
    feedback: 'Mindblowing agentic synthesis. The collaborative reasoning tree with live tool-calling is the finest project in the syndicate today.',
    created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    scores: [
      { criterion_id: 'c1', score: 20.00, comment: 'Pioneering agent architecture with self-correcting loop.' },
      { criterion_id: 'c2', score: 19.00, comment: 'Enterprise-grade async orchestrator.' },
      { criterion_id: 'c3', score: 19.00, comment: 'Massive practical value in enterprise cybersecurity.' },
      { criterion_id: 'c4', score: 19.00, comment: 'Stunning interactive command HUD demo.' },
      { criterion_id: 'c5', score: 19.00, comment: 'Outstanding, electrifying pitch.' }
    ]
  },
  {
    id: 'ev11',
    assignment_id: 'as11',
    judge_id: 'j2',
    team_id: 't14',
    rubric_id: 'r1',
    is_draft: false,
    total_score: 95.00,
    feedback: 'Extremely robust security containment mechanisms. Solves real pain points of autonomous agents running rogue code.',
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    scores: [
      { criterion_id: 'c1', score: 19.00, comment: 'Exceptional originality in agent safety bounds.' },
      { criterion_id: 'c2', score: 19.00, comment: 'Clean FastMCP protocol implementation.' },
      { criterion_id: 'c3', score: 19.00, comment: 'Ready for production deployment.' },
      { criterion_id: 'c4', score: 19.00, comment: 'Flawless multi-step live execution.' },
      { criterion_id: 'c5', score: 19.00, comment: 'Clear, concise, authoritative.' }
    ]
  }
];

export const INITIAL_ANNOUNCEMENTS = [
  {
    id: 'ann1',
    title: 'SYS-INIT // VICEVERSE 2026 ENGAGED',
    content: 'Welcome Operatives and Syndicate Judges. Real-time telemetry, scoring matrix, and project submission hubs are now fully online.',
    priority: 'info',
    created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
  },
  {
    id: 'ann2',
    title: 'ROUND 1 JUDGING IN PROGRESS',
    content: 'Judges are actively scoring tactical submissions. Operatives can monitor the live score HUD in real-time.',
    priority: 'warning',
    created_at: new Date(Date.now() - 1 * 3600 * 1000).toISOString()
  },
  {
    id: 'ann3',
    title: 'FINAL PITCH DECK SUBMISSION LOCK IN 3 HOURS',
    content: 'All teams must finalize GitHub repositories and live URLs before the syndicate lock down threshold.',
    priority: 'urgent',
    created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString()
  }
];

export const INITIAL_SCHEDULE = [
  {
    id: 'sch1',
    phase_number: 'PHASE 01',
    phase_name: 'ENTRY INFILTRATION',
    time_slot: '08:00 AM - 09:30 AM',
    date_slot: 'OCT 24',
    description: 'Syndicate badge distribution, operative credential registration, and hardware workstation setup.',
    status: 'completed',
    order_index: 1
  },
  {
    id: 'sch2',
    phase_number: 'PHASE 02',
    phase_name: 'THE MISSION DROP & BRIEFING',
    time_slot: '09:30 AM - 10:30 AM',
    date_slot: 'OCT 24',
    description: 'Declassification of secret problem tracks, rubric breakdown, and mentor syndicate introduction.',
    status: 'completed',
    order_index: 2
  },
  {
    id: 'sch3',
    phase_number: 'PHASE 03',
    phase_name: 'THE INNOVATION HEIST',
    time_slot: '10:30 AM - 03:00 PM',
    date_slot: 'OCT 24',
    description: 'Intensive code execution, hardware prototyping, neural model training, and pitch deck compilation.',
    status: 'active',
    order_index: 3
  },
  {
    id: 'sch4',
    phase_number: 'PHASE 04',
    phase_name: 'TACTICAL MENTOR CHECKPOINTS',
    time_slot: '03:00 PM - 05:00 PM',
    date_slot: 'OCT 24',
    description: '1-on-1 prototype stress tests with syndicate mentors and tactical guidance.',
    status: 'upcoming',
    order_index: 4
  },
  {
    id: 'sch5',
    phase_number: 'PHASE 05',
    phase_name: 'THE FINAL HEIST PITCH & BOUNTY CEREMONY',
    time_slot: '05:00 PM - 07:30 PM',
    date_slot: 'OCT 24',
    description: 'High-stakes stage defense before the lead judges, real-time scoring aggregation, and prize pool unlocked.',
    status: 'upcoming',
    order_index: 5
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif1',
    user_id: 'p_team14',
    team_id: 't14',
    type: 'SUCCESS',
    title: 'EVALUATION RECEIVED',
    message: 'Syndicate Judge JDG-01 has submitted an official score of 96.0/100.',
    is_read: false,
    created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString()
  },
  {
    id: 'notif2',
    user_id: 'p_team14',
    team_id: 't14',
    type: 'IMPORTANT',
    title: 'SUBMISSION CONFIRMED',
    message: 'Your project "KRONOS // MULTI-AGENT SENTINEL" was successfully registered.',
    is_read: true,
    created_at: new Date(Date.now() - 120 * 60 * 1000).toISOString()
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'aud1',
    user_id: 'p_admin',
    user_email: 'admin@viceverse.com',
    action: 'EVENT_PHASE_UPDATE',
    entity_type: 'event_settings',
    entity_id: '1',
    details: { old_phase: 'SUBMISSION', new_phase: 'JUDGING' },
    created_at: new Date(Date.now() - 95 * 60 * 1000).toISOString()
  },
  {
    id: 'aud2',
    user_id: 'p_judge1',
    user_email: 'judge1@viceverse.com',
    action: 'SCORE_SUBMISSION',
    entity_type: 'evaluations',
    entity_id: 'ev10',
    details: { team_code: 'VV-014', score: 96.0 },
    created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString()
  },
  {
    id: 'aud3',
    user_id: 'p_admin',
    user_email: 'admin@viceverse.com',
    action: 'ANNOUNCEMENT_BROADCAST',
    entity_type: 'announcements',
    created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString()
  }
];

export const MISSIONS = INITIAL_MISSIONS;
export const DEFAULT_RUBRIC = typeof INITIAL_RUBRICS !== 'undefined' ? INITIAL_RUBRICS[0] : null;
