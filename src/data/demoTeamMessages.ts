import type { TeamMessage } from '../types';

/**
 * Demo Team Messages Dataset
 * 初期チームチャットメッセージデータ
 */
export const demoTeamMessages: TeamMessage[] = [
  {
    id: "team_msg_001",
    teamId: "team_demo_music_food_fes",
    author: "木村康司",
    content: "チーム発足おめでとうございます！音楽×食のコラボ、すごく楽しみですね",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7日前
  },
  {
    id: "team_msg_002",
    teamId: "team_demo_music_food_fes",
    author: "岡田圭太",
    content: "ありがとうございます！ミリカとしても全面的にバックアップします。音楽フェスのノウハウを活かしたいです",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000), // 7日前+10分
  },
  {
    id: "team_msg_003",
    teamId: "team_demo_music_food_fes",
    author: "長沢健太",
    content: "あれみたでやった食企画が好評だったので、FESでも展開できそうです！",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 20 * 60 * 1000), // 7日前+20分
  },
  {
    id: "team_msg_004",
    teamId: "team_demo_music_food_fes",
    author: "木村康司",
    content: "キッチンカーを会場に呼んで、音楽聴きながら美味しいもの食べられたら最高ですよね",
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6日前
  },
  {
    id: "team_msg_005",
    teamId: "team_demo_music_food_fes",
    author: "岡田圭太",
    content: "そうですね！去年のごぶごぶFESは音楽とお笑いだったけど、今年は食を加えたら差別化できそう",
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000), // 6日前+30分
  },
  {
    id: "team_msg_006",
    teamId: "team_demo_music_food_fes",
    author: "長沢健太",
    content: "キッチンカーの手配、TOROMIの山﨑さんが詳しいって言ってましたよね",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5日前
  },
  {
    id: "team_msg_007",
    teamId: "team_demo_music_food_fes",
    author: "木村康司",
    content: "そうそう！山﨑さんにも相談してみましょう。あと、グッズ制作の鈴木さんにもオリジナルグッズ相談したいな",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000), // 5日前+1時間
  },
  {
    id: "team_msg_008",
    teamId: "team_demo_music_food_fes",
    author: "岡田圭太",
    content: "音楽アーティストのブッキングはミリカで進めますね。ラジオやテレビとの連動企画も考えたいです",
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4日前
  },
  {
    id: "team_msg_009",
    teamId: "team_demo_music_food_fes",
    author: "長沢健太",
    content: "あれみたで浜田さんに食企画やってもらって、その内容をFESで出店するのはどうですか？",
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 4日前+2時間
  },
  {
    id: "team_msg_010",
    teamId: "team_demo_music_food_fes",
    author: "木村康司",
    content: "それめっちゃいいですね！テレビ→FES会場の連動、話題性抜群です",
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000 + 10 * 60 * 1000), // 4日前+2時間10分
  },
  {
    id: "team_msg_011",
    teamId: "team_demo_music_food_fes",
    author: "岡田圭太",
    content: "いいですね！番組とFESの相乗効果が期待できます。ごぶごぶラジオでも告知できますし",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3日前
  },
  {
    id: "team_msg_012",
    teamId: "team_demo_music_food_fes",
    author: "長沢健太",
    content: "開催場所はどこがいいですかね？京セラドーム大阪とか、大きい会場がいいかな",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000), // 3日前+1時間
  },
  {
    id: "team_msg_013",
    teamId: "team_demo_music_food_fes",
    author: "木村康司",
    content: "京セラドームいいですね！屋内なら天候の心配もないし、音響設備も完璧です",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2日前
  },
  {
    id: "team_msg_014",
    teamId: "team_demo_music_food_fes",
    author: "岡田圭太",
    content: "キャパも大きいので、たくさんのお客さんに来てもらえますね。日程はいつ頃がいいですか？",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000), // 2日前+30分
  },
  {
    id: "team_msg_015",
    teamId: "team_demo_music_food_fes",
    author: "長沢健太",
    content: "夏フェスシーズンの6-7月か、秋の9-10月がいいかなと思います",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1日前
  },
  {
    id: "team_msg_016",
    teamId: "team_demo_music_food_fes",
    author: "木村康司",
    content: "食も音楽も楽しめる秋フェス、いいですね！来週、具体的な企画書を作成してみます",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000), // 1日前+1時間
  },
  {
    id: "team_msg_017",
    teamId: "team_demo_music_food_fes",
    author: "岡田圭太",
    content: "ありがとうございます！予算感も含めて検討しますね。ミリカ側でも資料準備します",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12時間前
  },
  {
    id: "team_msg_018",
    teamId: "team_demo_music_food_fes",
    author: "長沢健太",
    content: "グッズやチケット販売の仕組みも考えないといけませんね。石橋さんに相談してみます",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8時間前
  },
  {
    id: "team_msg_019",
    teamId: "team_demo_music_food_fes",
    author: "木村康司",
    content: "ラジオでの告知企画も考えます！ヤングタウンやごぶごぶラジオで特集組めそう",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4時間前
  },
  {
    id: "team_msg_020",
    teamId: "team_demo_music_food_fes",
    author: "岡田圭太",
    content: "わくわくしてきました！次回のミーティングで詳細詰めていきましょう。よろしくお願いします！",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1時間前
  },
];
