import { members } from './data';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('pokeballs-container');
  if (!container) return;

  members.forEach(member => {
    const wrapper = document.createElement('div');
    wrapper.className = 'pokeball-wrapper';
    wrapper.onclick = () => {
      window.location.href = `${import.meta.env.BASE_URL}member.html?id=${member.id}`;
    };

    const pokeball = document.createElement('div');
    pokeball.className = 'pokeball-image';

    const label = document.createElement('div');
    label.className = 'member-label';
    label.textContent = member.name;

    wrapper.appendChild(pokeball);
    wrapper.appendChild(label);
    container.appendChild(wrapper);
  });
});
