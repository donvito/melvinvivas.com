export interface Video {
  id: string
  title: string
  date?: string
}

export const YOUTUBE_CHANNEL = 'https://www.youtube.com/@melvindvivas'

// YouTube video IDs from the channel. Newest first.
export const videos: Video[] = [
  { id: 'AupWJytXTwQ', title: 'NTU Bolt Demo', date: '2026-09-14' },
  { id: 'qq391HAIOLc', title: 'Claude Plan Mode', date: '2026-02-13' },
  { id: '7m4fG2VgmXU', title: "Let's Build a Todo List app using Bolt", date: '2025-07-18' },
  { id: 'Eqx50ve6wSY', title: "Let's Build a Todo List App using Lovable", date: '2025-07-18' },
  { id: 'b2Ym-i0MhRk', title: "Let's build a Todo List App using Replit", date: '2025-07-18' },
  { id: '01Fn4Kbb7h0', title: "Let's Build a Todo List app using v0", date: '2025-07-18' },
  { id: 'bHFXFw7JhzQ', title: 'Walkthrough of v0.dev, an online AI app builder by Vercel', date: '2025-07-18' },
  { id: 'iL2I0sNgZdk', title: 'Walkthrough of Replit, a fullstack AI app builder', date: '2025-07-18' },
  { id: 'ZRJQe6lYPLE', title: 'Controlling coding with Bolt: target and lock files', date: '2025-07-18' },
  { id: 'XXF_nQHfLw4', title: 'Deploying your App to Netlify in Bolt.new', date: '2025-07-18' },
  { id: 'EoWHanHswCg', title: 'Enrich your Life and Work with AI' },
  { id: '-m_S_0F3cNU', title: "Let's explore ChatGPT/OpenAI APIs" },
  { id: 'mPVToFWLxFY', title: 'Generate Images using AI' },
]
