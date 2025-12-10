import type { BrainstormTeam } from '../types';

/**
 * Demo Teams Dataset
 * 初期チームデータ
 */
export const demoTeams: BrainstormTeam[] = [
  {
    id: "team_demo_music_food_fes",
    name: "音楽×食 FES",
    wishs: [
      "wish_e64ca208-8298-4427-bc62-ed7bc03ddb93", // ごぶごぶFES今年は音楽×お笑い
      "wish_c453b01d-c7f0-46f3-935f-6434df23e1ab", // 2026年異業種コラボ音楽フェスを実現したい
      "wish_4a2387e6-7bbe-47cb-ad5b-63a2e9eb4956", // あれみたで「食」企画
      "wish_ce481daf-2462-4d27-b665-f42ba4553996", // 食フェスティバルを開きたい
    ],
    matchGroupId: "match_proximity_demo_gobugobu_fes",
    members: [
      {
        personId: "person_okada",
        name: "岡田圭太",
        reason: "「ごぶごぶFES今年は音楽×お笑い」にコメント, 願い「2026年異業種コラボ音楽フェスを実現したい」の著者",
        yearsOfService: 6,
      },
      {
        personId: "person_kimura",
        name: "木村康司",
        reason: "願い「ごぶごぶFES今年は音楽×お笑い」の著者, 「ごぶごぶFES今年は音楽×お笑い」にコメント",
        yearsOfService: 12,
      },
      {
        personId: "person_yamazaki",
        name: "山﨑亜美",
        reason: "願い「食フェスティバルを開きたい」の著者, 「ごぶごぶFES今年は音楽×お笑い」にコメント",
        yearsOfService: 5,
      },
      {
        personId: "person_nagasawa",
        name: "長沢健太",
        reason: "「ごぶごぶFES今年は音楽×お笑い」にコメント, 願い「あれみたで「食」企画」の著者",
        yearsOfService: 9,
      },
      {
        personId: "person_goods_01",
        name: "鈴木圭吾",
        reason: "願い「グッズの制作のお話あれば！！」の著者, グッズ企画・製造の専門知識",
        yearsOfService: 8,
      },
    ],
    createdAt: new Date('2025-12-09T03:04:20.945Z'),
  }
];
