"use client"
import {
  Hash,
  Code,
  Database,
  Globe,
  Cpu,
  BarChart,
  Server,
  Cloud,
  Layers,
  Smartphone,
  Terminal,
  GitBranch,
  Zap,
  Shield,
  Bot,
  Braces,
  FileCode,
  Workflow,
  Puzzle,
  Box,
  Infinity,
  Network,
  Laptop,
  Cog,
  Settings,
  PenTool,
  Wrench,
  Gauge,
  Wifi,
  Radio,
  Bluetooth,
  Share2,
  Lock,
  Key,
  FileJson,
  FileText,
  FileSearch,
  FileCheck,
  FileWarning,
  FileX,
  FileVideo,
  FileAudio,
  FileImage,
  Users,
} from "lucide-react"

// Map of icon names to components
const iconMap = {
  hash: Hash,
  code: Code,
  database: Database,
  globe: Globe,
  cpu: Cpu,
  "bar-chart": BarChart,
  server: Server,
  cloud: Cloud,
  layers: Layers,
  smartphone: Smartphone,
  terminal: Terminal,
  "git-branch": GitBranch,
  zap: Zap,
  shield: Shield,
  bot: Bot,
  braces: Braces,
  "file-code": FileCode,
  workflow: Workflow,
  puzzle: Puzzle,
  box: Box,
  infinity: Infinity,
  network: Network,
  laptop: Laptop,
  cog: Cog,
  settings: Settings,
  "pen-tool": PenTool,
  wrench: Wrench,
  gauge: Gauge,
  wifi: Wifi,
  radio: Radio,
  bluetooth: Bluetooth,
  share2: Share2,
  lock: Lock,
  key: Key,
  "file-json": FileJson,
  "file-text": FileText,
  "file-search": FileSearch,
  "file-check": FileCheck,
  "file-warning": FileWarning,
  "file-x": FileX,
  "file-video": FileVideo,
  "file-audio": FileAudio,
  "file-image": FileImage,
  users: Users,

  // Add custom category icons
  languages: Code,
  frameworks: Layers,
  databases: Database,
  web: Globe,
  advanced: Cpu,
  data: BarChart,
}

interface CustomIconProps {
  name: string
  size?: number
  color?: string
  className?: string
}

export function CustomIcon({ name, size = 24, color, className = "" }: CustomIconProps) {
  // Log the icon name for debugging
  console.log(`Rendering icon: ${name}, color: ${color}`)

  // Default to Hash icon if the requested icon doesn't exist
  const IconComponent = iconMap[name] || Hash

  return <IconComponent size={size} className={className} color={color} />
}

interface IconSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function IconSelector({ value, onChange }: IconSelectorProps) {
  // Get all icon names
  const iconNames = Object.keys(iconMap)

  return (
    <div className="grid grid-cols-8 gap-2 p-2 border rounded-md bg-background">
      {iconNames.map((iconName) => {
        const isSelected = value === iconName
        return (
          <button
            key={iconName}
            type="button"
            onClick={() => onChange(iconName)}
            className={`p-2 rounded-md hover:bg-muted transition-colors ${
              isSelected ? "bg-primary/20 ring-1 ring-primary" : ""
            }`}
            title={iconName}
          >
            <CustomIcon name={iconName} size={20} />
          </button>
        )
      })}
    </div>
  )
}
