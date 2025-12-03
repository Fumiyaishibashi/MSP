import type { EventProject } from "../types";

export const demoProjects: EventProject[] = [
  {
    id: "proj_yantan_60th",
    title: "ヤンタン 60周年 大感謝祭",
    location: "大阪城ホール",
    date: "2027.10",
    status: "募集中",
    placedItems: [
      {
        type: "ip",
        uniqueId: "initial-yantan",
        assetId: "ip_yantan",
        author: "田中",
        position: {
          x: 350,
          y: 250,
        },
        size: {
          width: 200,
          height: 240,
        },
        zIndex: 1,
        note: "【ホストIP】\n60周年を盛大に盛り上げる！",
      },
      {
        type: "ip",
        uniqueId: "placed-gobugobu",
        assetId: "ip_gobugobu",
        author: "鈴木",
        position: {
          x: 80,
          y: 80,
        },
        size: {
          width: 180,
          height: 210,
        },
        zIndex: 2,
        note: "浜ちゃんと一緒に何かできないか？",
      },
      {
        type: "ip",
        uniqueId: "placed-prebato",
        assetId: "ip_prebato",
        author: "佐藤次郎",
        position: {
          x: 650,
          y: 100,
        },
        size: {
          width: 160,
          height: 192,
        },
        zIndex: 3,
        note: "俳句コーナーの出張版とか",
      },
      {
        type: "ip",
        uniqueId: "placed-raiyon",
        assetId: "ip_raiyon",
        author: "山田",
        position: {
          x: 800,
          y: 450,
        },
        size: {
          width: 170,
          height: 200,
        },
        zIndex: 4,
        note: "会場案内のキャラクターとして稼働",
      },
      {
        type: "ip",
        uniqueId: "placed-gundam",
        assetId: "ip_gundam",
        author: "渡辺",
        position: {
          x: 50,
          y: 500,
        },
        size: {
          width: 160,
          height: 192,
        },
        zIndex: 10,
      },
      {
        type: "ip",
        uniqueId: "placed-vr",
        assetId: "resource_vr",
        author: "高橋",
        position: {
          x: 850,
          y: 80,
        },
        size: {
          width: 160,
          height: 192,
        },
        zIndex: 5,
        note: "当日のVR配信を担当します。",
      },
      {
        type: "ip",
        uniqueId: "placed-goods",
        assetId: "resource_goods",
        author: "石橋",
        position: {
          x: 600,
          y: 550,
        },
        size: {
          width: 180,
          height: 160,
        },
        zIndex: 6,
        note: "記念グッズ制作します！",
      },
      {
        type: "idea",
        uniqueId: "idea-1",
        text: "もっと若者向けの企画も欲しいかも？",
        author: "佐藤次郎",
        position: {
          x: 50,
          y: 300,
        },
        size: {
          width: 220,
          height: 160,
        },
        zIndex: 7,
      },
      {
        type: "idea",
        uniqueId: "idea-2",
        text: "フェスのフードどうする？\nキッチンカーとか？",
        author: "鈴木",
        position: {
          x: 700,
          y: 280,
        },
        size: {
          width: 192,
          height: 160,
        },
        zIndex: 8,
      },
      {
        type: "idea",
        uniqueId: "idea-3",
        text: "MBSアナウンサーだけの特別コーナーは？福島さん司会で！",
        author: "高橋",
        position: {
          x: 350,
          y: 50,
        },
        size: {
          width: 240,
          height: 160,
        },
        zIndex: 9,
      },
    ],
  },
  {
    id: "proj_kaidan_fes",
    title: "茶屋町怪談フェス 2025",
    location: "茶屋町プラザ",
    date: "2025.08",
    status: "企画中",
    placedItems: [
      {
        type: "ip",
        uniqueId: "kaidan-host",
        assetId: "ip_fukushima",
        author: "石橋",
        position: {
          x: 100,
          y: 100,
        },
        size: {
          width: 160,
          height: 192,
        },
        zIndex: 1,
        note: "メインMC",
      },
      {
        type: "idea",
        uniqueId: "kaidan-idea-1",
        text: "VRで体験する怪談とかどうだろう",
        author: "高橋",
        position: {
          x: 300,
          y: 200,
        },
        size: {
          width: 192,
          height: 160,
        },
        zIndex: 2,
      },
    ],
  },
  {
    id: "proj_uta_oneesan",
    title: "歌のおねえさん 全国ツアー",
    location: "全国 Zepp",
    date: "2026.04",
    status: "募集中",
    placedItems: [],
  },
  {
    id: "proj_gobugobu_fes",
    title: "ごぶごぶ FES 2025",
    location: "京セラドーム大阪",
    date: "2025.09",
    status: "募集中",
    placedItems: [
      {
        type: "ip",
        uniqueId: "gobu-host",
        assetId: "ip_gobugobu",
        author: "鈴木",
        position: {
          x: 12,
          y: 20,
        },
        size: {
          width: 200,
          height: 220,
        },
        zIndex: 1,
        note: "【メインIP】\n浜ちゃん主催の\n最高の音楽フェス\nを実現しよう！",
      },
      {
        type: "ip",
        uniqueId: "gobu-aremita",
        assetId: "ip_aremita",
        author: "吉川",
        position: {
          x: 242,
          y: 24,
        },
        size: {
          width: "160px",
          height: "192px",
        },
        zIndex: 5,
        note: "食品企画ステージ\n芸人が作る！\nグルメバトル",
      },
      {
        type: "ip",
        uniqueId: "gobu-vr",
        assetId: "resource_vr",
        author: "高橋",
        position: {
          x: 817,
          y: 526,
        },
        size: {
          width: 160,
          height: 192,
        },
        zIndex: 8,
        note: "VR配信\nフェスの全ステージ\n360度配信",
      },
      {
        type: "ip",
        uniqueId: "gobu-goods",
        assetId: "resource_goods",
        author: "石橋",
        position: {
          x: 816,
          y: 12,
        },
        size: {
          width: "160px",
          height: "192px",
        },
        zIndex: 9,
        note: "グッズ制作\nチケット販売促進用\nセット販売",
      },
      {
        type: "ip",
        uniqueId: "gobu-kitchen",
        assetId: "resource_kitchencar",
        author: "鈴木",
        position: {
          x: 348,
          y: 514,
        },
        size: {
          width: "160px",
          height: "192px",
        },
        zIndex: 10,
        note: "フードコーナー\n10台のキッチンカー\n全国グルメ集結",
      },
      {
        type: "idea",
        uniqueId: "gobu-idea-main",
        text: "【コアコンセプト】\nごぶごぶラジオ✖️あれみた\n「浜田考案のフード！」\nあれみた内で企画して、\nフェスで販売！",
        author: "吉川",
        position: {
          x: 370,
          y: 111,
        },
        size: {
          width: "240px",
          height: "165px",
        },
        zIndex: 11,
      },
      {
        type: "person",
        uniqueId: "gobu-person-yoshikawa",
        memoId: "person_yoshikawa",
        author: "石橋太郎",
        position: {
          x: 33,
          y: 279,
        },
        size: {
          width: "180px",
          height: "200px",
        },
        zIndex: 12,
      },
      {
        type: "idea",
        uniqueId: "gobu-idea-connection1",
        text: "吉川さんに相談\n→ あれみた番組での\n実績を聞く\n→ キッチンカー出したことあるらしい",
        author: "鈴木",
        position: {
          x: 175,
          y: 223,
        },
        size: {
          width: 200,
          height: 160,
        },
        zIndex: 13,
      },
      {
        type: "idea",
        uniqueId: "gobu-idea-goods",
        text: "グッズ制作\nあれみた企画の\n食品グッズコラボ\n限定販売",
        author: "石橋",
        position: {
          x: 573,
          y: 10,
        },
        size: {
          width: "167px",
          height: "160px",
        },
        zIndex: 14,
      },
      {
        type: "person",
        uniqueId: "gobu-person-ishibashi",
        memoId: "person_ishibashi",
        author: "石橋太郎",
        position: {
          x: 668,
          y: 126,
        },
        size: {
          width: 180,
          height: 200,
        },
        zIndex: 15,
      },
      {
        type: "company",
        uniqueId: "gobu-company-catering",
        memoId: "company_catering",
        author: "石橋太郎",
        position: {
          x: 406,
          y: 328,
        },
        size: {
          width: 200,
          height: 200,
        },
        zIndex: 16,
      },
      {
        type: "company",
        uniqueId: "gobu-company-design",
        memoId: "company_design_co",
        author: "石橋太郎",
        position: {
          x: 912,
          y: 171,
        },
        size: {
          width: 200,
          height: 200,
        },
        zIndex: 19,
      },
      {
        type: "idea",
        uniqueId: "gobu-idea-vr-simple",
        text: "VR配信\nフェス全景を\n360度配信",
        author: "高橋",
        position: {
          x: 943,
          y: 441,
        },
        size: {
          width: "160px",
          height: "160px",
        },
        zIndex: 21,
      },
      {
        type: "person",
        uniqueId: "gobu-person-ito",
        memoId: "person_ito",
        author: "石橋太郎",
        position: {
          x: 1051,
          y: 538,
        },
        size: {
          width: "160px",
          height: "200px",
        },
        zIndex: 22,
      },
      {
        type: "person",
        uniqueId: "9b522a8c-4230-4684-931d-43e0146208a2",
        memoId: "person_yamamoto",
        author: "佐藤",
        position: {
          x: 276,
          y: 361,
        },
        size: {
          width: 160,
          height: 200,
        },
        zIndex: 23,
      },
      {
        type: "person",
        uniqueId: "9994fe23-03af-44d1-a7ca-6c029668db01",
        memoId: "person_suzuki",
        author: "高橋",
        position: {
          x: 1053,
          y: 21,
        },
        size: {
          width: 160,
          height: 200,
        },
        zIndex: 24,
      },
    ],
  },
  {
    id: "proj_anime_genga",
    title: "アニメ「〇〇」原画展",
    location: "阪神百貨店",
    date: "2026.01",
    status: "終了",
    placedItems: [],
  },
];
