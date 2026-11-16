// ✏️ Edit your details here. Everything on the page reads from this file.
export const PROFILE = {
  name: "Bbuvasree N",
  role: "Software Developer",
  email: "bbuvasree.n@gmail.com",
  phone: "7395963845",
  location: "Chennai, Tamil Nadu",
  linkedin: "https://www.linkedin.com/in/bbuvasree-n-850599290",
  github: "https://github.com/Bbuvasreedev",
  resume: "/BbuvasreeN_Resume.pdf", // file inside /public
};

// Big paragraph at the top of the About section
export const ABOUT_TEXT =
  "Computer Science and Business Systems graduate with hands-on experience across Java, Spring Boot, Python, Django, React, Flutter, SQL, REST APIs and modern GenAI technologies. I build end-to-end applications — from designing databases and developing backend services to creating responsive interfaces and integrating AI-powered solutions using LLMs, RAG, embeddings and vector search. I’m not limited to a single technology or development stack; I enjoy learning new tools, adapting to unfamiliar technologies and taking on different software-development challenges. Whether the role involves backend engineering, full-stack development, frontend development, API development or emerging AI technologies, I’m excited to learn quickly, contribute effectively and grow with the team.";

// Smaller paragraph underneath
export const ABOUT_EXTRA =
  "What motivates me is the opportunity to turn ideas into useful, reliable products. I enjoy understanding how a system works end-to-end — designing the data layer, building APIs, developing intuitive interfaces, integrating intelligent features and continuously improving the solution. I’m curious by nature, comfortable learning new technologies, and always looking for better ways to solve problems. I’m open to diverse software-development opportunities where I can contribute, adapt quickly and grow into the challenges ahead.";

export const STATS = [
  { n: 5, suffix: "", label: "Internships & trainings" },
  { n: 6, suffix: "", label: "Full-stack projects" },
  { n: 5, suffix: "", label: "Mini projects" },
  { n: 1, suffix: "", label: "International conference" },
];

export const SKILL_GROUPS = [
  { title: "Languages", icon: "{ }", items: ["Java", "Python", "Dart", "JavaScript", "SQL"] },
  { title: "Frameworks", icon: "◈", items: ["Spring Boot", "Django", "React JS", "Flutter", "Spring AI"] },
  { title: "Databases", icon: "▤", items: ["MySQL", "PostgreSQL (Supabase)", "pgvector"] },
  { title: "AI & GenAI", icon: "✦", items: ["RAG", "LLM", "Embeddings", "Vector Search", "Ollama", "Prompt Engineering"] },
  { title: "Web", icon: "◧", items: ["HTML", "CSS", "REST APIs", "Responsive Design"] },
  { title: "Tools & Platforms", icon: "⌘", items: ["Git", "GitHub", "VS Code", "IntelliJ IDEA", "Eclipse", "Android Studio", "PyCharm", "Supabase"] },
];

export const EXPERIENCE = [
  {
    role: "Software Engineer Intern",
    org: "Hexaware Technologies",
    time: "Present",
    current: true,
    points: [
      "Build a real-time full-stack web application using HTML, CSS, JavaScript, Java, Spring Boot and SQL.",
      "Develop REST APIs and integrate them with a SQL database for data storage and retrieval.",
      "Collaborate with cross-functional teams in an Agile environment: daily stand-ups and project reviews.",
    ],
    tags: ["Java", "Spring Boot", "SQL", "REST", "Agile", "Dart", "Flutter", "PostgreSQL", "Supabase", "GenAI", "Docker"],
  },
  {
    role: "Java Full Stack Developer Intern",
    org: "Graquant",
    time: "2 months",
    points: [
      "Developed full-stack applications using Java, Spring Boot, React JS and MySQL.",
      "Built and integrated REST APIs while developing responsive user interfaces.",
    ],
    tags: ["Java", "Spring Boot", "React JS", "MySQL"],
  },
  {
    role: "Full-Stack Developer Intern",
    org: "BillionTags",
    time: "2 months",
    points: [
      "Built and integrated Django REST endpoints to connect frontend components with backend services.",
      "Developed responsive screens with HTML, CSS, JavaScript and React JS across multiple feature modules.",
      "Debugged frontend and backend issues during integration and pre-deployment testing.",
    ],
    tags: ["Django", "React JS", "REST", "Testing"],
  },
  {
    role: "Web Development Intern",
    org: "Apex Planet Software Pvt Ltd",
    time: "45 days",
    points: [
      "Built responsive webpage layouts with HTML and CSS, consistent across screen sizes.",
      "Designed reusable UI components to standardise page structure across multiple pages.",
    ],
    tags: ["HTML", "CSS", "JavaScript", "UI Components"],
  },
  {
    role: "Java Development Trainee",
    org: "CSC",
    time: "3 months",
    points: [
      "Completed structured training in core Java: OOP, data structures and exception handling.",
      "Built mini-projects to apply Java fundamentals and strengthen programming logic.",
    ],
    tags: ["Core Java", "OOP", "Data Structures"],
  },
];

// All six cards are the same size
export const PROJECTS = [
  {
    name: "AI-Powered Portfolio & RAG Chatbot",
    tag: "Featured · GenAI",
    featured: true,
    stack: ["React JS", "Spring Boot", "Spring AI", "PostgreSQL", "pgvector", "Ollama", "RAG"],
    text: "This very portfolio: a RAG-based assistant that answers questions about me. It ingests PDF, DOCX, TXT and Markdown, chunks and embeds them, searches vectors in pgvector and replies with Ollama.",
  },
  {
    name: "KaasuTracker",
    tag: "Mobile · Full-stack",
    stack: ["Flutter", "Dart", "Spring Boot", "Supabase", "REST API"],
    text: "Smart expense tracker with AI-powered receipt analysis, EMI and loan tracking, spending summaries and configurable alerts, all behind secure REST APIs.",
  },
  {
    name: "Employee Portal",
    tag: "Full-stack",
    stack: ["React JS", "Django", "MySQL"],
    text: "Employee management portal with a Django backend and React frontend, with REST endpoints wired to interactive UI components.",
  },
  {
    name: "Cafe Management Website",
    tag: "Full-stack",
    stack: ["Spring Boot", "SQL", "JavaScript"],
    text: "Multi-page cafe site with secure login and role-based access across 7 admin roles, each with its own admin panel.",
  },
  {
    name: "Track My Phone",
    tag: "Android",
    stack: ["Java", "Android Studio", "Google Maps API"],
    text: "Android security app that locates and controls a lost phone through SMS commands, with SIM-change detection and a remote alarm.",
  },
  {
    name: "Job Portfolio Website",
    tag: "Frontend",
    stack: ["HTML", "CSS", "JavaScript", "Bootstrap"],
    text: "Responsive personal portfolio with multiple sections, interactive UI components and a mobile-friendly Flexbox/Grid layout.",
  },
];

export const MINI_PROJECTS = [
  "Portfolio Website",
  "Calculator",
  "Tic-Tac-Toe (XO)",
  "Landing Page",
  "To-Do List App",
];

export const EDUCATION = [
  { title: "B.E. Computer Science and Business Systems", place: "Panimalar Engineering College", time: "2022 – 2026" },
  { title: "Higher Secondary (12th)", place: "Velammal Matriculation Higher Secondary School", time: "2022" },
  { title: "Secondary School (10th)", place: "Velammal Matriculation Higher Secondary School", time: "2020" },
];

export const CERTIFICATIONS = [
  "QSpiders · Java Full Stack Development (1 year)",
  "Infosys Springboard · HTML, CSS & JavaScript",
  "Simplilearn · Java & Object-Oriented Programming",
  "TCS iON · Introduction to Artificial Intelligence",
  "Udemy · SQL",
];

export const ACHIEVEMENTS = [
  "Scored 1109.42/1800 (61.63%) in the TCS iON National Qualifier Test (NQT) Cognitive, Feb 2026, with 409.4/600 in Numerical Ability.",
  "Presented “An ATM with an Eye” at an International Conference at Panimalar Engineering College.",
  "Proposed a facial-recognition-based ATM security solution to strengthen authentication.",
];

export const SOFT_SKILLS = ["Leadership", "Teamwork", "Problem-Solving", "Time Management", "Communication"];
export const LANGUAGES = ["English", "Hindi", "Tamil", "French"];