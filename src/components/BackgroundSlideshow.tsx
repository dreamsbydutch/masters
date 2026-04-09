import { useEffect, useState } from 'react';

const backgroundFrames = [
  'center 0%',
  'center 18%',
  'center 36%',
  'center 56%',
  'center 76%',
  'center 98%',
] as const;

const BACKGROUND_CYCLE_MS = 180_000;
const FADE_DURATION_MS = 1_500;

type BackgroundLayerProps = {
  position: (typeof backgroundFrames)[number];
  fading?: boolean;
};

function BackgroundLayer({ position, fading = false }: BackgroundLayerProps) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!fading) {
      return undefined;
    }

    const frameId = window.requestAnimationFrame(() => {
      setHidden(true);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [fading]);

  return (
    <div
      className={`absolute inset-0 scale-[1.04] bg-cover bg-no-repeat transition-opacity duration-[1500ms] ease-out ${
        hidden ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        backgroundImage: 'url("/assets/images/background-pdf.png")',
        backgroundPosition: position,
      }}
    />
  );
}

export function BackgroundSlideshow() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => {
        const nextIndex = (currentIndex + 1) % backgroundFrames.length;
        setPreviousIndex(currentIndex);
        return nextIndex;
      });
    }, BACKGROUND_CYCLE_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (previousIndex === null) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setPreviousIndex(null);
    }, FADE_DURATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [previousIndex]);

  return (
    <div className="fixed inset-0 overflow-hidden" aria-hidden="true">
      <BackgroundLayer position={backgroundFrames[activeIndex]} />
      {previousIndex !== null ? (
        <BackgroundLayer fading position={backgroundFrames[previousIndex]} />
      ) : null}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,32,18,0.46),rgba(9,32,18,0.62)),radial-gradient(circle_at_top_center,rgba(255,255,255,0.14),transparent_35%)]" />
    </div>
  );
}
