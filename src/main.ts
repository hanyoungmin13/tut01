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

    const pokeball = document.createElement('div');
    pokeball.className = 'pokeball-image';

    const video = document.createElement('video');
    video.className = 'pokeball-video';
    video.src = `${import.meta.env.BASE_URL}videos/pokeball-opening.mp4`;
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.setAttribute('aria-hidden', 'true');

    let isPlaying = false;
    const playOpeningVideo = () => {
      if (isPlaying) return;
      isPlaying = true;
      wrapper.classList.add('is-playing');
      wrapper.setAttribute('aria-busy', 'true');
      video.currentTime = 0;
      void video.play().catch(() => {
        isPlaying = false;
        wrapper.classList.remove('is-playing');
        wrapper.removeAttribute('aria-busy');
      });
    };

    video.addEventListener('ended', () => {
      window.location.href = `${import.meta.env.BASE_URL}member.html?id=${member.id}`;
    });

    wrapper.onclick = playOpeningVideo;
    wrapper.onkeydown = event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        playOpeningVideo();
      }
    };

    pokeball.appendChild(video);

    const label = document.createElement('div');
    label.className = 'member-label';
    label.textContent = member.name;

    wrapper.appendChild(pokeball);
    wrapper.appendChild(label);
    container.appendChild(wrapper);
  });
});
