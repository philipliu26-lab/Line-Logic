/**
 * Full rosters for featured games (same ids as MOCK_PICKS).
 * Lineups mirror each team's most recent game before the preview (or the shared
 * head-to-head for MLB pick 2). Stat columns are season totals through the
 * labeled window — not single-game box scores.
 */

export type RosterStatColumn = { key: string; label: string };

export type RosterPlayer = {
  name: string;
  pos: string;
  num: string;
  /** Season stats aligned to `columns` */
  stats: number[];
};

/** Out / GTD — excluded from active lineup tables */
export type InjuredPlayer = {
  name: string;
  pos: string;
  num: string;
  /** Short injury label */
  status: string;
};

export type RosterTeam = {
  name: string;
  abbr: string;
  players: RosterPlayer[];
  injured: InjuredPlayer[];
};

export type GameRosterDefinition = {
  pickId: string;
  sport: 'NBA' | 'MLB';
  statWindowLabel: string;
  columns: RosterStatColumn[];
  away: RosterTeam;
  home: RosterTeam;
};

function cloneRoster(def: GameRosterDefinition): GameRosterDefinition {
  return JSON.parse(JSON.stringify(def)) as GameRosterDefinition;
}

export const GAME_ROSTERS: Record<string, GameRosterDefinition> = {
  '1': {
    pickId: '1',
    sport: 'NBA',
    statWindowLabel:
      '2025–26 NBA through Apr 12, 2026 · Active lineups from GSW @ LAC (Apr 12)',
    columns: [
      { key: 'gp', label: 'GP' },
      { key: 'ppg', label: 'PPG' },
      { key: 'rpg', label: 'RPG' },
      { key: 'apg', label: 'APG' },
    ],
    away: {
      name: 'Golden State Warriors',
      abbr: 'GSW',
      injured: [
        { name: 'Draymond Green', pos: 'F', num: '23', status: 'DNP — Apr 12 vs LAC' },
        { name: 'Jimmy Butler III', pos: 'F', num: '10', status: 'Out — not in Apr 12 rotation' },
        { name: 'Moses Moody', pos: 'G', num: '4', status: 'Out — not in Apr 12 rotation' },
      ],
      players: [
        // Starters @ LAC Apr 12
        { name: 'Stephen Curry', pos: 'G', num: '30', stats: [43, 26.6, 3.6, 4.7] },
        { name: 'Kristaps Porziņģis', pos: 'C', num: '7', stats: [15, 16.1, 5.3, 2.3] },
        { name: 'Brandin Podziemski', pos: 'G', num: '2', stats: [82, 13.8, 5.1, 3.7] },
        { name: "De'Anthony Melton", pos: 'G', num: '8', stats: [49, 12.3, 3.2, 2.6] },
        { name: 'Al Horford', pos: 'C', num: '20', stats: [45, 8.3, 4.9, 2.6] },
        // Reserves (played Apr 12)
        { name: 'Will Richard', pos: 'G', num: '3', stats: [69, 6.4, 2.5, 1.3] },
        { name: 'Pat Spencer', pos: 'G', num: '61', stats: [66, 7.2, 2.4, 3.5] },
        { name: 'Charles Bassey', pos: 'C', num: '28', stats: [5, 10.6, 7.2, 1.0] },
        { name: 'Malevy Leons', pos: 'F', num: '33', stats: [25, 3.3, 2.1, 0.9] },
        { name: 'Gui Santos', pos: 'F', num: '15', stats: [68, 9.2, 3.9, 2.3] },
        { name: 'Nate Williams', pos: 'G', num: '19', stats: [14, 8.0, 2.1, 1.0] },
        { name: 'Seth Curry', pos: 'G', num: '31', stats: [10, 7.1, 1.2, 1.0] },
        { name: 'Gary Payton II', pos: 'G', num: '0', stats: [73, 7.5, 3.6, 1.7] },
      ],
    },
    home: {
      name: 'LA Clippers',
      abbr: 'LAC',
      injured: [
        { name: 'Cam Christie', pos: 'G', num: '12', status: 'DNP — coach’s decision (Apr 12)' },
        { name: 'Norchad Omier', pos: 'F', num: '55', status: 'DNP — coach’s decision (Apr 12)' },
        { name: 'Sean Pedulla', pos: 'G', num: '00', status: 'DNP — coach’s decision (Apr 12)' },
        { name: 'TyTy Washington Jr.', pos: 'G', num: '15', status: 'DNP — coach’s decision (Apr 12)' },
      ],
      players: [
        { name: 'Kawhi Leonard', pos: 'F', num: '2', stats: [65, 27.9, 6.4, 3.6] },
        { name: 'Darius Garland', pos: 'G', num: '10', stats: [19, 19.9, 2.3, 6.4] },
        { name: 'Brook Lopez', pos: 'C', num: '11', stats: [75, 8.5, 3.6, 1.3] },
        { name: 'Kris Dunn', pos: 'G', num: '8', stats: [82, 7.3, 3.3, 3.6] },
        { name: 'Derrick Jones Jr.', pos: 'F', num: '5', stats: [50, 10.1, 3.5, 1.4] },
        { name: 'John Collins', pos: 'F', num: '20', stats: [69, 13.6, 5.3, 1.0] },
        { name: 'Bennedict Mathurin', pos: 'F', num: '9', stats: [26, 17.4, 5.5, 2.5] },
        { name: 'Jordan Miller', pos: 'F', num: '22', stats: [60, 10.0, 3.0, 2.3] },
        { name: 'Kobe Sanders', pos: 'G', num: '4', stats: [68, 7.3, 2.3, 1.6] },
        { name: 'Nicolas Batum', pos: 'F', num: '33', stats: [74, 4.0, 2.5, 0.9] },
        { name: 'Bogdan Bogdanović', pos: 'G', num: '7', stats: [23, 7.4, 2.6, 2.2] },
      ],
    },
  },
  '2': {
    pickId: '2',
    sport: 'MLB',
    statWindowLabel:
      '2026 MLB through Apr 13 (LAD 4–0 vs NYM at Dodger Stadium — both teams’ last game)',
    columns: [
      { key: 'avg', label: 'AVG' },
      { key: 'hr', label: 'HR' },
      { key: 'rbi', label: 'RBI' },
      { key: 'ops', label: 'OPS' },
    ],
    away: {
      name: 'New York Mets',
      abbr: 'NYM',
      injured: [{ name: 'Juan Soto', pos: 'LF', num: '22', status: '10-day IL' }],
      players: [
        { name: 'Francisco Alvarez', pos: 'C', num: '4', stats: [0.302, 4, 4, 0.992] },
        { name: 'Mark Vientos', pos: '1B', num: '27', stats: [0.244, 1, 5, 0.639] },
        { name: 'Marcus Semien', pos: '2B', num: '2', stats: [0.197, 1, 6, 0.532] },
        { name: 'Francisco Lindor', pos: 'SS', num: '12', stats: [0.176, 0, 0, 0.541] },
        { name: 'Bo Bichette', pos: '3B', num: '11', stats: [0.225, 1, 9, 0.569] },
        { name: 'Luis Robert Jr.', pos: 'CF', num: '88', stats: [0.3, 2, 7, 0.855] },
        { name: 'Brett Baty', pos: 'RF', num: '7', stats: [0.231, 0, 7, 0.549] },
        { name: 'Jorge Polanco', pos: 'DH', num: '18', stats: [0.192, 1, 2, 0.571] },
      ],
    },
    home: {
      name: 'Los Angeles Dodgers',
      abbr: 'LAD',
      injured: [{ name: 'Mookie Betts', pos: 'SS', num: '50', status: '10-day IL' }],
      players: [
        { name: 'Will Smith', pos: 'C', num: '16', stats: [0.298, 2, 8, 0.826] },
        { name: 'Freddie Freeman', pos: '1B', num: '5', stats: [0.273, 3, 13, 0.809] },
        { name: 'Alex Freeland', pos: '2B', num: '77', stats: [0.22, 1, 2, 0.63] },
        { name: 'Max Muncy', pos: '3B', num: '13', stats: [0.226, 4, 4, 0.769] },
        { name: 'Teoscar Hernández', pos: 'LF', num: '37', stats: [0.314, 3, 11, 0.906] },
        { name: 'Andy Pages', pos: 'CF', num: '44', stats: [0.417, 5, 20, 1.186] },
        { name: 'Kyle Tucker', pos: 'RF', num: '30', stats: [0.237, 1, 9, 0.657] },
        { name: 'Shohei Ohtani', pos: 'DH', num: '17', stats: [0.267, 5, 10, 0.944] },
      ],
    },
  },
  '3': {
    pickId: '3',
    sport: 'MLB',
    statWindowLabel:
      '2026 MLB through Apr 12 (SFG last @ BAL Apr 12; CIN last vs LAA Apr 12 — season batting)',
    columns: [
      { key: 'avg', label: 'AVG' },
      { key: 'hr', label: 'HR' },
      { key: 'rbi', label: 'RBI' },
      { key: 'ops', label: 'OPS' },
    ],
    away: {
      name: 'San Francisco Giants',
      abbr: 'SF',
      injured: [],
      players: [
        { name: 'Patrick Bailey', pos: 'C', num: '14', stats: [0.146, 0, 1, 0.351] },
        { name: 'Casey Schmitt', pos: '1B', num: '0', stats: [0.368, 1, 4, 1.008] },
        { name: 'Luis Arraez', pos: '2B', num: '4', stats: [0.304, 0, 6, 0.732] },
        { name: 'Willy Adames', pos: 'SS', num: '2', stats: [0.258, 2, 5, 0.813] },
        { name: 'Matt Chapman', pos: '3B', num: '26', stats: [0.29, 1, 7, 0.763] },
        { name: 'Heliot Ramos', pos: 'LF', num: '17', stats: [0.241, 0, 6, 0.543] },
        { name: 'Harrison Bader', pos: 'CF', num: '28', stats: [0.115, 1, 3, 0.338] },
        { name: 'Jung Hoo Lee', pos: 'RF', num: '51', stats: [0.185, 1, 7, 0.561] },
      ],
    },
    home: {
      name: 'Cincinnati Reds',
      abbr: 'CIN',
      injured: [{ name: 'Jose Trevino', pos: 'C', num: '35', status: '10-day IL' }],
      players: [
        { name: 'Tyler Stephenson', pos: 'C', num: '37', stats: [0.171, 2, 3, 0.636] },
        { name: 'Sal Stewart', pos: '1B', num: '16', stats: [0.309, 4, 10, 1.035] },
        { name: 'Matt McLain', pos: '2B', num: '9', stats: [0.217, 0, 3, 0.595] },
        { name: 'Elly De La Cruz', pos: 'SS', num: '44', stats: [0.281, 5, 10, 0.924] },
        { name: "Ke'Bryan Hayes", pos: '3B', num: '13', stats: [0.079, 0, 0, 0.225] },
        { name: 'Spencer Steer', pos: 'LF', num: '7', stats: [0.176, 2, 4, 0.571] },
        { name: 'TJ Friedl', pos: 'CF', num: '29', stats: [0.153, 0, 1, 0.438] },
        { name: 'Noelvi Marté', pos: 'RF', num: '12', stats: [0.138, 0, 0, 0.331] },
      ],
    },
  },
};

export function getGameRosterByPickId(pickId: string): GameRosterDefinition | undefined {
  const def = GAME_ROSTERS[pickId];
  return def ? cloneRoster(def) : undefined;
}
