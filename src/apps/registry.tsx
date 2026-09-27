import type { ComponentType } from 'react'
import type { IconName } from '../iconMap'
import { AboutApp } from './AboutApp'
import { ProjectsApp } from './ProjectsApp'
import { BlogApp } from './BlogApp'
import { VideosApp } from './VideosApp'
import { ContactApp } from './ContactApp'
import { ResumeApp } from './ResumeApp'
import { MinesweeperApp } from './MinesweeperApp'
import { RecycleApp } from './RecycleApp'
import { CalculatorApp } from './CalculatorApp'
import { FlappyApp } from './FlappyApp'
import { SolitaireApp } from './SolitaireApp'
import { PlatformerApp } from './PlatformerApp'
import { PongApp } from './PongApp'
import { BreakoutApp } from './BreakoutApp'
import { AsteroidsApp } from './AsteroidsApp'
import { CityApp } from './CityApp'
import { DetectiveApp } from './DetectiveApp'

export interface AppDef {
  id: string
  title: string
  windowTitle?: string
  icon: IconName
  component: ComponentType
  size: { w: number; h: number }
  desktop: boolean
  startMenu: boolean
  game?: boolean
  /** Rendered with no padding; app manages its own chrome (menu bars etc). */
  bare?: boolean
}

export const apps = [
  {
    id: 'about',
    title: 'About Me',
    windowTitle: 'About Me - Notepad',
    icon: 'notepad',
    component: AboutApp,
    size: { w: 640, h: 520 },
    desktop: true,
    startMenu: true,
    bare: true,
  },
  {
    id: 'projects',
    title: 'My Projects',
    icon: 'folder',
    component: ProjectsApp,
    size: { w: 760, h: 540 },
    desktop: true,
    startMenu: true,
    bare: true,
  },
  {
    id: 'blog',
    title: 'Blog',
    windowTitle: 'Melvin Vivas Tech Blog - Microsoft Internet Explorer',
    icon: 'ie',
    component: BlogApp,
    size: { w: 820, h: 580 },
    desktop: true,
    startMenu: true,
    bare: true,
  },
  {
    id: 'videos',
    title: 'Videos',
    windowTitle: 'Windows Media Player',
    icon: 'media',
    component: VideosApp,
    size: { w: 720, h: 520 },
    desktop: true,
    startMenu: true,
    bare: true,
  },
  {
    id: 'resume',
    title: 'Resume',
    windowTitle: 'Resume.doc - WordPad',
    icon: 'resume',
    component: ResumeApp,
    size: { w: 700, h: 600 },
    desktop: true,
    startMenu: true,
    bare: true,
  },
  {
    id: 'contact',
    title: 'Contact',
    windowTitle: 'New Message - Outlook Express',
    icon: 'mail',
    component: ContactApp,
    size: { w: 600, h: 480 },
    desktop: true,
    startMenu: true,
    bare: true,
  },
  {
    id: 'minesweeper',
    title: 'Minesweeper',
    icon: 'mines',
    component: MinesweeperApp,
    size: { w: 280, h: 360 },
    desktop: true,
    startMenu: true,
    game: true,
    bare: true,
  },
  {
    id: 'flappy',
    title: 'Flappy Bird',
    icon: 'bird',
    component: FlappyApp,
    size: { w: 318, h: 508 },
    desktop: true,
    startMenu: true,
    game: true,
    bare: true,
  },
  {
    id: 'solitaire',
    title: 'Solitaire',
    icon: 'cards',
    component: SolitaireApp,
    size: { w: 560, h: 520 },
    desktop: true,
    startMenu: true,
    game: true,
    bare: true,
  },
  {
    id: 'platformer',
    title: 'Super Melvin',
    windowTitle: 'Super Melvin Bros',
    icon: 'platformer',
    component: PlatformerApp,
    size: { w: 624, h: 448 },
    desktop: true,
    startMenu: true,
    game: true,
    bare: true,
  },
  {
    id: 'pong',
    title: 'Pong',
    icon: 'pong',
    component: PongApp,
    size: { w: 508, h: 410 },
    desktop: true,
    startMenu: true,
    game: true,
    bare: true,
  },
  {
    id: 'breakout',
    title: 'Breakout',
    icon: 'breakout',
    component: BreakoutApp,
    size: { w: 508, h: 450 },
    desktop: true,
    startMenu: true,
    game: true,
    bare: true,
  },
  {
    id: 'asteroids',
    title: 'Asteroids',
    icon: 'asteroids',
    component: AsteroidsApp,
    size: { w: 508, h: 490 },
    desktop: true,
    startMenu: true,
    game: true,
    bare: true,
  },
  {
    id: 'city',
    title: 'MelvinCity',
    windowTitle: 'MelvinCity - Mayor Melvin',
    icon: 'city',
    component: CityApp,
    size: { w: 680, h: 440 },
    desktop: true,
    startMenu: true,
    game: true,
    bare: true,
  },
  {
    id: 'detective',
    title: 'World Detective',
    windowTitle: 'Where in the World is Carmen Sandwich?',
    icon: 'detective',
    component: DetectiveApp,
    size: { w: 680, h: 480 },
    desktop: true,
    startMenu: true,
    game: true,
    bare: true,
  },
  {
    id: 'calculator',
    title: 'Calculator',
    icon: 'calc',
    component: CalculatorApp,
    size: { w: 300, h: 262 },
    desktop: true,
    startMenu: true,
    bare: true,
  },
  {
    id: 'recycle',
    title: 'Recycle Bin',
    icon: 'recycle',
    component: RecycleApp,
    size: { w: 560, h: 420 },
    desktop: true,
    startMenu: false,
    bare: true,
  },
] as const satisfies readonly AppDef[]

export type AppId = (typeof apps)[number]['id']

export const appById = (id: string): AppDef | undefined => apps.find((a) => a.id === id)
export const isAppId = (id: string): id is AppId => apps.some((a) => a.id === id)
