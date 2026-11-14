import { useEffect, useRef } from "react";
import "./BackgroundVideos.css";

const VIDEO_1_SRC = encodeURI("/background 1 animiated video/background 1.mp4");
const VIDEO_2_SRC = encodeURI("/background 2 animated video/Mine Video.mp4");

function BackgroundVideos() {
  const video1Ref = useRef(null);
  const video2Ref = useRef(null);

  // Video 1: autoplay and loop as before
  useEffect(() => {
    const video = video1Ref.current;
    if (!video) return;
    video.muted = true;
    const p = video.play();
    if (p !== undefined) p.catch(() => {});
  }, []);

  // Video 2: playback position follows the scroll position
  useEffect(() => {
    const video = video2Ref.current;
    if (!video) return;

    video.muted = true;
    // Some mobile browsers need a quick play/pause to allow seeking
    const p = video.play();
    if (p !== undefined) {
      p.then(() => video.pause()).catch(() => {});
    }

    let targetTime = 0;
    let currentTime = 0;
    let rafId;

    const getProgress = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return 0;
      return Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
    };

    const onScroll = () => {
      if (!video.duration) return;
      targetTime = getProgress() * video.duration;
    };

    const tick = () => {
      // Smooth easing toward the target time
      currentTime += (targetTime - currentTime) * 0.12;
      if (
        video.duration &&
        Math.abs(video.currentTime - currentTime) > 0.02 &&
        !video.seeking
      ) {
        video.currentTime = currentTime;
      }
      rafId = requestAnimationFrame(tick);
    };

    const onReady = () => {
      onScroll();
      currentTime = targetTime;
    };

    video.addEventListener("loadedmetadata", onReady);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      video.removeEventListener("loadedmetadata", onReady);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      {/* Bottom layer: Background Video 1 (loops on its own) */}
      <div className="background-video-wrapper" aria-hidden="true">
        <video
          ref={video1Ref}
          className="background-video"
          src={VIDEO_1_SRC}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          controls={false}
        />
      </div>

      {/* Middle layer: Background Video 2 (controlled by scroll) */}
      <div className="background-video-2-wrapper" aria-hidden="true">
        <video
          ref={video2Ref}
          className="background-video-2"
          src={VIDEO_2_SRC}
          muted
          playsInline
          preload="auto"
          controls={false}
        />
      </div>
    </>
  );
}

export default BackgroundVideos;