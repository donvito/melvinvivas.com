import { useState } from 'react'

interface CityInfo {
  name: string
  country: string
  clues: string[]
}

const CITIES: CityInfo[] = [
  { name: 'Singapore', country: 'Singapore', clues: ['said something about a lion with a fish tail', 'wanted to try chilli crab by the marina', 'asked which way to Merlion Park'] },
  { name: 'Manila', country: 'Philippines', clues: ['was humming about seven thousand islands', 'asked about jeepney routes to Intramuros', 'talked about exchanging cash for pesos'] },
  { name: 'Tokyo', country: 'Japan', clues: ['asked when cherry blossoms bloom', 'wanted to ride the Shinkansen', 'exchanged money for yen'] },
  { name: 'Paris', country: 'France', clues: ['carried a guidebook about a famous iron tower', 'wanted to see the Mona Lisa', 'said au revoir on the way out'] },
  { name: 'Cairo', country: 'Egypt', clues: ['asked about the Great Pyramid tours', 'wanted a boat ride down the Nile', 'kept talking about pharaohs'] },
  { name: 'Rio de Janeiro', country: 'Brazil', clues: ['talked about a statue on a mountain overlooking a bay', 'asked when Carnival starts', 'was practising Portuguese phrases'] },
  { name: 'New York', country: 'United States', clues: ['wanted to see a lady holding a torch', 'talked about a very tall Empire building', 'said they would take the subway to Brooklyn'] },
  { name: 'London', country: 'United Kingdom', clues: ['asked what time Big Ben chimes', 'wanted to ride a red double-decker', 'exchanged money for pounds sterling'] },
  { name: 'Sydney', country: 'Australia', clues: ['mentioned an opera house shaped like sails', 'wanted to see kangaroos', 'asked about the Harbour Bridge climb'] },
  { name: 'Nairobi', country: 'Kenya', clues: ['asked about safaris and the Great Migration', 'was reading about Swahili greetings', 'exchanged money for shillings'] },
  { name: 'Mexico City', country: 'Mexico', clues: ['asked about Aztec ruins at the city centre', 'wanted tacos al pastor', 'was practising Spanish'] },
  { name: 'Istanbul', country: 'Turkey', clues: ['wanted to see a city on two continents', 'asked about the Grand Bazaar', 'talked about the Blue Mosque'] },
  { name: 'Moscow', country: 'Russia', clues: ['mentioned colourful onion domes on a square', 'asked about the Kremlin', 'exchanged money for rubles'] },
  { name: 'Mumbai', country: 'India', clues: ['talked about a big film industry by the sea', 'asked about the Gateway of India', 'exchanged money for rupees'] },
  { name: 'Reykjavik', country: 'Iceland', clues: ['wanted to see the northern lights', 'asked about hot springs and geysers', 'packed a very thick parka'] },
  { name: 'Buenos Aires', country: 'Argentina', clues: ['wanted to learn tango', 'asked about the best steakhouse', 'talked about the Obelisco'] },
]

type Trait = 'hair' | 'hobby' | 'vehicle' | 'feature'
interface Suspect {
  name: string
  hair: string
  hobby: string
  vehicle: string
  feature: string
}
const SUSPECTS: Suspect[] = [
  { name: 'Carmen Sandwich', hair: 'red', hobby: 'tennis', vehicle: 'limousine', feature: 'ring' },
  { name: 'Baron Von Byte', hair: 'black', hobby: 'chess', vehicle: 'motorcycle', feature: 'tattoo' },
  { name: 'Lady Latte', hair: 'blonde', hobby: 'croquet', vehicle: 'convertible', feature: 'scar' },
  { name: 'Dr. Null Pointer', hair: 'grey', hobby: 'mountain climbing', vehicle: 'limousine', feature: 'tattoo' },
  { name: 'Sir Segfault', hair: 'brown', hobby: 'tennis', vehicle: 'motorcycle', feature: 'ring' },
  { name: 'Miss Merge Conflict', hair: 'red', hobby: 'chess', vehicle: 'convertible', feature: 'scar' },
  { name: 'Captain Cache', hair: 'blonde', hobby: 'mountain climbing', vehicle: 'limousine', feature: 'scar' },
  { name: 'Duchess Debug', hair: 'black', hobby: 'croquet', vehicle: 'motorcycle', feature: 'ring' },
]
const TRAITS: Trait[] = ['hair', 'hobby', 'vehicle', 'feature']
const TRAIT_LABEL: Record<Trait, string> = { hair: 'Hair', hobby: 'Hobby', vehicle: 'Vehicle', feature: 'Feature' }
const traitClue = (t: Trait, v: string) =>
  ({ hair: `had ${v} hair`, hobby: `was talking about ${v}`, vehicle: `left in a ${v}`, feature: `had a distinctive ${v}` })[t]

const LOOT = ['the Merlion statue', 'the Golden Jeepney', 'the Crown Jewels', 'the Mona Lisa', 'a Tyrannosaurus skull', 'the Liberty Bell']
const PLACES = ['Hotel', 'Library', 'Bank', 'Museum', 'Airport lounge', 'Café', 'Bazaar', 'Harbour']

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]
const shuffle = <T,>(arr: T[]) => arr.map((v) => [Math.random(), v] as const).sort((a, b) => a[0] - b[0]).map((x) => x[1])

interface Case {
  culprit: Suspect
  loot: string
  route: CityInfo[] // route[0] = crime scene
  places: string[][] // 3 place names per stop
  hours: number
  step: number // index into route
  investigated: Set<number>
  known: Partial<Record<Trait, string>>
  warrant: string | null
  status: 'play' | 'won' | 'lost'
  log: string[]
  options: CityInfo[]
}

const HOURS = 150
const STOPS = 5

function newCase(): Case {
  const route = shuffle(CITIES).slice(0, STOPS)
  const loot = pick(LOOT)
  return {
    culprit: pick(SUSPECTS),
    loot,
    route,
    places: route.map(() => shuffle(PLACES).slice(0, 3)),
    hours: HOURS,
    step: 0,
    investigated: new Set(),
    known: {},
    warrant: null,
    status: 'play',
    log: [`Chief: ${loot} has been stolen from ${route[0].name}! You have ${HOURS} hours. Interview witnesses, track the thief, and issue a warrant before the arrest.`],
    options: optionsFor(route, 0),
  }
}

function optionsFor(route: CityInfo[], step: number) {
  const next = route[step + 1]
  const decoys = shuffle(CITIES.filter((c) => c !== next && c !== route[step])).slice(0, 3)
  return shuffle(next ? [next, ...decoys] : decoys)
}

export function DetectiveApp() {
  const [c, setC] = useState<Case>(newCase)
  const here = c.route[c.step]
  const last = c.step === c.route.length - 1
  const unknown = TRAITS.filter((t) => !c.known[t])

  const spend = (k: Case, h: number) => {
    k.hours -= h
    if (k.hours <= 0) {
      k.hours = 0
      k.status = 'lost'
      k.log.unshift(`Time's up. ${k.culprit.name} slipped away with ${k.loot}.`)
    }
  }

  const investigate = (slot: number) => {
    if (c.status !== 'play' || c.investigated.has(slot)) return
    const k: Case = { ...c, investigated: new Set(c.investigated), known: { ...c.known }, log: [...c.log] }
    k.investigated.add(slot)
    let clue: string
    if (last) {
      clue = slot === 0 ? `The suspect is hiding nearby. Make sure your warrant is right, then click Arrest!` : `Witness: someone ${traitClue(unknown[0] ?? 'hair', unknown[0] ? c.culprit[unknown[0]] : c.culprit.hair)} was seen here.`
      if (slot !== 0 && unknown[0]) k.known[unknown[0]] = c.culprit[unknown[0]]
    } else if (slot === 2 && unknown.length) {
      const t = pick(unknown)
      k.known[t] = c.culprit[t]
      clue = `Witness: the suspect ${traitClue(t, c.culprit[t])}.`
    } else {
      const next = c.route[c.step + 1]
      clue = `Witness: the suspect ${next.clues[slot % next.clues.length]}.`
    }
    k.log.unshift(`${c.places[c.step][slot]}, ${here.name}: ${clue}`)
    spend(k, 3)
    setC(k)
  }

  const travel = (dest: CityInfo) => {
    if (c.status !== 'play') return
    const k: Case = { ...c, log: [...c.log] }
    spend(k, 10)
    if (k.status !== 'play') return setC(k)
    if (dest === c.route[c.step + 1]) {
      k.step++
      k.investigated = new Set()
      k.options = optionsFor(k.route, k.step)
      k.log.unshift(`Arrived in ${dest.name}, ${dest.country}. ${k.step === k.route.length - 1 ? 'This looks like the end of the trail.' : 'The trail is warm.'}`)
    } else {
      k.log.unshift(`Flew to ${dest.name}… nobody has seen the suspect. Wrong turn! You fly back to ${here.name}.`)
      spend(k, 10)
    }
    setC(k)
  }

  const arrest = () => {
    if (c.status !== 'play') return
    const k: Case = { ...c, log: [...c.log] }
    if (!k.warrant) k.log.unshift('You need a warrant first! Match the suspect traits below.')
    else if (k.warrant === c.culprit.name) {
      k.status = 'won'
      k.log.unshift(`Case closed! ${c.culprit.name} arrested in ${here.name} and ${c.loot} recovered with ${k.hours} hours to spare.`)
    } else {
      k.status = 'lost'
      k.log.unshift(`Wrong warrant! You arrested ${k.warrant}, but the real thief ${c.culprit.name} got away.`)
    }
    setC(k)
  }

  const matches = SUSPECTS.filter((s) => TRAITS.every((t) => !c.known[t] || s[t] === c.known[t]))

  return (
    <div className="det">
      <div className="xp-menubar">
        <span onClick={() => setC(newCase())}>New Case</span>
        <span>Help</span>
      </div>
      <div className="det-body">
        <div className="det-main">
          <div className="det-header">
            <div>
              <b>{here.name}</b>, {here.country}
            </div>
            <div className={c.hours < 30 ? 'det-low' : ''}>⏱ {c.hours}h left</div>
          </div>
          <div className="det-log">
            {c.log.map((l, i) => (
              <p key={i} className={i === 0 ? 'det-latest' : ''}>
                {l}
              </p>
            ))}
          </div>
          {c.status === 'play' ? (
            <>
              <div className="det-section">Investigate (3h)</div>
              <div className="det-row">
                {c.places[c.step].map((p, i) => (
                  <button key={p} className="xp-btn" disabled={c.investigated.has(i)} onClick={() => investigate(i)}>
                    {p}
                  </button>
                ))}
              </div>
              {last ? (
                <div className="det-row">
                  <button className="xp-btn det-arrest" onClick={arrest}>
                    Arrest!
                  </button>
                </div>
              ) : (
                <>
                  <div className="det-section">Travel (10h)</div>
                  <div className="det-row">
                    {c.options.map((o) => (
                      <button key={o.name} className="xp-btn" onClick={() => travel(o)}>
                        ✈ {o.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="det-row">
              <button className="xp-btn" onClick={() => setC(newCase())}>
                {c.status === 'won' ? 'Next case' : 'Try again'}
              </button>
            </div>
          )}
        </div>
        <div className="det-side">
          <div className="det-section">Dossier</div>
          <table className="det-traits">
            <tbody>
              {TRAITS.map((t) => (
                <tr key={t}>
                  <td>{TRAIT_LABEL[t]}</td>
                  <td>{c.known[t] ?? '?'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="det-section">Warrant</div>
          <select className="xp-select" value={c.warrant ?? ''} onChange={(e) => setC({ ...c, warrant: e.target.value || null })} disabled={c.status !== 'play'}>
            <option value="">— choose suspect —</option>
            {SUSPECTS.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name}
                {matches.includes(s) ? '' : ' (ruled out)'}
              </option>
            ))}
          </select>
          <div className="det-hint">
            {matches.length} suspect{matches.length === 1 ? '' : 's'} match the dossier.
          </div>
          <div className="det-section">Route</div>
          <ol className="det-route">
            {c.route.slice(0, c.step + 1).map((r) => (
              <li key={r.name}>{r.name}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
