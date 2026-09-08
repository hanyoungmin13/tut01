import { members } from './data';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('pokeballs-container');
  if (!container) return;

  members.forEach(member => {
    const wrapper = document.createElement('div');
    wrapper.className = 'pokeball-wrapper';
    wrapper.setAttribute('role', 'button');
    wrapper.setAttribute('tabindex', '0');
    wrapper.setAttribute('aria-label', `${member.name} 도감 열기`);

    let isOpening = false;
    const openMemberPage = () => {
      if (isOpening) return;
      isOpening = true;
      wrapper.classList.add('is-opening');
      wrapper.setAttribute('aria-busy', 'true');
      window.setTimeout(() => {
        window.location.href = `${import.meta.env.BASE_URL}member.html?id=${member.id}`;
      }, 1650);
    };

    wrapper.onclick = openMemberPage;
    wrapper.onkeydown = event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openMemberPage();
      }
    };

    const pokeball = document.createElement('div');
    pokeball.className = 'pokeball-visual';

    const bottom = document.createElement('div');
    bottom.className = 'pokeball-layer pokeball-bottom';

    const hinge = document.createElement('div');
    hinge.className = 'pokeball-hinge';

    const chamber = document.createElement('div');
    chamber.className = 'pokeball-chamber';

    const interior = document.createElement('div');
    interior.className = 'pokeball-interior';

    const top = document.createElement('div');
    top.className = 'pokeball-layer pokeball-top';

    const openState = document.createElement('div');
    openState.className = 'pokeball-open-state';

    const light = document.createElement('div');
    light.className = 'pokeball-light';

    pokeball.append(bottom, hinge, chamber, interior, top, openState, light);

    const label = document.createElement('div');
    label.className = 'member-label';
    label.textContent = member.name;

    wrapper.appendChild(pokeball);
    wrapper.appendChild(label);
    container.appendChild(wrapper);
  });
});
