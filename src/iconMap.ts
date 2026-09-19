import { ComputerIcon, FolderIcon, IEIcon, NotepadIcon, MediaIcon, MailIcon, ResumeIcon, RecycleIcon, MinesIcon, CalcIcon, BirdIcon, CardsIcon } from './icons'

export const icons = {
  computer: ComputerIcon,
  folder: FolderIcon,
  ie: IEIcon,
  notepad: NotepadIcon,
  media: MediaIcon,
  mail: MailIcon,
  resume: ResumeIcon,
  recycle: RecycleIcon,
  mines: MinesIcon,
  calc: CalcIcon,
  bird: BirdIcon,
  cards: CardsIcon,
} as const

export type IconName = keyof typeof icons
