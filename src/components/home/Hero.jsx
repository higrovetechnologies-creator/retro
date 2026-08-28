import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const [heroStage, setHeroStage] = useState(0);

  /* ============================================================
     STAGE
     ============================================================ */

  useEffect(() => {
    const unsubscribe = scrollYProgress.on(
      "change",
      (progress) => {
        setHeroStage(progress < 0.20 ? 0 : 1);
      }
    );

    return () => unsubscribe();
  }, [scrollYProgress]);

  /* ============================================================
     PERFORMANCE OPTIMIZED SCROLL VIDEO

     Scroll controls video timeline like keyframes.

     0%   -> video 0%
     25%  -> video 25%
     50%  -> video 50%
     75%  -> video 75%
     100% -> video 100%

     NO AUTOPLAY
     NO LOOP
     NO SMOOTH INTERPOLATION DELAY

     Small unnecessary seeks are skipped to reduce lag.
  ============================================================ */

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    let duration = 0;
    let ready = false;

    let targetProgress = 0;
    let lastRenderedTime = -1;

    let rafId = null;

    /* ------------------------------------------------------------
       Initialize video
    ------------------------------------------------------------ */

    const initializeVideo = () => {
      if (
        !video.duration ||
        !Number.isFinite(video.duration)
      ) {
        return;
      }

      duration = video.duration;
      ready = true;

      targetProgress = scrollYProgress.get();

      const initialTime =
        targetProgress *
        Math.max(0, duration - 0.05);

      try {
        video.currentTime = initialTime;
        lastRenderedTime = initialTime;
      } catch {
        // Ignore seek errors
      }
    };

    /* ------------------------------------------------------------
       Store scroll progress

       We DON'T directly seek here.
       requestAnimationFrame handles the actual rendering.
    ------------------------------------------------------------ */

    const handleScroll = (progress) => {
      targetProgress = Math.min(
        Math.max(progress, 0),
        1
      );
    };

    /* ------------------------------------------------------------
       Render video frame

       Browser rendering cycle synchronization.
    ------------------------------------------------------------ */

    const renderVideo = () => {
      if (
        ready &&
        duration > 0 &&
        Number.isFinite(duration)
      ) {
        const targetTime =
          targetProgress *
          Math.max(0, duration - 0.05);

        /*
         * 0.033 sec ≈ 30 FPS threshold.
         *
         * If the requested frame change is smaller,
         * don't perform another expensive video seek.
         */

        if (
          Math.abs(
            targetTime - lastRenderedTime
          ) >= 0.033
        ) {
          try {
            video.currentTime = targetTime;
            lastRenderedTime = targetTime;
          } catch {
            // Ignore seek errors
          }
        }
      }

      rafId =
        requestAnimationFrame(
          renderVideo
        );
    };

    /* ============================================================
       VIDEO CONFIGURATION
    ============================================================ */

    video.pause();

    video.autoplay = false;
    video.loop = false;
    video.muted = true;
    video.playsInline = true;

    video.setAttribute(
      "playsinline",
      ""
    );

    video.setAttribute(
      "preload",
      "auto"
    );

    video.addEventListener(
      "loadedmetadata",
      initializeVideo
    );

    /*
     * Metadata may already be loaded.
     */

    if (video.readyState >= 1) {
      initializeVideo();
    }

    /* ============================================================
       SCROLL LISTENER
    ============================================================ */

    const unsubscribe =
      scrollYProgress.on(
        "change",
        handleScroll
      );

    /* ============================================================
       START VIDEO RENDER LOOP
    ============================================================ */

    rafId =
      requestAnimationFrame(
        renderVideo
      );

    /* ============================================================
       CLEANUP
    ============================================================ */

    return () => {
      unsubscribe();

      video.removeEventListener(
        "loadedmetadata",
        initializeVideo
      );

      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [scrollYProgress]);

  /* ============================================================
     RETRO
  ============================================================ */

  const retroOpacity = useTransform(
    scrollYProgress,
    [0, 0.08, 0.15, 0.24],
    [1, 1, 0.55, 0]
  );

  const retroScale = useTransform(
    scrollYProgress,
    [0, 0.24],
    [1, 1.04]
  );

  const retroY = useTransform(
    scrollYProgress,
    [0, 0.24],
    [0, -25]
  );

  /* ============================================================
     LUXURY
  ============================================================ */

  const luxuryOpacity = useTransform(
    scrollYProgress,
    [0.16, 0.32],
    [0, 1]
  );

  const luxuryY = useTransform(
    scrollYProgress,
    [0.16, 0.32, 0.72, 1],
    [45, 0, -50, -180]
  );

  const luxuryScale = useTransform(
    scrollYProgress,
    [0.16, 0.32, 1],
    [0.95, 1, 0.92]
  );

  /* ============================================================
     END IMAGE
  ============================================================ */

  const endImageOpacity = useTransform(
    scrollYProgress,
    [0.72, 0.84, 1],
    [0, 0.55, 1]
  );

  const endImageScale = useTransform(
    scrollYProgress,
    [0.72, 1],
    [1.08, 1]
  );

  const endImageY = useTransform(
    scrollYProgress,
    [0.72, 1],
    [60, 0]
  );

  /* ============================================================
     END IMAGE OVERLAY
  ============================================================ */

  const endOverlayOpacity = useTransform(
    scrollYProgress,
    [0.72, 0.90, 1],
    [0, 0.25, 0.45]
  );

  /* ============================================================
     BACKGROUND OVERLAY
  ============================================================ */

  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 0.35, 0.75, 1],
    [0.78, 0.58, 0.62, 0.72]
  );

  /* ============================================================
     GRAIN
  ============================================================ */

  const grainOpacity = useTransform(
    scrollYProgress,
    [0, 0.35, 0.75, 1],
    [0.30, 0.14, 0.16, 0.10]
  );

  /* ============================================================
     SCROLL INDICATOR
  ============================================================ */

  const scrollIndicatorOpacity =
    useTransform(
      scrollYProgress,
      [0, 0.55, 0.82, 1],
      [1, 1, 0.25, 0]
    );

  return (
    <section
      ref={sectionRef}
      className="
        relative
        h-[200vh]
        bg-ink
      "
    >
      {/* ======================================================
          STICKY HERO
      ======================================================= */}

      <div
        className="
          sticky
          top-0
          h-screen
          w-full
          overflow-hidden
          bg-black
        "
      >

        {/* ====================================================
            SCROLL KEYFRAME VIDEO
        ===================================================== */}

        <video
          ref={videoRef}
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
            will-change-auto
          "
          src="/hero-video.mp4"
          muted
          playsInline
          preload="auto"
          autoPlay={false}
          loop={false}
          controls={false}
          aria-hidden="true"
        />

        {/* ====================================================
            BASE OVERLAY
        ===================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-black/30
          "
        />

        {/* ====================================================
            CINEMATIC OVERLAY
        ===================================================== */}

        <motion.div
          style={{
            opacity: overlayOpacity,
          }}
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-b
            from-black/55
            via-black/20
            to-black/75
          "
        />

        {/* ====================================================
            END IMAGE
        ===================================================== */}

        <motion.img
          src="/hero-end.jpg"
          alt=""
          draggable={false}
          style={{
            opacity: endImageOpacity,
            scale: endImageScale,
            y: endImageY,
          }}
          className="
            pointer-events-none
            absolute
            inset-0
            h-full
            w-full
            object-cover
            will-change-transform
          "
          aria-hidden="true"
        />

        {/* ====================================================
            END IMAGE OVERLAY
        ===================================================== */}

        <motion.div
          style={{
            opacity: endOverlayOpacity,
          }}
          className="
            pointer-events-none
            absolute
            inset-0
            bg-black
          "
        />

        {/* ====================================================
            GRAIN
        ===================================================== */}

        <motion.div
          style={{
            opacity: grainOpacity,
          }}
          className="
            pointer-events-none
            absolute
            inset-0
            z-20
            mix-blend-overlay
            grain
          "
        />

        {/* ====================================================
            HERO CONTENT
        ===================================================== */}

        <div
          className="
            relative
            z-10
            flex
            h-full
            w-full
            items-center
            justify-center
            px-6
            text-center
          "
        >

          {/* ==================================================
              RETRO
          =================================================== */}

          {heroStage === 0 && (
            <motion.div
              key="retro"
              style={{
                opacity: retroOpacity,
                scale: retroScale,
                y: retroY,
              }}
              className="
                absolute
                flex
                flex-col
                items-center
                will-change-transform
              "
            >
              <span
                className="
                  mb-4
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.3em]
                  text-mist
                  sm:text-[11px]
                  sm:tracking-[0.4em]
                "
              >
                Tirunelveli · Since 2026
              </span>

              <h1
                className="
                  font-display
                  text-[20vw]
                  leading-[0.82]
                  text-bone
                  sm:text-[15vw]
                  lg:text-[11vw]
                "
              >
                Retro
              </h1>
            </motion.div>
          )}

          {/* ==================================================
              LUXURY
          =================================================== */}

          {heroStage === 1 && (
            <motion.div
              key="luxury"
              style={{
                opacity: luxuryOpacity,
                y: luxuryY,
                scale: luxuryScale,
              }}
              className="
                absolute
                flex
                max-w-[95vw]
                flex-col
                items-center
                will-change-transform
              "
            >
              <h2
                className="
                  font-display
                  text-[14vw]
                  leading-[0.82]
                  text-bone
                  sm:text-[11vw]
                  lg:text-[8vw]
                "
              >
                Luxury
              </h2>

              <p
                className="
                  mt-5
                  font-display
                  text-[9vw]
                  italic
                  leading-[0.9]
                  text-bone
                  sm:text-[6vw]
                  lg:text-[4.5vw]
                "
              >
                Made Affordable
              </p>

              <span
                className="
                  mt-5
                  max-w-[90vw]
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.25em]
                  text-mist
                  sm:text-[11px]
                  sm:tracking-[0.35em]
                "
              >
                Cut for the everyday. Priced for everyone.
              </span>
            </motion.div>
          )}

        </div>

        {/* ====================================================
            SCROLL INDICATOR
        ===================================================== */}

        <motion.div
          style={{
            opacity: scrollIndicatorOpacity,
          }}
          className="
            absolute
            inset-x-0
            bottom-8
            z-30
            flex
            flex-col
            items-center
            gap-2
            text-mist
          "
        >
          <span
            className="
              text-[9px]
              uppercase
              tracking-[0.3em]
              sm:text-[10px]
            "
          >
            Scroll
          </span>

          <motion.div
            animate={{
              y: [0, 6, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.8,
              ease: "easeInOut",
            }}
          >
            <ChevronDown
              size={16}
              strokeWidth={1.5}
            />
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}