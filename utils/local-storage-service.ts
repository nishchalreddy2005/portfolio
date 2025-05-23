export interface ProfileData {
  about: {
    bio: string
    image_url?: string
    name?: string
  }
  contact: {
    email: string
    phone: string
    location: string
  }
  education: Array<{
    id: string
    degree: string
    institution: string
    location: string
    startYear: string
    endYear: string
    grade: string
    specialization: string
  }>
  skills: {
    technical: Array<{
      id: string
      name: string
      level: number
      category: string
      custom_category_id?: string | null
      customCategory?: {
        id: string
        name: string
        icon?: string
        color?: string
      }
    }>
    soft: Array<{
      id: string
      name: string
      level: number
    }>
    customCategories: Array<{
      id: string
      name: string
      icon?: string
      color?: string
    }>
    timestamp: number
  }
  experience: Array<{
    id: string
    title: string
    company: string
    location: string
    startDate: string
    endDate: string
    current: boolean
    description: string[]
  }>
  projects: {
    items: Array<{
      id: string
      title: string
      category: string
      category_id?: number | null
      description: string
      features: string[]
      technologies: string[]
      image: string
      github: string
      demo: string
      linkedin: string
      date: string
    }>
    categories: Array<{
      id: number
      name: string
    }>
    features?: Array<any>
    technologies?: Array<any>
  }
  certifications: Array<{
    id: string
    title: string
    issuer: string
    date: string
    certificateUrl: string
  }>
  achievements: Array<{
    id: string
    title: string
    description: string
    date: string
    issuer: string
    url: string
  }>
  settings?: {
    resumeLink?: string
  }
}

// Default profile data
export const defaultProfileData: ProfileData = {
  about: {
    bio: "I am a passionate software engineer with expertise in full-stack development, machine learning, and blockchain technologies. With a strong foundation in computer science and years of hands-on experience, I create innovative solutions to complex problems.",
  },
  contact: {
    email: "contact@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
  },
  education: [
    {
      id: "1",
      degree: "Master of Science in Computer Science",
      institution: "Stanford University",
      location: "Stanford, CA",
      startYear: "2018",
      endYear: "2020",
      grade: "3.9 GPA",
      specialization: "Artificial Intelligence",
    },
    {
      id: "2",
      degree: "Bachelor of Science in Computer Engineering",
      institution: "Massachusetts Institute of Technology",
      location: "Cambridge, MA",
      startYear: "2014",
      endYear: "2018",
      grade: "3.8 GPA",
      specialization: "Software Systems",
    },
  ],
  skills: {
    technical: [
      { id: "1", name: "JavaScript", level: 95, category: "Languages" },
      { id: "2", name: "TypeScript", level: 90, category: "Languages" },
      { id: "3", name: "Python", level: 85, category: "Languages" },
      { id: "4", name: "Java", level: 80, category: "Languages" },
      { id: "5", name: "C++", level: 75, category: "Languages" },
      { id: "6", name: "React", level: 95, category: "Frameworks" },
      { id: "7", name: "Node.js", level: 90, category: "Frameworks" },
      { id: "8", name: "Express", level: 85, category: "Frameworks" },
      { id: "9", name: "Next.js", level: 90, category: "Frameworks" },
      { id: "10", name: "Django", level: 80, category: "Frameworks" },
      { id: "11", name: "TensorFlow", level: 75, category: "Data" },
      { id: "12", name: "PyTorch", level: 70, category: "Data" },
      { id: "13", name: "SQL", level: 85, category: "Databases" },
      { id: "14", name: "MongoDB", level: 80, category: "Databases" },
      { id: "15", name: "Redis", level: 75, category: "Databases" },
      { id: "16", name: "Docker", level: 85, category: "Advanced" },
      { id: "17", name: "Kubernetes", level: 75, category: "Advanced" },
      { id: "18", name: "AWS", level: 80, category: "Advanced" },
      { id: "19", name: "Blockchain", level: 70, category: "Advanced" },
      { id: "20", name: "Smart Contracts", level: 65, category: "Advanced" },
      { id: "21", name: "HTML", level: 95, category: "Web" },
      { id: "22", name: "CSS", level: 90, category: "Web" },
      { id: "23", name: "SASS", level: 85, category: "Web" },
      { id: "24", name: "Tailwind CSS", level: 90, category: "Web" },
    ],
    soft: [
      { id: "1", name: "Problem Solving", level: 95 },
      { id: "2", name: "Communication", level: 90 },
      { id: "3", name: "Teamwork", level: 90 },
      { id: "4", name: "Leadership", level: 85 },
      { id: "5", name: "Time Management", level: 85 },
      { id: "6", name: "Adaptability", level: 90 },
      { id: "7", name: "Critical Thinking", level: 95 },
      { id: "8", name: "Creativity", level: 85 },
    ],
    customCategories: [],
    timestamp: 0,
  },
  experience: [
    {
      id: "1",
      title: "Senior Software Engineer",
      company: "Tech Innovations Inc.",
      location: "San Francisco, CA",
      startDate: "2021-01",
      endDate: "",
      current: true,
      description: [
        "Lead a team of 5 engineers in developing a cloud-based SaaS platform",
        "Architected and implemented microservices using Node.js, Express, and MongoDB",
        "Reduced API response time by 40% through optimization and caching strategies",
        "Implemented CI/CD pipelines using GitHub Actions and Docker",
        "Mentored junior developers and conducted code reviews",
      ],
    },
    {
      id: "2",
      title: "Full Stack Developer",
      company: "Digital Solutions LLC",
      location: "Boston, MA",
      startDate: "2018-06",
      endDate: "2020-12",
      current: false,
      description: [
        "Developed responsive web applications using React, Redux, and Node.js",
        "Created RESTful APIs and GraphQL endpoints for client-side consumption",
        "Implemented authentication and authorization using JWT and OAuth",
        "Collaborated with UX/UI designers to implement pixel-perfect designs",
        "Participated in agile development processes with two-week sprints",
      ],
    },
    {
      id: "3",
      title: "Software Engineering Intern",
      company: "Global Tech Corp",
      location: "Seattle, WA",
      startDate: "2017-05",
      endDate: "2017-08",
      current: false,
      description: [
        "Assisted in developing features for an e-commerce platform",
        "Fixed bugs and improved performance of existing codebase",
        "Participated in daily stand-up meetings and sprint planning",
        "Gained experience with React, Node.js, and PostgreSQL",
      ],
    },
  ],
  projects: {
    items: [
      {
        id: "1",
        title: "AI-Powered Financial Advisor",
        category: "Machine Learning",
        category_id: 1,
        description:
          "A financial advisory application that uses machine learning algorithms to provide personalized investment recommendations based on user goals and risk tolerance.",
        image: "/placeholder.svg?height=400&width=600",
        github: "https://github.com/username/ai-financial-advisor",
        demo: "https://ai-financial-advisor.example.com",
        linkedin: "https://linkedin.com/in/username",
        features: [
          "Personalized investment recommendations",
          "Risk assessment algorithms",
          "Portfolio optimization",
          "Market trend analysis",
          "Goal-based planning",
        ],
        technologies: ["Python", "TensorFlow", "Flask", "React", "PostgreSQL", "Docker"],
        date: "2023-01-01",
      },
      {
        id: "2",
        title: "Decentralized Marketplace",
        category: "Blockchain",
        category_id: 2,
        description:
          "A decentralized marketplace built on Ethereum blockchain that allows users to buy and sell digital products without intermediaries, using smart contracts for secure transactions.",
        image: "/placeholder.svg?height=400&width=600",
        github: "https://github.com/username/defi-marketplace",
        demo: "https://defi-marketplace.example.com",
        linkedin: "https://linkedin.com/in/username",
        features: [
          "Smart contract-based transactions",
          "Decentralized authentication",
          "Digital product listings",
          "Escrow system",
          "Rating and review system",
        ],
        technologies: ["Solidity", "Ethereum", "Web3.js", "React", "Node.js", "IPFS"],
        date: "2023-02-15",
      },
      {
        id: "3",
        title: "Real-time Collaboration Tool",
        category: "Web Application",
        category_id: 3,
        description:
          "A real-time collaboration tool that allows teams to work together on documents, code, and designs simultaneously, with features like chat, comments, and version history.",
        image: "/placeholder.svg?height=400&width=600",
        github: "https://github.com/username/collab-tool",
        demo: "https://collab-tool.example.com",
        linkedin: "https://linkedin.com/in/username",
        features: [
          "Real-time document editing",
          "Code collaboration with syntax highlighting",
          "Design collaboration tools",
          "Chat and commenting system",
          "Version history and rollback",
        ],
        technologies: ["React", "Socket.io", "Node.js", "MongoDB", "Redis", "AWS"],
        date: "2023-03-20",
      },
    ],
    categories: [
      { id: 1, name: "Machine Learning" },
      { id: 2, name: "Blockchain" },
      { id: 3, name: "Web Application" },
    ],
    features: [],
    technologies: [],
  },
  certifications: [
    {
      id: "1",
      title: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2022-03",
      certificateUrl: "https://example.com/certificate/aws-architect",
    },
    {
      id: "2",
      title: "TensorFlow Developer Certificate",
      issuer: "Google",
      date: "2021-08",
      certificateUrl: "https://example.com/certificate/tensorflow-dev",
    },
    {
      id: "3",
      title: "Certified Blockchain Developer",
      issuer: "Blockchain Council",
      date: "2021-05",
      certificateUrl: "https://example.com/certificate/blockchain-dev",
    },
    {
      id: "4",
      title: "Professional Scrum Master I",
      issuer: "Scrum.org",
      date: "2020-11",
      certificateUrl: "https://example.com/certificate/scrum-master",
    },
  ],
  achievements: [
    {
      id: "1",
      title: "First Place Hackathon Winner",
      description: "Won first place in the annual tech hackathon with an AI-powered solution for healthcare.",
      date: "2022-06",
      issuer: "TechCrunch Disrupt",
      url: "https://example.com/hackathon-winners-2022",
    },
    {
      id: "2",
      title: "Open Source Contributor of the Month",
      description: "Recognized for significant contributions to the React ecosystem.",
      date: "2021-11",
      issuer: "GitHub",
      url: "https://example.com/oss-contributors-2021",
    },
    {
      id: "3",
      title: "Published Research Paper",
      description: "Co-authored a research paper on efficient deep learning algorithms for edge devices.",
      date: "2020-09",
      issuer: "IEEE International Conference on Machine Learning",
      url: "https://example.com/research-paper-2020",
    },
  ],
  settings: {
    resumeLink: "https://drive.google.com/uc?export=download&id=1JVLB0XEdKztxMybpN-mAg_ZXxxbuR7ZV",
  },
}

// Function to save profile data to local storage
export function saveProfileData(data: ProfileData): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("profileData", JSON.stringify(data))
  }
}

// Function to get profile data from local storage
export function getProfileData(): ProfileData {
  if (typeof window !== "undefined") {
    const savedData = localStorage.getItem("profileData")
    if (savedData) {
      try {
        return JSON.parse(savedData) as ProfileData
      } catch (error) {
        console.error("Error parsing profile data from localStorage:", error)
      }
    }
  }
  return defaultProfileData
}

export function updateProfileSection(section: keyof ProfileData, data: any): void {
  if (typeof window !== "undefined") {
    const existingData = getProfileData()
    const updatedData = { ...existingData, [section]: data }
    localStorage.setItem("profileData", JSON.stringify(updatedData))
  }
}
