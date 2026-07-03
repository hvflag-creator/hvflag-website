export type SeasonStat = {
  playerName: string;
  teamName: string;
  // Passing
  passAtt:  number; passCmp:  number; passYds: number; passTDs: number; passInt: number;
  // Rushing
  rushAtt:  number; rushYds:  number; rushTDs: number;
  // Receiving
  recTgt:   number; recRec:   number; recYds:  number; recTDs:  number;
  // Defense
  defInt:   number; defPBU:   number; defSacks: number; defPulls: number;
  defFF:    number; defFR:    number; defTDs:   number; defTFL:   number;
  // Kicking
  fgMade: number;
  // Special (legacy — tracked in early seasons)
  pancakes: number;
};

export type HistoricalSeason = {
  id: string;
  name: string;
  stats: SeasonStat[];
};

const _ = (p: { playerName: string; teamName: string } & Partial<SeasonStat>): SeasonStat => ({
  passAtt: 0, passCmp: 0, passYds: 0, passTDs: 0, passInt: 0,
  rushAtt: 0, rushYds: 0, rushTDs: 0,
  recTgt: 0,  recRec: 0,  recYds: 0,  recTDs: 0,
  defInt: 0,  defPBU: 0,  defSacks: 0, defPulls: 0,
  defFF: 0,   defFR: 0,   defTDs: 0,   defTFL: 0,
  fgMade: 0, pancakes: 0,
  ...p,
});

export const HISTORICAL_SEASONS: HistoricalSeason[] = [
  { id: "winter-2020", name: "Winter 2020", stats: [
    _({ playerName: "Finn Costello",   teamName: "", passYds: 1217, passTDs: 13, passInt:  7, rushYds: 112 }),
    _({ playerName: "Besim Dika",      teamName: "", passYds:  913, passTDs:  9, passInt: 10, rushYds:  30, rushTDs: 1, recRec:  9, recYds:  79, recTDs: 1, defInt: 2, defSacks: 2, defTDs: 2 }),
    _({ playerName: "Shane Green",     teamName: "", passYds:  175, passTDs:  4, passInt:  1, recRec:   6, recYds: 130, recTDs: 1, defInt: 4, fgMade: 1 }),
    _({ playerName: "Matt Manzoeillo", teamName: "", passYds:   88, passTDs:  2, passInt:  3, rushYds:  41, recRec: 14, recYds: 203, recTDs: 2, defInt: 2 }),
    _({ playerName: "Quazir Hayes",    teamName: "", passYds:  260, passTDs:  5, passInt:  1 }),
    _({ playerName: "Carter Pedersen", teamName: "", recRec:  14, recYds: 410, recTDs: 7, defInt: 3 }),
    _({ playerName: "Mike Mussachio",  teamName: "", recRec:   2, recYds:  40, defSacks: 6 }),
    _({ playerName: "Bryan Conklin",   teamName: "", recRec:   5, recYds: 115, recTDs: 1, defInt: 2 }),
    _({ playerName: "Chase Green",     teamName: "", recRec:   6, recYds: 150, recTDs: 3, defInt: 1 }),
    _({ playerName: "Caden Cutinella", teamName: "", recRec:   5, recYds: 110, recTDs: 1, defInt: 1 }),
    _({ playerName: "Ty Long",         teamName: "", recRec:   5, recYds: 115, recTDs: 1, defTDs: 1 }),
  ]},

  { id: "springbash-2021", name: "SpringBash 2021", stats: [
    // ── Cobras ──────────────────────────────────────────────────────────────
    _({ playerName: "Carter Pedersen",    teamName: "Cobras", recRec: 28, recYds: 430, rushYds:   4, recTDs: 4, rushTDs: 0, defInt: 1, defSacks: 0, defTDs: 0, pancakes: 1 }),
    _({ playerName: "Caden Cutinella",    teamName: "Cobras", recRec: 18, recYds: 410, rushYds:   0, recTDs: 6, rushTDs: 0, defInt: 1, defSacks: 0, defTDs: 0, pancakes: 0 }),
    _({ playerName: "Lionel Cumberbatch", teamName: "Cobras", recRec: 21, recYds: 361, rushYds:   0, recTDs: 4, rushTDs: 0, defInt: 2, defSacks: 0, defTDs: 0, pancakes: 0 }),
    _({ playerName: "Santino Negron",     teamName: "Cobras", recRec: 11, recYds: 206, rushYds: 310, recTDs: 2, rushTDs: 0, defInt: 0, defSacks: 2, defTDs: 0, pancakes: 2 }),
    _({ playerName: "Ty Long",            teamName: "Cobras", recRec: 13, recYds: 197, rushYds:   0, recTDs: 2, rushTDs: 0, defInt: 0, defSacks: 5, defTDs: 0, pancakes: 2 }),
    _({ playerName: "Jacob Ramos",        teamName: "Cobras", recRec:  2, recYds:  16, rushYds:  28, recTDs: 0, rushTDs: 1, defInt: 0, defSacks: 1, defTDs: 0, pancakes: 2 }),
    _({ playerName: "Shane Green",        teamName: "Cobras", passYds: 1677, passTDs: 20, passInt: 6, rushYds: 101, rushTDs: 1, defInt: 1, defSacks: 0, defTDs: 0, pancakes: 0, fgMade: 5 }),
    // ── Nooners ─────────────────────────────────────────────────────────────
    _({ playerName: "Declan Costello",   teamName: "Nooners", passYds: 68, passTDs: 1, passInt: 0, recRec: 48, recYds: 770, rushYds: 157, recTDs: 5, rushTDs: 1, defInt: 2, defSacks: 5, defTDs: 1, pancakes: 3, fgMade: 5 }),
    _({ playerName: "Besim Dika",        teamName: "Nooners", passYds: 1918, passTDs: 11, passInt: 8, rushYds: 98, recRec: 1, recYds: 18, defInt: 0, defSacks: 0, defTDs: 0, pancakes: 4 }),
    _({ playerName: "Sami Dika",         teamName: "Nooners", recRec: 21, recYds: 278, rushYds: 338, recTDs: 2, rushTDs: 1, defInt: 0, defSacks: 0, defTDs: 0, pancakes: 0 }),
    _({ playerName: "Louie Delbianco",   teamName: "Nooners", recRec: 18, recYds: 236, rushYds: 116, recTDs: 2, rushTDs: 0, defInt: 0, defSacks: 3, defTDs: 0, pancakes: 0, fgMade: 1 }),
    _({ playerName: "Richard Rinaldi",   teamName: "Nooners", recRec:  1, recYds:  34, rushYds:   0, recTDs: 0, rushTDs: 0, defInt: 0, defSacks: 6, defTDs: 0, pancakes: 0 }),
    _({ playerName: "Enis Dika",         teamName: "Nooners", recRec:  9, recYds: 100, rushYds:   0, recTDs: 0, rushTDs: 0, defInt: 0, defSacks: 0, defTDs: 0, pancakes: 0 }),
    _({ playerName: "Mikey Cons",        teamName: "Nooners", recRec:  7, recYds:  97, rushYds:  28, recTDs: 1, rushTDs: 1, defInt: 1, defSacks: 0, defTDs: 1, pancakes: 0 }),
    _({ playerName: "Kieran Kacur",      teamName: "Nooners", recRec:  3, recYds:  63, rushYds:   0, recTDs: 0, rushTDs: 0, defInt: 0, defSacks: 0, defTDs: 1, pancakes: 0 }),
    _({ playerName: "Leibinson Perez",   teamName: "Nooners", recRec:  2, recYds:  26, rushYds:   0, recTDs: 0, rushTDs: 0, defInt: 0, defSacks: 0, defTDs: 0, pancakes: 2 }),
    _({ playerName: "Gavin Ladue",       teamName: "Nooners", recRec:  9, recYds: 157, rushYds:   0, recTDs: 1, rushTDs: 0, defInt: 1, defSacks: 0, defTDs: 0, pancakes: 0 }),
    _({ playerName: "Aiden Davis",       teamName: "Nooners", recRec:  0, recYds:   0, rushYds:   0, recTDs: 0, rushTDs: 0, defInt: 0, defSacks: 0, defTDs: 0, pancakes: 1 }),
    _({ playerName: "Jeremiah Vitel",    teamName: "Nooners", recRec:  3, recYds:  48, rushYds:   0, recTDs: 0, rushTDs: 0, defInt: 0, defSacks: 0, defTDs: 0, pancakes: 0 }),
    // ── Cleavage McNamara ────────────────────────────────────────────────────
    _({ playerName: "Nick Lepere",       teamName: "Cleavage McNamara", recRec: 33, recYds: 483, rushYds: 110, recTDs: 4, rushTDs: 0, defInt: 2, defSacks: 0, defTDs: 0, pancakes: 1 }),
    _({ playerName: "Tom Flynn",         teamName: "Cleavage McNamara", recRec: 16, recYds: 196, rushYds:   0, recTDs: 2, rushTDs: 0, defInt: 3, defSacks: 0, defTDs: 2, pancakes: 1 }),
    _({ playerName: "Aaron Davis",       teamName: "Cleavage McNamara", recRec: 13, recYds: 135, rushYds:  77, recTDs: 1, rushTDs: 0, defInt: 0, defSacks: 1, defTDs: 0, pancakes: 0 }),
    _({ playerName: "Matt Manzoeillo",   teamName: "Cleavage McNamara", recRec:  9, recYds:  97, rushYds:   0, recTDs: 2, rushTDs: 0, defInt: 1, defSacks: 0, defTDs: 0, pancakes: 0 }),
    _({ playerName: "Mark Guzman",       teamName: "Cleavage McNamara", recRec: 14, recYds: 157, rushYds:  53, recTDs: 0, rushTDs: 0, defInt: 1, defSacks: 9, defTDs: 0, pancakes: 2 }),
    _({ playerName: "Mike Mussachio",    teamName: "Cleavage McNamara", recRec:  2, recYds:  24, rushYds:  21, recTDs: 0, rushTDs: 0, defInt: 0, defSacks: 5, defTDs: 0, pancakes: 2 }),
    _({ playerName: "Jimmy Kuka",        teamName: "Cleavage McNamara", recRec:  8, recYds:  78, rushYds:   0, recTDs: 1, rushTDs: 0, defInt: 0, defSacks: 0, defTDs: 0, pancakes: 0 }),
    _({ playerName: "Jayden Quintana",   teamName: "Cleavage McNamara", recRec: 10, recYds:  81, rushYds:  64, recTDs: 0, rushTDs: 0, defInt: 0, defSacks: 2, defTDs: 0, pancakes: 3 }),
    _({ playerName: "Joey Vollaro",      teamName: "Cleavage McNamara", recRec:  6, recYds:  68, rushYds:  18, recTDs: 0, rushTDs: 0, defInt: 2, defSacks: 0, defTDs: 0, pancakes: 0 }),
    _({ playerName: "Tsamaj Powell",     teamName: "Cleavage McNamara", recRec:  5, recYds:  52, rushYds:   0, recTDs: 0, rushTDs: 0, defInt: 0, defSacks: 0, defTDs: 0, pancakes: 0 }),
    _({ playerName: "Xavier Collins",    teamName: "Cleavage McNamara", recRec:  4, recYds: 120, rushYds:   0, recTDs: 3, rushTDs: 0, defInt: 0, defSacks: 0, defTDs: 0, pancakes: 0 }),
    _({ playerName: "Regan Ladue",       teamName: "Cleavage McNamara", recRec:  0, recYds:   0, rushYds:   0, recTDs: 0, rushTDs: 0, defInt: 0, defSacks: 0, defTDs: 0, pancakes: 2 }),
    _({ playerName: "Finn Costello",     teamName: "Cleavage McNamara", passYds: 1451, passTDs: 13, passInt: 5, rushYds: 148, rushTDs: 2, defInt: 1, defSacks: 0, defTDs: 1, pancakes: 0, fgMade: 6 }),
  ]},

  { id: "winterbash-2022",      name: "WinterBash 2022",       stats: [] },
  { id: "summer-showdown-2023", name: "Summer Showdown 2023",  stats: [] },
  { id: "winterbash-2023",      name: "WinterBash 2023",       stats: [] },
  { id: "summer-showdown-2024", name: "Summer Showdown 2024",  stats: [
    // ── Pedego ───────────────────────────────────────────────────────────────
    _({ playerName: "Kyle Perrucci",  teamName: "Pedego", passTDs: 14, passYds: 1602, passInt: 3, fgMade: 2, defFF: 1, defFR: 1 }),
    _({ playerName: "Joey Vollaro",   teamName: "Pedego", recRec: 25, recTDs: 5, recYds: 519, defPBU: 4, defInt: 3, defTDs: 1 }),
    _({ playerName: "Alex Wyant",     teamName: "Pedego", recRec: 11, recTDs: 4, recYds: 257, defPBU: 2 }),
    _({ playerName: "Jimmy Kuka",     teamName: "Pedego", recRec:  4, recTDs: 0, recYds:  26, defSacks: 1 }),
    _({ playerName: "Luke Mahon",     teamName: "Pedego", recRec: 15, recTDs: 2, recYds: 146, rushYds:  4, defSacks: 1, defFR: 1 }),
    _({ playerName: "Chris Dimedio",  teamName: "Pedego", recRec:  9, recTDs: 0, recYds: 148, rushYds: -2, fgMade: 1, defPBU: 1, defInt: 1 }),
    _({ playerName: "MJ Molina",      teamName: "Pedego", recRec:  2, recTDs: 0, recYds:  16, rushYds:  1, defTFL: 1 }),
    _({ playerName: "Gio Bowley",     teamName: "Pedego", recRec: 10, recTDs: 1, recYds: 232, rushYds:  1, defPBU: 1 }),
    _({ playerName: "Owen Lynch",     teamName: "Pedego", recRec:  3, recTDs: 0, recYds:  28, rushYds: 18, fgMade: 1, defPBU: 1, defSacks: 2 }),
    _({ playerName: "Liam Murphy",    teamName: "Pedego", recRec:  8, recTDs: 1, recYds: 132, rushYds: 24, defPBU: 1 }),
    _({ playerName: "Matt Molina",    teamName: "Pedego", recRec:  4, recTDs: 2, recYds:  98, defPBU: 1 }),
    _({ playerName: "Mike Mussachio", teamName: "Pedego", rushYds: 8, defSacks: 3, defFR: 1 }),
    // ── Pacha ────────────────────────────────────────────────────────────────
    _({ playerName: "Zach Barber",       teamName: "Pacha", passTDs: 16, passYds: 1615, passInt: 10, rushTDs: 3, rushYds: 228, defPBU: 3, defTFL: 1, defInt: 3, defSacks: 1 }),
    _({ playerName: "Jason Komisar",     teamName: "Pacha", recRec: 15, recTDs: 2, recYds: 210, defPBU: 1 }),
    _({ playerName: "Caliel Daughtry",   teamName: "Pacha", recRec: 12, recTDs: 2, recYds: 128, rushYds: 23, defPBU: 3 }),
    _({ playerName: "Wilson Ciccone",    teamName: "Pacha", recRec:  2, recTDs: 0, recYds:  43, defPBU: 1 }),
    _({ playerName: "Macho Battle",      teamName: "Pacha", recRec:  3, recTDs: 1, recYds:  53, defFF: 1 }),
    _({ playerName: "Mike Balogna",      teamName: "Pacha", recRec:  5, recTDs: 1, recYds:  57, fgMade: 2, defInt: 2, defSacks: 1 }),
    _({ playerName: "Aiden Davis",       teamName: "Pacha", fgMade: 1, defPBU: 2, defInt: 1 }),
    _({ playerName: "Jayden Quintana",   teamName: "Pacha", recRec: 16, recTDs: 3, recYds: 308, rushYds: 33, defPBU: 1, defTFL: 3, defInt: 1, defSacks: 2, defTDs: 1 }),
    _({ playerName: "Lucas Vermulan",    teamName: "Pacha", recRec: 15, recTDs: 3, recYds: 352, rushYds: 22, defSacks: 6 }),
    _({ playerName: "Kieran Kacur",      teamName: "Pacha", recRec: 10, recTDs: 1, recYds: 167, defInt: 1 }),
    _({ playerName: "Nick Lentini",      teamName: "Pacha", recRec:  5, recTDs: 0, recYds:  61, rushYds: 10, defPBU: 1, defInt: 1, defSacks: 4 }),
    _({ playerName: "Enis Dika",         teamName: "Pacha", recRec:  7, recTDs: 1, recYds: 164 }),
    _({ playerName: "Bryan Conklin",     teamName: "Pacha", recRec:  4, recTDs: 1, recYds:  57 }),
    _({ playerName: "Quincy Owens",      teamName: "Pacha", recRec:  1, recTDs: 1, recYds:  15, defPBU: 1, defInt: 2 }),
    // ── Baja ─────────────────────────────────────────────────────────────────
    _({ playerName: "Finn Costello",   teamName: "Baja", passTDs: 16, passYds: 1502, passInt: 8, rushTDs: 1, rushYds:  98, defPBU: 3, defInt: 1 }),
    _({ playerName: "Tom Flynn",       teamName: "Baja", recRec:  9, recTDs: 1, recYds: 176, defPBU: 2 }),
    _({ playerName: "Jose Vasquez",    teamName: "Baja", recRec: 17, recTDs: 4, recYds: 284, rushTDs: 1, rushYds: 180, defPBU: 1, defInt: 1, defSacks: 1 }),
    _({ playerName: "Nick Fernandez",  teamName: "Baja", recRec:  8, recTDs: 2, recYds: 179, rushYds:  35, defPBU: 2 }),
    _({ playerName: "Lincoln Stewart", teamName: "Baja", rushYds: 10, defTFL: 1, defInt: 1, defSacks: 2, defFR: 1 }),
    _({ playerName: "Louie Delbianco", teamName: "Baja", recRec: 21, recTDs: 2, recYds: 361, rushTDs: 1, rushYds:  20, defSacks: 5 }),
    _({ playerName: "Dennis Dowd",     teamName: "Baja", recRec:  1, recTDs: 0, recYds:  11, fgMade: 3, defPBU: 2, defInt: 1, defSacks: 2 }),
    _({ playerName: "Carter Hull",     teamName: "Baja", defPBU: 2, defTFL: 1, defInt: 1 }),
    _({ playerName: "Jason Antalek",   teamName: "Baja", passYds: 15, recRec: 2, recYds:  30 }),
    _({ playerName: "Anthony Wray",    teamName: "Baja", recRec:  1, recTDs: 0, recYds:  15, rushYds:   6, defSacks: 4 }),
    _({ playerName: "Carter Pedersen", teamName: "Baja", recRec: 15, recTDs: 7, recYds: 356, defPBU: 3, defInt: 5 }),
    _({ playerName: "Chris Lane",      teamName: "Baja", recRec:  2, recTDs: 0, recYds:  50, defPBU: 1 }),
    _({ playerName: "Declan Costello", teamName: "Baja", recRec:  3, recTDs: 0, recYds:  40 }),
    // ── Carters ──────────────────────────────────────────────────────────────
    _({ playerName: "Cody Shields",      teamName: "Carters", passTDs: 5, passYds: 545, passInt: 2, recRec: 4, recTDs: 1, recYds:  57, rushYds: 15, defPBU: 3, defTDs: 1 }),
    _({ playerName: "Danny Urbanak",     teamName: "Carters", passTDs: 3, passYds: 348, passInt: 5, recRec: 2, recTDs: 0, recYds:  10, rushYds: 16, defPBU: 1, defInt: 3 }),
    _({ playerName: "Mercer Jordan",     teamName: "Carters", passTDs: 1, passYds: 104, passInt: 1, defSacks: 1 }),
    _({ playerName: "Forever Williams",  teamName: "Carters", recRec: 18, recTDs: 4, recYds: 261, rushYds: 49, defPBU: 2, defInt: 2 }),
    _({ playerName: "Stephen Mcdowell",  teamName: "Carters", recRec: 19, recTDs: 1, recYds: 292, rushYds:  6 }),
    _({ playerName: "Jaiah Gottor",      teamName: "Carters", recRec: 13, recTDs: 2, recYds: 230, defPBU: 3 }),
    _({ playerName: "Dash",              teamName: "Carters", defPBU: 2, defInt: 1 }),
    _({ playerName: "Cam Shorey",        teamName: "Carters", recRec:  3, recTDs: 0, recYds:  15, rushYds: 74, defPBU: 1, defTDs: 1 }),
    _({ playerName: "Quincy Owens",      teamName: "Carters", defPBU: 2 }),
    _({ playerName: "Regan Ladue",       teamName: "Carters", defSacks: 1 }),
    _({ playerName: "Jamell",            teamName: "Carters", defSacks: 1 }),
    _({ playerName: "Danny Way",         teamName: "Carters", defSacks: 3 }),
    _({ playerName: "Brandon Booker",    teamName: "Carters", recRec:  1, recTDs: 1, recYds:  20, rushYds: 19, defPBU: 2 }),
    _({ playerName: "Jackson Atwell",    teamName: "Carters", recRec:  2, recTDs: 0, recYds:  70 }),
    _({ playerName: "Leibinson Perez",   teamName: "Carters", recRec:  1, recTDs: 0, recYds:  12 }),

    // ── Twins ────────────────────────────────────────────────────────────────
    _({ playerName: "Besim Dika",        teamName: "Twins", passYds: 688, passTDs: 2, passInt: 8, rushYds:  67, rushTDs: 1 }),
    _({ playerName: "Matt Sturman",      teamName: "Twins", recRec:  9, recTDs: 1, recYds: 159, rushYds:   9, fgMade: 2, defPBU: 1, defInt: 2, defSacks: 1 }),
    _({ playerName: "Nick Lepere",       teamName: "Twins", recRec: 41, recTDs: 4, recYds: 558, rushYds: 179, defPBU: 3, defInt: 1 }),
    _({ playerName: "Matt Manzoeillo",   teamName: "Twins", passYds: 672, passTDs: 7, passInt: 7, recRec:  8, recYds: 108, rushYds: 31, defPBU: 3, defInt: 6 }),
    _({ playerName: "TJ Reid",           teamName: "Twins", recRec:  2, recTDs: 1, recYds:  20, defInt: 1 }),
    _({ playerName: "Ali T Muhammad",    teamName: "Twins", recRec:  1, recYds:  10, rushYds: 47, defTFL: 1, defSacks: 4 }),
    _({ playerName: "Naim Dika",         teamName: "Twins", recRec: 12, recYds: 121, fgMade: 4 }),
    _({ playerName: "Ty Long",           teamName: "Twins", recRec:  2, recYds:  29, defPBU: 2, defTFL: 1, defSacks: 2, defFR: 1 }),
    _({ playerName: "Aaron Davis",       teamName: "Twins", recRec:  6, recTDs: 1, recYds: 139, rushYds:  8, defPBU: 1, defTFL: 1, defSacks: 1 }),
    _({ playerName: "Cory Mckellar",     teamName: "Twins", passInt: 1, recRec: 15, recTDs: 1, recYds: 177, defInt: 1, defSacks: 2 }),
    _({ playerName: "Bobby Chris",       teamName: "Twins", recRec:  2, recYds:  20, rushYds: 16, defPBU: 1, defTFL: 1 }),
    _({ playerName: "Leibinson Perez",   teamName: "Twins", passInt: 2, recRec:  4, recTDs: 1, recYds:  19, rushYds: 26, defSacks: 1 }),
    _({ playerName: "Will Hockler",      teamName: "Twins", defSacks: 2 }),

    // ── Marcelos ─────────────────────────────────────────────────────────────
    _({ playerName: "Luke Mahon",        teamName: "Marcelos", passYds: 953, passTDs: 7, passInt: 9, rushYds:  17, defPBU: 3 }),
    _({ playerName: "Declan Costello",   teamName: "Marcelos", passYds:  21, recRec: 14, recTDs: 2, recYds: 276, rushTDs: 1, rushYds: 63, defPBU: 3, defTFL: 1, defInt: 1, defSacks: 1, defTDs: 1 }),
    _({ playerName: "Chase Green",       teamName: "Marcelos", passYds:   8, recRec: 13, recTDs: 2, recYds: 239, rushYds:  76, defPBU: 3, defTDs: 1 }),
    _({ playerName: "Bryan Conklin",     teamName: "Marcelos", recRec:  7, recTDs: 1, recYds: 118, defPBU: 2, defTFL: 1, defInt: 1 }),
    _({ playerName: "Matt Molina",       teamName: "Marcelos", recRec:  6, recYds:  87, defPBU: 3, defInt: 2 }),
    _({ playerName: "Nascia Hinson",     teamName: "Marcelos", rushYds:  2, defTFL: 1 }),
    _({ playerName: "Tyler Haydt",       teamName: "Marcelos", passInt: 1, recRec:  6, recYds:  54, rushTDs: 1, rushYds: 75 }),
    _({ playerName: "Hayden Bohem",      teamName: "Marcelos", recRec:  1, recYds:  30, rushYds:  15, defPBU: 1, defTFL: 1, defSacks: 2 }),
    _({ playerName: "Quincy Owens",      teamName: "Marcelos", recRec:  2, recTDs: 1, recYds:  27, defPBU: 1, defInt: 1 }),
    _({ playerName: "Richie Omari",      teamName: "Marcelos", recRec:  2, recYds:  54, defPBU: 1, defInt: 1 }),
    _({ playerName: "Jayden Jones",      teamName: "Marcelos", recRec:  3, recTDs: 1, recYds:  97, defPBU: 2, defInt: 1 }),
  ]},
  { id: "winterbash-2024",      name: "WinterBash 2024",       stats: [] },
  { id: "summer-showdown-2025", name: "Summer Showdown 2025",  stats: [] },
  { id: "winterbash-2025",      name: "WinterBash 2025",       stats: [] },
];

export const CURRENT_SEASON_ID   = "summer-2026";
export const CURRENT_SEASON_NAME = "Inaugural HVFF Summer 2026";
