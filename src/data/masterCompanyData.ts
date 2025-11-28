import type { CompanyMemo } from '../types';

export const masterCompanyData: CompanyMemo[] = [
  {
    id: 'company_design_co',
    name: '〇〇デザイン',
    specialty: ['グラフィックデザイン', 'Web制作'],
    pastProjects: ['ごぶごぶ FES', 'ラジオステーション番組'],
    pointOfContact: [
      {
        personId: 'person_suzuki',
        name: '鈴木太郎',
        email: 'suzuki.taro@mbs.co.jp',
        role: 'グッズ制作部',
      },
      {
        personId: 'person_yamamoto',
        name: '山本美咲',
        email: 'yamamoto.misaki@mbs.co.jp',
        role: '事業局',
      },
    ],
  },
  {
    id: 'company_event_plus',
    name: 'イベントプラス',
    specialty: ['イベント運営', 'ステージ制作'],
    pastProjects: ['FES開催', 'コンサート運営'],
    pointOfContact: [
      {
        personId: 'person_yamamoto',
        name: '山本美咲',
        email: 'yamamoto.misaki@mbs.co.jp',
        role: '事業局',
      },
    ],
  },
  {
    id: 'company_goods_maker',
    name: 'グッズメイカーズ',
    specialty: ['グッズ製造', '商品企画'],
    pastProjects: ['周年グッズ', 'キャラクターグッズ'],
    pointOfContact: [
      {
        personId: 'person_suzuki',
        name: '鈴木太郎',
        email: 'suzuki.taro@mbs.co.jp',
        role: 'グッズ制作部',
      },
    ],
  },
  {
    id: 'company_video_tech',
    name: 'ビデオテック',
    specialty: ['映像制作', '4K撮影'],
    pastProjects: ['ドキュメンタリー', '特別映像'],
    pointOfContact: [
      {
        personId: 'person_sato',
        name: '佐藤次郎',
        email: 'sato.jiro@mbs.co.jp',
        role: 'テレビ制作部',
      },
      {
        personId: 'person_ito',
        name: '伊藤健一',
        email: 'ito.kenichi@mbs.co.jp',
        role: '技術局',
      },
    ],
  },
  {
    id: 'company_catering',
    name: 'ケータリング&フード',
    specialty: ['キッチンカー', 'イベント飲食'],
    pastProjects: ['FESフード販売', 'イベント飲食'],
    pointOfContact: [
      {
        personId: 'person_yamamoto',
        name: '山本美咲',
        email: 'yamamoto.misaki@mbs.co.jp',
        role: '事業局',
      },
    ],
  },
];
