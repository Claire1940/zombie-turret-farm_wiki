"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, Play } from "lucide-react";

interface VideoFeatureProps {
  videoId: string;
  title: string;
}

export function VideoFeature({ videoId, title }: VideoFeatureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldPlay, setShouldPlay] = useState(false);

  const watchUrl = useMemo(
    () => `https://www.youtube.com/watch?v=${videoId}`,
    [videoId],
  );

  // loop=1 needs playlist=<same id> to actually repeat a single video.
  const embedUrl = useMemo(
    () =>
      `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&playsinline=1&rel=0`,
    [videoId],
  );

  // Autoplay when the player scrolls into view; clicking the poster is the
  // manual fallback in case the observer never fires.
  useEffect(() => {
    const node = containerRef.current;
    if (!node || shouldPlay) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShouldPlay(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldPlay]);

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="group relative w-full overflow-hidden rounded-lg bg-black"
        style={{ paddingBottom: "56.25%" }}
      >
        {shouldPlay ? (
          <iframe
            className="absolute top-0 left-0 h-full w-full"
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setShouldPlay(true)}
            aria-label={`Play ${title}`}
            className="absolute inset-0 flex h-full w-full items-center justify-center"
          >
            {/* Poster thumbnail */}
            <img
              src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
              alt={title}
              loading="lazy"
              className="absolute inset-0 h-full w-full scale-105 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <span className="absolute inset-0 bg-black/40 transition-opacity group-hover:bg-black/30" />
            <span className="relative z-10 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--nav-theme))] text-white shadow-lg transition-transform duration-300 group-hover:scale-110 md:h-20 md:w-20">
              <Play className="ml-1 h-7 w-7 fill-current md:h-9 md:w-9" />
            </span>
          </button>
        )}
      </div>

      <div className="flex justify-center">
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
        >
          Watch on YouTube
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
