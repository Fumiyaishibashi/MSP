import type { IpAssetMaster } from "../types";

export const ipAssetMasters: IpAssetMaster[] = [
  // 番組IP
  {
    id: "ip_yantan",
    name: "ヤングタウン",
    imagePath: "/assets/logo_yantan.png",
    ownerName: "ラジオ制作部 田中太郎",
    contact: "tanaka.taro@mbs.co.jp",
    category: "番組IP",
  },
  {
    id: "ip_prebato",
    name: "プレバト！！",
    imagePath: "/assets/logo_prebato.png",
    ownerName: "東京制作部 佐藤花子",
    contact: "sato.hanako@mbs.co.jp",
    category: "番組IP",
  },
  {
    id: "ip_gobugobu",
    name: "ごぶごぶラジオ",
    imagePath: "/assets/logo_gobugobu.png",
    ownerName: "ラジオ制作部 鈴木一郎",
    contact: "suzuki.ichiro@mbs.co.jp",
    category: "番組IP",
  },
  {
    id: "ip_yonchan",
    name: "よんチャンTV",
    imagePath: "", // 仮
    ownerName: "報道情報局 山本さくら",
    contact: "yamamoto.sakura@mbs.co.jp",
    category: "番組IP",
  },
  {
    id: "ip_jounetsu",
    name: "情熱大陸",
    imagePath: "/assets/logo_jounetsu.png",
    ownerName: "ドキュメンタリー制作部 高橋恵子",
    contact: "takahashi.keiko@mbs.co.jp",
    category: "番組IP",
  },
  {
    id: "ip_aremita",
    name: "あれみた",
    imagePath: "",
    ownerName: "テレビ制作部 吉川美咲",
    contact: "yoshikawa.misaki@mbs.co.jp",
    category: "番組IP",
  },
  {
    id: "ip_seyanein",
    name: "せやねん",
    imagePath: "",
    ownerName: "テレビ制作部 木村健一",
    contact: "kimura.kenichi@mbs.co.jp",
    category: "番組IP",
  },
  {
    id: "ip_gundam",
    name: "ガンダムシリーズ",
    imagePath: "", // 仮
    ownerName: "アニメ事業部 渡辺徹",
    contact: "watanabe.toru@mbs.co.jp",
    category: "番組IP",
  },
  // キャラクター/タレント
  {
    id: "ip_raiyon",
    name: "らいよんチャン",
    imagePath: "/assets/logo_raiyon.png",
    ownerName: "キャラクター事業部 山田次郎",
    contact: "yamada.jiro@mbs.co.jp",
    category: "キャラクター/タレント",
  },
  {
    id: "ip_kapibara",
    name: "カピバラさん",
    imagePath: "", // 仮
    ownerName: "ライセンス事業部 伊藤ゆみ",
    contact: "ito.yumi@mbs.co.jp",
    category: "キャラクター/タレント",
  },
  {
    id: "ip_fukushima",
    name: "福島暢啓アナウンサー",
    imagePath: "", // 仮
    ownerName: "アナウンス室 マネージャー",
    contact: "announcer@mbs.co.jp",
    category: "キャラクター/タレント",
  },
  // 技術/リソース
  {
    id: "resource_vr",
    name: "VR撮影チーム",
    imagePath: "",
    ownerName: "技術局 VRチーム",
    contact: "vr-team@mbs.co.jp",
    category: "技術/リソース",
    iconName: "Camera",
  },
  {
    id: "resource_goods",
    name: "MBSラジオ グッズ制作部",
    imagePath: "",
    ownerName: "事業局 グッズ制作部",
    contact: "goods-dept@mbs.co.jp",
    category: "技術/リソース",
    iconName: "Shirt",
  },
  {
    id: "resource_kitchencar",
    name: "キッチンカー手配",
    imagePath: "",
    ownerName: "事業局 イベント推進部",
    contact: "event@mbs.co.jp",
    category: "技術/リソース",
    iconName: "Truck",
  },
];
