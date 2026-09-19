import type { IconName } from "./components/Icon";
import type { AppId } from "./window-manager";

export const apps: Record<
  AppId,
  { title: string; short: string; icon: IconName; description: string }
> = {
  welcome: {
    title: "Welcome to my desktop",
    short: "Welcome",
    icon: "computer",
    description: "A little introduction",
  },
  about: {
    title: "About Me — System Properties",
    short: "About Me",
    icon: "computer",
    description: "The human behind the screen",
  },
  projects: {
    title: "My Projects",
    short: "My Projects",
    icon: "folder",
    description: "Things I’m building",
  },
  writing: {
    title: "My Writing",
    short: "My Writing",
    icon: "writing",
    description: "Notes from the journey",
  },
  contact: {
    title: "Let’s Connect — Address Book",
    short: "Let’s Connect",
    icon: "contact",
    description: "Say hello, internet friend",
  },
  notepad: {
    title: "Untitled — Notepad",
    short: "Notepad",
    icon: "notepad",
    description: "A space for your thoughts",
  },
  recycle: {
    title: "Recycle Bin",
    short: "Recycle Bin",
    icon: "recycle",
    description: "Some things are better deleted",
  },
  settings: {
    title: "Display Properties",
    short: "Display",
    icon: "settings",
    description: "Make yourself at home",
  },
};

export const projects = [
  {
    name: "AIBackends",
    category: "AI & agents",
    type: "Open source",
    icon: "code" as const,
    description:
      "One self-hosted API server. Multiple AI models and providers. Built for developers who like to stay in control.",
    url: "https://github.com/donvito/ai-backends",
    tech: "TypeScript · Bun · Hono",
  },
  {
    name: "Coworker",
    category: "AI & agents",
    type: "Desktop app",
    icon: "computer" as const,
    description:
      "A local-first desktop companion for working with AI agents, right where your work happens.",
    url: "https://www.donvitocodes.com/coworker",
    tech: "Desktop · AI agents",
  },
  {
    name: "GAIA",
    category: "AI & agents",
    type: "Open source",
    icon: "web" as const,
    description:
      "A personal AI assistant setup that brings your own assistant into a self-hosted environment.",
    url: "https://github.com/donvito/gaia-personal-setup",
    tech: "Go · Docker",
  },
  {
    name: "RAIBOT",
    category: "Developer tools",
    type: "Open source",
    icon: "contact" as const,
    description:
      "Bring AI conversations and agents to Discord, Telegram, Slack, and Mattermost.",
    url: "https://github.com/donvito/raibot",
    tech: "Python · FastAPI",
  },
  {
    name: "DonvitoCodes",
    category: "Community",
    type: "My other home",
    icon: "writing" as const,
    description:
      "AI training, practical guides, technical writing, and conversations about building with new technology.",
    url: "https://www.donvitocodes.com",
    tech: "Learning · Sharing · Building",
  },
];

export const articles = [
  {
    title: "Using the Claude Agent SDK for Non-Coding Workflows",
    date: "October 30, 2025",
    tag: "AI agents",
    description:
      "Exploring a news researcher that gathers information and hands off to a translation sub-agent.",
    url: "https://blog.donvitocodes.com/using-the-claude-agent-sdk-for-non-coding-workflows",
  },
  {
    title: "Building a Java API with Spring AI and Ollama",
    date: "September 27, 2025",
    tag: "Development",
    description:
      "Connecting a Java API to local language models and multiple AI providers, one practical step at a time.",
    url: "https://blog.donvitocodes.com/building-a-java-api-connecting-to-llms-with-spring-ai-and-ollama-local-models",
  },
  {
    title: "Java-Based AI Solutions for Enterprises",
    date: "September 20, 2025",
    tag: "AI in practice",
    description:
      "Where Java fits in enterprise AI: real use cases, practical considerations, and the road ahead.",
    url: "https://blog.donvitocodes.com/java-based-ai-solutions-for-enterprises-viability-use-cases-and-market-outlook",
  },
  {
    title: "9 Ways AI Can Be Useful for Emails",
    date: "August 26, 2025",
    tag: "Everyday AI",
    description:
      "Small, useful ways to make email less of a chore — from thoughtful replies to managing busy conversations.",
    url: "https://blog.donvitocodes.com/9-ways-how-ai-can-be-useful-for-emails",
  },
];

export const socialLinks = [
  {
    name: "LinkedIn",
    handle: "Let’s talk work, ideas, and AI",
    url: "https://www.linkedin.com/in/melvinvivas/",
    icon: "contact" as const,
  },
  {
    name: "GitHub",
    handle: "@donvito · code lives here",
    url: "https://github.com/donvito",
    icon: "code" as const,
  },
  {
    name: "X / Twitter",
    handle: "@melvindvivas · thinking out loud",
    url: "https://x.com/melvindvivas",
    icon: "web" as const,
  },
  {
    name: "Book a conversation",
    handle: "Find a time on my calendar",
    url: "https://cal.com/donvitocodes",
    icon: "notepad" as const,
  },
];
