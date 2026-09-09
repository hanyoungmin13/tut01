import { members } from './data';

const CANVAS_SIZE = 320;

type BallBounds = {
  centerX: number;
  top: number;
  width: number;
  height: number;
};

function isBallRed(red: number, green: number, blue: number): boolean {
  return red > 105 && red > green * 1.55 && red > blue * 1.45 && green < 105;
}

function findRedPart(imageData: ImageData): BallBounds | null {
  const { data, width, height } = imageData;
  const visited = new Uint8Array(width * height);
  let largest: BallBounds & { area: number } | null = null;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixelIndex = y * width + x;
      if (visited[pixelIndex]) continue;

      const index = pixelIndex * 4;
      const red = data[index];
      const green = data[index + 1];
      const blue = data[index + 2];
      const alpha = data[index + 3];
      const isRed = alpha > 0 && isBallRed(red, green, blue);
      if (!isRed) continue;

      const pixels = [pixelIndex];
      visited[pixelIndex] = 1;
      let area = 0;
      let minX = x;
      let minY = y;
      let maxX = x;
      let maxY = y;

      while (pixels.length > 0) {
        const current = pixels.pop() as number;
        const currentX = current % width;
        const currentY = Math.floor(current / width);
        area++;
        minX = Math.min(minX, currentX);
        minY = Math.min(minY, currentY);
        maxX = Math.max(maxX, currentX);
        maxY = Math.max(maxY, currentY);

        for (let offsetY = -1; offsetY <= 1; offsetY++) {
          for (let offsetX = -1; offsetX <= 1; offsetX++) {
            if (offsetX === 0 && offsetY === 0) continue;
            const nextX = currentX + offsetX;
            const nextY = currentY + offsetY;
            if (nextX < 0 || nextX >= width || nextY < 0 || nextY >= height) continue;

            const nextPixel = nextY * width + nextX;
            if (visited[nextPixel]) continue;
            const nextIndex = nextPixel * 4;
            if (!isBallRed(data[nextIndex], data[nextIndex + 1], data[nextIndex + 2]) || data[nextIndex + 3] === 0) continue;
            visited[nextPixel] = 1;
            pixels.push(nextPixel);
          }
        }
      }

      if (!largest || area > largest.area) {
        largest = {
          centerX: (minX + maxX) / 2,
          top: minY,
          width: maxX - minX + 1,
          height: maxY - minY + 1,
          area
        };
      }
    }
  }

  if (!largest) return null;
  return {
    centerX: largest.centerX,
    top: largest.top,
    width: largest.width,
    height: largest.height
  };
}

function removeVideoBackground(imageData: ImageData, video: HTMLVideoElement, previousBounds: BallBounds | null): BallBounds | null {
  const bounds = previousBounds ?? findRedPart(imageData);
  if (!bounds) return previousBounds;

  const { data, width, height } = imageData;
  const openingProgress = video.duration > 0
    ? Math.min(1, video.currentTime / Math.max(video.duration * 0.65, 0.01))
    : 0;
  const radiusX = Math.max(bounds.width * (0.7 + openingProgress * 0.08), 38);
  const centerY = bounds.top + bounds.height * (0.98 + openingProgress * 0.18);
  const radiusY = Math.max(bounds.height * (1.08 + openingProgress * 0.42), 48);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      const red = data[index];
      const green = data[index + 1];
      const blue = data[index + 2];
      const alpha = data[index + 3];
      if (alpha === 0) continue;

      const maxChannel = Math.max(red, green, blue);
      const minChannel = Math.min(red, green, blue);
      const brightness = (red + green + blue) / 3;
      const saturation = maxChannel - minChannel;
      const isRed = isBallRed(red, green, blue);
      const isWarmBackground = red > 80 && green > 48 && red > green * 1.02 && blue < green * 0.98 && !isRed;
      const isWhiteBall = brightness > 170 && saturation < 48 && y > centerY - radiusY * 0.15;
      const distance = Math.sqrt(
        ((x - bounds.centerX) / radiusX) ** 2 + ((y - centerY) / radiusY) ** 2
      );
      const insideBall = distance <= 1;
      const nearLight = brightness > 215 && blue > 145 && distance <= 1.55;
      const isFinalTopLeftBlank = openingProgress > 0.72
        && x < bounds.centerX - radiusX * 0.15
        && y < centerY - radiusY * 0.15
        && brightness > 190
        && saturation < 48;
      const isBottomShadow = y > bounds.top + bounds.height * (1.82 + openingProgress * 0.35)
        && brightness < 155
        && saturation < 115;
      const isBallDark = brightness < 92
        && distance < 0.82
        && (
          saturation > 12
          || Math.abs(x - bounds.centerX) < radiusX * 0.5 && Math.abs(y - centerY) < radiusY * 0.3
        );
      const keepPixel = !isFinalTopLeftBlank && !isWarmBackground && !isBottomShadow && (
        insideBall && (isRed || isWhiteBall || isBallDark || saturation > 34 && brightness > 75)
        || nearLight
      );

      if (!keepPixel) {
        data[index + 3] = 0;
      } else if (distance > 0.9 && distance <= 1.08) {
        data[index + 3] = Math.min(data[index + 3], Math.round((1.08 - distance) / 0.18 * 255));
      }
    }
  }

  return bounds;
}

function drawVideoFrame(
  video: HTMLVideoElement,
  context: CanvasRenderingContext2D,
  previousBounds: BallBounds | null
): BallBounds | null {
  if (!video.videoWidth || !video.videoHeight) return previousBounds;

  context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  const scale = Math.min(CANVAS_SIZE / video.videoWidth, CANVAS_SIZE / video.videoHeight);
  const width = video.videoWidth * scale;
  const height = video.videoHeight * scale;
  const left = (CANVAS_SIZE - width) / 2;
  const top = (CANVAS_SIZE - height) / 2;
  context.drawImage(video, left, top, width, height);

  const imageData = context.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  const bounds = removeVideoBackground(imageData, video, previousBounds);
  context.putImageData(imageData, 0, 0);
  return bounds;
}

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

    const canvas = document.createElement('canvas');
    canvas.className = 'pokeball-canvas';
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;

    const video = document.createElement('video');
    video.className = 'pokeball-video';
    video.src = `${import.meta.env.BASE_URL}videos/pokeball-opening.mp4`;
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.setAttribute('aria-hidden', 'true');
    video.setAttribute('tabindex', '-1');

    const context = canvas.getContext('2d');
    if (!context) return;

    let isPlaying = false;
    let animationFrame = 0;
    let previousBounds: BallBounds | null = null;

    const renderFrame = () => {
      previousBounds = drawVideoFrame(video, context, previousBounds);
      if (!video.paused && !video.ended) {
        animationFrame = window.requestAnimationFrame(renderFrame);
      }
    };

    video.addEventListener('loadeddata', () => {
      previousBounds = drawVideoFrame(video, context, previousBounds);
      wrapper.classList.add('video-ready');
    });

    const playOpeningVideo = () => {
      if (isPlaying) return;
      isPlaying = true;
      wrapper.classList.add('is-playing');
      wrapper.setAttribute('aria-busy', 'true');
      video.playbackRate = 1.5;
      video.currentTime = 0;
      void video.play().then(() => {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = window.requestAnimationFrame(renderFrame);
      }).catch(() => {
        isPlaying = false;
        wrapper.classList.remove('is-playing');
        wrapper.removeAttribute('aria-busy');
      });
    };

    video.addEventListener('pause', () => window.cancelAnimationFrame(animationFrame));
    video.addEventListener('ended', () => {
      window.cancelAnimationFrame(animationFrame);
      window.location.href = `${import.meta.env.BASE_URL}member.html?id=${member.id}`;
    });

    wrapper.onclick = playOpeningVideo;
    wrapper.onkeydown = event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        playOpeningVideo();
      }
    };

    pokeball.append(canvas, video);

    const label = document.createElement('div');
    label.className = 'member-label';
    label.textContent = member.name;

    wrapper.appendChild(pokeball);
    wrapper.appendChild(label);
    container.appendChild(wrapper);
  });
});
