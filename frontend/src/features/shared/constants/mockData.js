// ==============================================================================
// CLUB IDEATHON - CORE DOMAIN MODELS & SEED DATA
// ==============================================================================

export const INITIAL_EVENT_SETTINGS = {
  id: 1,
  event_name: 'CLUB IDEATHON 2026 // JUDGING SUITE',
  event_phase: 'JUDGING', // 'REGISTRATION' | 'SUBMISSION' | 'JUDGING' | 'RESULTS' | 'COMPLETED'
  submission_deadline: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
  judging_deadline: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
  scoring_method: 'sum', // 'sum' | 'weighted' | 'average'
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

export const INITIAL_SCHEDULE = [
  {
    id: 's1',
    phase_number: 'PHASE 01',
    phase_name: 'Team Check-in & Orientation',
    time_slot: '09:00 AM - 09:45 AM',
    date_slot: 'Today',
    description: 'Reporting to Seminar Hall A & Auditorium B, kit distribution, and briefing on judging rules.',
    status: 'completed',
    order_index: 1
  },
  {
    id: 's2',
    phase_number: 'PHASE 02',
    phase_name: 'Round 1: Preliminary Track Pitches',
    time_slot: '10:00 AM - 01:00 PM',
    date_slot: 'Today',
    description: '5-minute pitch + 3-minute Q&A defense in assigned presentation rooms before panel judges.',
    status: 'active',
    order_index: 2
  },
  {
    id: 's3',
    phase_number: 'PHASE 03',
    phase_name: 'Judge Deliberation & Scorecard Lock',
    time_slot: '02:00 PM - 03:30 PM',
    date_slot: 'Today',
    description: 'Finalization of criterion marks, normalization, and review of top qualifying projects.',
    status: 'upcoming',
    order_index: 3
  },
  {
    id: 's4',
    phase_number: 'PHASE 04',
    phase_name: 'Grand Finale Pitches & Award Ceremony',
    time_slot: '04:00 PM - 05:30 PM',
    date_slot: 'Today',
    description: 'Top 3 teams pitch on main stage, live winner declaration, and cash prize distribution.',
    status: 'upcoming',
    order_index: 4
  }
];

export const INITIAL_MISSIONS = [
  {
    id: 'trk-1',
    code: 'TRK-AI',
    title: 'AI & Intelligent Systems',
    category: 'TECH',
    description: 'Autonomous agents, LLM applications, computer vision, and real-time machine intelligence solutions addressing complex domain problems.',
    core_focus: ['Neural architectures', 'Autonomous agents', 'LLM fine-tuning & RAG', 'Computer vision models'],
    badge_color: '#6366f1',
    icon_name: 'Cpu'
  },
  {
    id: 'trk-2',
    code: 'TRK-WEB',
    title: 'FinTech & Web3 Innovation',
    category: 'TECH',
    description: 'Decentralized platforms, algorithmic financial tools, secure micropayments, and next-generation transactional systems.',
    core_focus: ['Decentralized protocols', 'Smart contracts', 'Algorithmic trading', 'Zero-knowledge proofs'],
    badge_color: '#06b6d4',
    icon_name: 'ShieldCheck'
  },
  {
    id: 'trk-3',
    code: 'TRK-HLT',
    title: 'HealthTech & BioInformatics',
    category: 'IMPACT',
    description: 'Digital diagnostics, patient telemetry, clinical trial intelligence, and AI-accelerated healthcare delivery systems.',
    core_focus: ['Diagnostic AI', 'Biometric telemetry', 'Genomic pipeline tools', 'EHR interoperability'],
    badge_color: '#10b981',
    icon_name: 'Activity'
  },
  {
    id: 'trk-4',
    code: 'TRK-IOT',
    title: 'Smart IoT & Embedded Automation',
    category: 'TECH',
    description: 'Connected sensor networks, edge intelligence, robotics, and industrial automation hardware architectures.',
    core_focus: ['Edge computing & TinyML', 'Microcontroller mesh', 'Sensor telemetry', 'Robotics kinematics'],
    badge_color: '#f59e0b',
    icon_name: 'Layers'
  },
  {
    id: 'trk-5',
    code: 'TRK-OPN',
    title: 'Open Innovation & Sustainability',
    category: 'IMPACT',
    description: 'Clean energy, carbon tracking, smart mobility, educational access, and transformative social impact innovations.',
    core_focus: ['ESG analytics', 'Smart logistics', 'CleanTech hardware', 'EdTech platforms'],
    badge_color: '#ec4899',
    icon_name: 'Sparkles'
  }
];

export const INITIAL_RUBRICS = [
  {
    id: 'r1',
    name: 'IDEATHON STANDARD EVALUATION RUBRIC (100 PTS)',
    is_active: true,
    scoring_method: 'sum',
    criteria: [
      {
        id: 'c1',
        rubric_id: 'r1',
        name: 'Innovation & Originality',
        description: 'Uniqueness of the concept, creativity of the approach, and clear differentiation from existing market solutions.',
        max_marks: 25,
        weight: 1.0,
        order_index: 1
      },
      {
        id: 'c2',
        rubric_id: 'r1',
        name: 'Technical Depth & Feasibility',
        description: 'Soundness of technical architecture, feasibility of proposed implementation, choice of tech stack, and scalability.',
        max_marks: 25,
        weight: 1.0,
        order_index: 2
      },
      {
        id: 'c3',
        rubric_id: 'r1',
        name: 'Business Value & Market Impact',
        description: 'Clarity of the target problem, user adoption potential, market size, commercial sustainability, and social impact.',
        max_marks: 25,
        weight: 1.0,
        order_index: 3
      },
      {
        id: 'c4',
        rubric_id: 'r1',
        name: 'Pitch Presentation & Q&A Defense',
        description: 'Clarity and articulation of the pitch, quality of demo/prototype visuals, and the team’s ability to defend questions during Q&A.',
        max_marks: 25,
        weight: 1.0,
        order_index: 4
      }
    ]
  }
];

export const INITIAL_PROFILES = [
  {
    id: 'p-admin',
    email: 'admin@club.edu',
    role: 'admin',
    full_name: 'Club Lead / Admin (You)',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'p-coord1',
    email: 'alex.coordinator@club.edu',
    role: 'coordinator',
    full_name: 'Alex Morgan (Room A Coordinator)',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'p-coord2',
    email: 'priya.coordinator@club.edu',
    role: 'coordinator',
    full_name: 'Priya Sharma (Room B Coordinator)',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'p-judge1',
    email: 'elena.rostova@university.edu',
    role: 'judge',
    full_name: 'Dr. Elena Rostova',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'p-judge2',
    email: 'marcus.vance@techcorp.io',
    role: 'judge',
    full_name: 'Marcus Vance',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'p-judge3',
    email: 'sarah.chen@venturecapital.com',
    role: 'judge',
    full_name: 'Sarah Chen',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'p-team14',
    email: 'lead.synth@club.edu',
    role: 'team',
    full_name: 'Aiden Brooks (Team Lead)',
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_COORDINATORS = [
  {
    id: 'coord1',
    profile_id: 'p-coord1',
    coordinator_code: 'CRD-01',
    name: 'Alex Morgan',
    assigned_room: 'Seminar Hall A (Tracks: AI, FinTech)',
    phone: '+1 (555) 234-5678',
    is_active: true
  },
  {
    id: 'coord2',
    profile_id: 'p-coord2',
    coordinator_code: 'CRD-02',
    name: 'Priya Sharma',
    assigned_room: 'Auditorium B (Tracks: HealthTech, IoT, Open)',
    phone: '+1 (555) 876-5432',
    is_active: true
  }
];

export const INITIAL_JUDGES = [
  {
    id: 'j1',
    profile_id: 'p-judge1',
    judge_code: 'JDG-01',
    name: 'Dr. Elena Rostova',
    specialization: 'AI Systems & Neural Computing',
    organization: 'Faculty of Computer Science',
    is_active: true
  },
  {
    id: 'j2',
    profile_id: 'p-judge2',
    judge_code: 'JDG-02',
    name: 'Marcus Vance',
    specialization: 'Enterprise Architecture & Cloud',
    organization: 'TechVanguard Labs',
    is_active: true
  },
  {
    id: 'j3',
    profile_id: 'p-judge3',
    judge_code: 'JDG-03',
    name: 'Sarah Chen',
    specialization: 'Product Strategy & Venture Innovation',
    organization: 'Apex Ventures',
    is_active: true
  }
];

export const INITIAL_TEAMS = [
  {
    id: 't1',
    team_code: 'IDEA-01',
    name: 'AetherAI Diagnostics',
    mission_id: 'trk-1',
    room: 'Seminar Hall A',
    pitch_slot: '10:00 AM',
    pitch_status: 'completed',
    checked_in: true,
    members: [
      { name: 'Aiden Brooks', role: 'Team Lead & ML Architect', email: 'aiden@club.edu' },
      { name: 'Maya Lin', role: 'Full Stack Engineer', email: 'maya@club.edu' },
      { name: 'Kiran Patel', role: 'Data Scientist', email: 'kiran@club.edu' }
    ],
    submission: {
      project_title: 'AetherAI: Edge Multimodal Medical Diagnostic Triaging',
      problem_statement: 'Emergency healthcare centers face fatal bottlenecks when triaging incoming patient telemetry and imaging under high stress loads.',
      solution: 'An offline-capable edge device running quantized multimodal vision-language models to classify acute symptoms, prioritize trauma cases, and alert emergency physicians within 2 seconds.',
      tech_stack: ['PyTorch', 'TensorRT-LLM', 'FastAPI', 'Next.js', 'ESP32'],
      demo_url: 'https://aetherai.demo.live',
      github_url: 'https://github.com/aetherai/core',
      deck_url: 'https://pitch.com/aetherai-deck.pdf',
      video_url: 'https://youtube.com/watch?v=sample1'
    }
  },
  {
    id: 't2',
    team_code: 'IDEA-02',
    name: 'CipherMesh Protocol',
    mission_id: 'trk-2',
    room: 'Seminar Hall A',
    pitch_slot: '10:20 AM',
    pitch_status: 'completed',
    checked_in: true,
    members: [
      { name: 'David Kim', role: 'Lead Cryptographer', email: 'david@club.edu' },
      { name: 'Sophia Rossi', role: 'Smart Contract Developer', email: 'sophia@club.edu' }
    ],
    submission: {
      project_title: 'CipherMesh: Zero-Knowledge Decentralized Micropayments',
      problem_statement: 'Cross-border supplier settlements suffer from high intermediary fees (3-5%) and multi-day clearing delays.',
      solution: 'A Layer-2 roll-up optimized for instant B2B settlement utilizing ZK-SNARK batching and automated stablecoin liquidity rebalancing.',
      tech_stack: ['Solidity', 'Rust', 'Circom', 'React', 'Node.js'],
      demo_url: 'https://ciphermesh.finance',
      github_url: 'https://github.com/ciphermesh/contracts',
      deck_url: 'https://pitch.com/ciphermesh-deck.pdf',
      video_url: 'https://youtube.com/watch?v=sample2'
    }
  },
  {
    id: 't3',
    team_code: 'IDEA-03',
    name: 'NeuroPulse Prosthetics',
    mission_id: 'trk-3',
    room: 'Auditorium B',
    pitch_slot: '10:40 AM',
    pitch_status: 'presenting',
    checked_in: true,
    members: [
      { name: 'Liam Zhang', role: 'Hardware & BCI Engineer', email: 'liam@club.edu' },
      { name: 'Emma Watson', role: 'Embedded Systems Lead', email: 'emma@club.edu' }
    ],
    submission: {
      project_title: 'NeuroPulse: Low-Cost EMG-Controlled Bionic Limb',
      problem_statement: 'Advanced motorized prosthetics cost upwards of $30,000, making them completely inaccessible in emerging economies.',
      solution: '3D-printed bionic arm controlled by low-noise surface EMG sensors with onboard TinyML microcontrollers recognizing 12 distinct grasp gestures in real-time under $250.',
      tech_stack: ['C++', 'STM32', 'Edge Impulse', 'Fusion360', 'Python'],
      demo_url: 'https://neuropulse.org',
      github_url: 'https://github.com/neuropulse/embedded',
      deck_url: 'https://pitch.com/neuropulse-deck.pdf',
      video_url: 'https://youtube.com/watch?v=sample3'
    }
  },
  {
    id: 't4',
    team_code: 'IDEA-04',
    name: 'EcoGrid Swarm',
    mission_id: 'trk-4',
    room: 'Auditorium B',
    pitch_slot: '11:00 AM',
    pitch_status: 'pending',
    checked_in: true,
    members: [
      { name: 'Carlos Mendez', role: 'IoT Architect', email: 'carlos@club.edu' },
      { name: 'Ananya Rao', role: 'Firmware Engineer', email: 'ananya@club.edu' }
    ],
    submission: {
      project_title: 'EcoGrid: Autonomous Solar Microgrid Load Balancer',
      problem_statement: 'Distributed solar installations waste up to 28% of surplus energy due to rigid central grid interconnect delays.',
      solution: 'P2P mesh energy trading nodes that dynamically route power among neighborhood microgrids using automated frequency-balancing logic.',
      tech_stack: ['Raspberry Pi', 'LoRaWAN', 'Go', 'InfluxDB', 'MQTT'],
      demo_url: 'https://ecogrid.energy',
      github_url: 'https://github.com/ecogrid/mesh',
      deck_url: 'https://pitch.com/ecogrid-deck.pdf',
      video_url: ''
    }
  },
  {
    id: 't5',
    team_code: 'IDEA-05',
    name: 'TerraSense Agriculture',
    mission_id: 'trk-5',
    room: 'Auditorium B',
    pitch_slot: '11:20 AM',
    pitch_status: 'pending',
    checked_in: false,
    members: [
      { name: 'Fatima Al-Sayed', role: 'Agritech Lead', email: 'fatima@club.edu' },
      { name: 'Jordan Cole', role: 'Software Engineer', email: 'jordan@club.edu' }
    ],
    submission: {
      project_title: 'TerraSense: Drone-Powered Precision Soil & Crop Health AI',
      problem_statement: 'Overuse of nitrogen fertilizer degrades topsoil and causes significant regional groundwater contamination.',
      solution: 'Automated drone multispectral analysis identifying micro-deficiencies down to individual crop rows, reducing fertilizer waste by 40%.',
      tech_stack: ['Computer Vision', 'YOLOv8', 'DJI SDK', 'Next.js', 'PostgreSQL'],
      demo_url: 'https://terrasense.farm',
      github_url: 'https://github.com/terrasense/vision',
      deck_url: 'https://pitch.com/terrasense-deck.pdf',
      video_url: ''
    }
  }
];

export const INITIAL_ASSIGNMENTS = [
  { id: 'a1', judge_id: 'j1', team_id: 't1', status: 'completed' },
  { id: 'a2', judge_id: 'j2', team_id: 't1', status: 'completed' },
  { id: 'a3', judge_id: 'j1', team_id: 't2', status: 'completed' },
  { id: 'a4', judge_id: 'j2', team_id: 't2', status: 'completed' },
  { id: 'a5', judge_id: 'j2', team_id: 't3', status: 'completed' },
  { id: 'a6', judge_id: 'j3', team_id: 't3', status: 'pending' },
  { id: 'a7', judge_id: 'j1', team_id: 't4', status: 'pending' },
  { id: 'a8', judge_id: 'j3', team_id: 't4', status: 'pending' },
  { id: 'a9', judge_id: 'j2', team_id: 't5', status: 'pending' },
  { id: 'a10', judge_id: 'j3', team_id: 't5', status: 'pending' }
];

export const INITIAL_EVALUATIONS = [
  {
    id: 'e1',
    assignment_id: 'a1',
    judge_id: 'j1',
    team_id: 't1',
    rubric_id: 'r1',
    is_draft: false,
    total_score: 93.0,
    feedback: 'Outstanding technical depth on the quantized edge model. Great response during Q&A regarding hardware latency constraints.',
    criteria_scores: [
      { criterion_id: 'c1', score: 24.0, comment: 'Very creative approach to edge medical triage.' },
      { criterion_id: 'c2', score: 24.0, comment: 'TensorRT optimization and low latency demonstrated.' },
      { criterion_id: 'c3', score: 23.0, comment: 'Strong clinical utility in emergency centers.' },
      { criterion_id: 'c4', score: 22.0, comment: 'Confident presentation and clear demo.' }
    ],
    updated_at: new Date().toISOString()
  },
  {
    id: 'e2',
    assignment_id: 'a2',
    judge_id: 'j2',
    team_id: 't1',
    rubric_id: 'r1',
    is_draft: false,
    total_score: 90.0,
    feedback: 'Solid working prototype. Recommend further testing on real-world medical camera noise.',
    criteria_scores: [
      { criterion_id: 'c1', score: 23.0, comment: 'Solid novelty.' },
      { criterion_id: 'c2', score: 23.0, comment: 'Good modular system design.' },
      { criterion_id: 'c3', score: 22.0, comment: 'High real-world adoption potential.' },
      { criterion_id: 'c4', score: 22.0, comment: 'Good slide deck and concise answers.' }
    ],
    updated_at: new Date().toISOString()
  },
  {
    id: 'e3',
    assignment_id: 'a3',
    judge_id: 'j1',
    team_id: 't2',
    rubric_id: 'r1',
    is_draft: false,
    total_score: 87.0,
    feedback: 'Strong mathematical rigor in the ZK proof verification circuits. Needs clearer UI for non-technical enterprise users.',
    criteria_scores: [
      { criterion_id: 'c1', score: 22.0, comment: 'Novel application of ZK rollups for B2B.' },
      { criterion_id: 'c2', score: 24.0, comment: 'Complex Circom circuits well designed.' },
      { criterion_id: 'c3', score: 21.0, comment: 'Large addressable market.' },
      { criterion_id: 'c4', score: 20.0, comment: 'Presentation was a bit technical for general audience.' }
    ],
    updated_at: new Date().toISOString()
  }
];

export const INITIAL_ANNOUNCEMENTS = [
  {
    id: 'ann-1',
    title: 'Round 1 Pitches Commenced in Seminar Hall A & Auditorium B',
    content: 'All team leaders are requested to verify their pitch slots with room coordinators 10 minutes prior.',
    priority: 'info',
    created_at: new Date().toISOString()
  },
  {
    id: 'ann-2',
    title: 'Evaluation Marks Submission Deadline: 4:00 PM',
    content: 'Judges are requested to finalize and submit all pending scorecards by 4:00 PM for award calculations.',
    priority: 'urgent',
    created_at: new Date().toISOString()
  }
];
