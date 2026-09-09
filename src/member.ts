import { members, Member } from './data';

function getMemberIdFromUrl(): number {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  return id ? parseInt(id, 10) : 1;
}

function getTypeLabel(type: string): string {
  const typeMap: Record<string, string> = {
    grass: '풀',
    poison: '독',
    fire: '불꽃',
    water: '물',
    electric: '전기',
    normal: '노말'
  };
  return typeMap[type] || type;
}

function renderMember(member: Member) {
  // Update Header Elements
  document.title = `${member.pokemonName} (${member.name}) - 팀원 도감`;
  
  const noEl = document.getElementById('member-no');
  const pokemonNameEl = document.getElementById('member-pokemon-name');
  const realNameEl = document.getElementById('member-real-name');
  const descEl = document.getElementById('member-desc');
  const imageEl = document.getElementById('member-image') as HTMLImageElement;
  
  if (noEl) noEl.textContent = member.no;
  if (pokemonNameEl) pokemonNameEl.textContent = member.pokemonName;
  if (realNameEl) realNameEl.textContent = `(${member.name})`;
  if (descEl) descEl.textContent = member.desc;
  if (imageEl) imageEl.src = member.image;

  // Update Grid Elements
  const typesEl = document.getElementById('member-types');
  if (typesEl) {
    typesEl.innerHTML = '';
    member.types.forEach(type => {
      const span = document.createElement('span');
      span.className = `type-badge type-${type}`;
      span.textContent = getTypeLabel(type);
      typesEl.appendChild(span);
    });
  }

  const heightEl = document.getElementById('member-height');
  if (heightEl) heightEl.textContent = member.height;

  const categoryEl = document.getElementById('member-category');
  if (categoryEl) categoryEl.textContent = member.category;

  const gendersEl = document.getElementById('member-genders');
  if (gendersEl) {
    gendersEl.innerHTML = '';
    member.genders.forEach(g => {
      const span = document.createElement('span');
      span.className = `gender-icon gender-${g.toLowerCase()}`;
      span.textContent = g === 'M' ? '♂' : '♀';
      gendersEl.appendChild(span);
    });
  }

  const weightEl = document.getElementById('member-weight');
  if (weightEl) weightEl.textContent = member.weight;

  const abilityEl = document.getElementById('member-ability');
  if (abilityEl) abilityEl.textContent = member.ability;

  // Setup Navigation
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  
  const currentIndex = members.findIndex(m => m.id === member.id);
  const prevMember = members[currentIndex - 1] || members[members.length - 1];
  const nextMember = members[currentIndex + 1] || members[0];

  if (prevBtn) {
    const prevNo = document.getElementById('prev-no');
    const prevName = document.getElementById('prev-name');
    if (prevNo) prevNo.textContent = prevMember.no;
    if (prevName) prevName.textContent = prevMember.name;
    prevBtn.onclick = () => { window.location.href = `${import.meta.env.BASE_URL}member.html?id=${prevMember.id}`; };
  }

  if (nextBtn) {
    const nextNo = document.getElementById('next-no');
    const nextName = document.getElementById('next-name');
    if (nextNo) nextNo.textContent = nextMember.no;
    if (nextName) nextName.textContent = nextMember.name;
    nextBtn.onclick = () => { window.location.href = `${import.meta.env.BASE_URL}member.html?id=${nextMember.id}`; };
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const currentId = getMemberIdFromUrl();
  const currentMember = members.find(m => m.id === currentId) || members[0];
  renderMember(currentMember);
});
