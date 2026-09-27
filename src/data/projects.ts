export interface Project {
  id: string
  title: string
  description: string
  githubUrl?: string
  websiteUrl?: string
  tags: string[]
}

export const projects: Project[] = [
  {
    id: 'coworker',
    title: 'Coworker',
    description: 'A local-first desktop app for running AI agents that work alongside you on your own machine.',
    githubUrl: 'https://github.com/donvito/coworker',
    websiteUrl: 'https://www.donvitocodes.com/coworker',
    tags: ['Electron', 'AI Agents', 'Desktop'],
  },
  {
    id: 'gaia-personal-setup',
    title: 'GAIA Personal Setup',
    description: 'Installer for running multiple private Hermes Agent assistants on your Mac or Windows PC as Docker containers.',
    githubUrl: 'https://github.com/donvito/gaia-personal-setup',
    websiteUrl: 'https://www.donvitocodes.com/gaia',
    tags: ['Hermes', 'Docker', 'Go'],
  },
  {
    id: 'ai-backends',
    title: 'AI Backends API server',
    description: 'An API server for common AI use cases. Run locally with Ollama or LM Studio, or in the cloud via OpenRouter, OpenAI, Anthropic, or Google.',
    githubUrl: 'https://github.com/donvito/ai-backends',
    websiteUrl: 'https://aibackends.com',
    tags: ['TypeScript', 'API', 'Ollama'],
  },
  {
    id: 'jsonl-viewer',
    title: 'JSONL Viewer',
    description: 'A desktop Electron app for viewing and editing .jsonl / .ndjson files used for fine-tuning and training datasets.',
    githubUrl: 'https://github.com/donvito/jsonl-viewer',
    tags: ['Electron', 'JavaScript', 'JSONL'],
  },
  {
    id: 'skillsbento',
    title: 'Skillsbento',
    description: 'Free agent skills for Claude Code covering business analytics, market research, financial analysis, and social growth.',
    githubUrl: 'https://github.com/donvito/skillsbento',
    websiteUrl: 'https://www.skillsbento.com/',
    tags: ['Claude Code', 'Agent Skills'],
  },
  {
    id: 'hermes-profiles',
    title: 'Hermes Profiles',
    description: 'Installable Hermes Agent profiles for legal assistant, real-estate, home manager, and content creator, each with soul, config, skills, and cron templates.',
    githubUrl: 'https://github.com/donvito/hermes-profiles',
    tags: ['Hermes', 'Shell', 'Profiles'],
  },
  {
    id: 'cursor-sdk-go',
    title: 'Cursor Go SDK',
    description: 'An unofficial Go SDK for the Cursor Cloud Agents API, with typed REST methods, streaming, artifacts, and a high-level agent workflow.',
    githubUrl: 'https://github.com/donvito/cursor-sdk-go',
    tags: ['Go', 'Cursor', 'Cloud Agents'],
  },
  {
    id: 'raibot',
    title: 'Raibot',
    description: 'A chat gateway connecting Discord, Telegram, Slack and Mattermost to Claude agents, with file processing and scheduled messages.',
    githubUrl: 'https://github.com/donvito/raibot',
    tags: ['Python', 'FastAPI', 'Claude'],
  },
  {
    id: 'aibackends',
    title: 'AI Backends (Python)',
    description: 'A Python library to run AI tasks and workflows locally. Works with both CPU and GPU.',
    githubUrl: 'https://github.com/donvito/aibackends',
    websiteUrl: 'https://aibackends.com',
    tags: ['Python', 'Local AI', 'GPU'],
  },
  {
    id: 'markdown-editor',
    title: 'Markdown Editor',
    description: 'A lightweight markdown editor with AI features. Works with Ollama and LM Studio.',
    githubUrl: 'https://github.com/donvito/markdown-editor',
    tags: ['JavaScript', 'Ollama', 'LM Studio'],
  },
]
