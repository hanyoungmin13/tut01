export interface Member {
  id: number;
  name: string;
  pokemonName: string;
  no: string;
  desc: string;
  types: string[];
  height: string;
  category: string;
  genders: ('M' | 'F')[];
  weight: string;
  ability: string;
  image: string;
}

export const members: Member[] = [
  {
    id: 1,
    name: '고범규',
    pokemonName: '규이리',
    no: 'No. 0001',
    desc: '태어났을 때부터 등에 이상한 씨앗이 심어져 있으며 몸과 함께 자란다고 한다. (더미 설명)',
    types: ['grass', 'poison'],
    height: '0.7m',
    category: '씨앗포켓몬',
    genders: ['M'],
    weight: '6.9kg',
    ability: '심록',
    image: '/images/avatar1.png'
  },
  {
    id: 2,
    name: '한영민',
    pokemonName: '민부기',
    no: 'No. 0002',
    desc: '꼬리의 불꽃은 기분을 나타낸다. 즐거우면 흔들리고 화가 나면 맹렬히 불타오른다. (더미 설명)',
    types: ['fire'],
    height: '0.6m',
    category: '도롱뇽포켓몬',
    genders: ['M'],
    weight: '8.5kg',
    ability: '맹화',
    image: '/images/avatar2.png'
  },
  {
    id: 3,
    name: '최익준',
    pokemonName: '익상해씨',
    no: 'No. 0003',
    desc: '위험해지면 등껍질에 숨어 몸을 보호한다. 입에서 물을 뿜어 공격한다. (더미 설명)',
    types: ['water'],
    height: '0.5m',
    category: '꼬마거북포켓몬',
    genders: ['M'],
    weight: '9.0kg',
    ability: '급류',
    image: '/images/avatar3.png'
  }
];
