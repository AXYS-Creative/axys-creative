// Cubic Bézier easing function (for cross-browser compatible animations)
export const cubicBezier = (p1x, p1y, p2x, p2y) => {
  // Example: const ease = cubicBezier(0.09, 0.9, 0.5, 1);
  return function (t) {
    t = Math.max(0, Math.min(1, t));

    const t2 = t * t;
    const t3 = t2 * t;
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;

    const x = 3 * mt2 * t * p1x + 3 * mt * t2 * p2x + t3;
    const y = 3 * mt2 * t * p1y + 3 * mt * t2 * p2y + t3;

    return y;
  };
};

// GSAP
{
  gsap.registerPlugin(ScrollTrigger);
  gsap.registerPlugin(ScrambleTextPlugin);

  let responsiveGsap = gsap.matchMedia();

  const createMarkers = (color, indent) => ({
    startColor: color,
    endColor: color,
    fontSize: "12px",
    indent: indent,
    fontWeight: 500,
  });

  let whiteMarkers = createMarkers("white", 20);
  let blackMarkers = createMarkers("black", 20);
  let navyMarkers = createMarkers("navy", 120);
  let coralMarkers = createMarkers("coral", 120);
  let yellowMarkers = createMarkers("yellow", 220);

  responsiveGsap.add(
    {
      maxSm: "(max-width: 480px)",
      maxMd: "(max-width: 768px)",
      maxLg: "(max-width: 1024px)",
      minMd: "(min-width: 769px)",
    },
    (context) => {
      let { maxSm, maxMd, maxLg, minMd } = context.conditions;

      let bodyPadding = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--body-padding");

      // Utility
      // Shuffle an array in place (used for grid-fade)
      function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
      }

      // GLOBAL (placing may affect animation! Moving these to the top) - Animate any element with the class 'gsap-animate' using the 'animate' companion class
      {
        // .gsap-animate util
        const gsapElems = document.querySelectorAll(".gsap-animate");

        gsapElems.forEach((gsapElem) => {
          let startVal = gsapElem.dataset.gsapStart || "top 98%";
          let endVal = gsapElem.dataset.gsapEnd || "bottom top";
          let showMarkers = gsapElem.dataset.gsapMarkers === "true";
          let triggerEl = gsapElem.dataset.gsapTrigger || gsapElem;

          gsap.to(gsapElem, {
            scrollTrigger: {
              trigger: triggerEl,
              start: startVal,
              end: endVal,
              onEnter: () => gsapElem.classList.add("animate"),
              onLeave: () => gsapElem.classList.remove("animate"),
              onEnterBack: () => gsapElem.classList.add("animate"),
              onLeaveBack: () => gsapElem.classList.remove("animate"),
              // markers: showMarkers,
            },
          });
        });

        // Split Text (characters & words)
        {
          const splitCharacters = document.querySelectorAll(".split-chars");
          const splitWords = document.querySelectorAll(".split-words");

          splitCharacters.forEach((el) => {
            new SplitText(el, {
              type: "chars",
              charsClass: "split-chars__char++",
              tag: "span",
            });
          });

          splitWords.forEach((el) => {
            new SplitText(el, {
              type: "words",
              wordsClass: "split-words__word++",
              tag: "span",
            });
          });
        }
      }

      // Library - Lift any desired code blocks out, then delete from production
      {
        // Fill Text - Scrub only
        {
          // Use 'fill-text' for default, then 'quick-fill' or 'slow-fill' to modify animation end
          const fillText = document.querySelectorAll(".fill-text");

          if (fillText) {
            fillText.forEach((el) => {
              let end = "bottom 60%";

              // Modifier classes –— Higher percentage ends the animation faster
              if (el.classList.contains("quick-fill")) {
                end = "bottom 80%";
              } else if (el.classList.contains("slow-fill")) {
                end = "bottom 40%";
              }

              gsap.fromTo(
                el,
                {
                  backgroundSize: "0%",
                },
                {
                  backgroundSize: "100%",
                  scrollTrigger: {
                    trigger: el,
                    start: "top 90%",
                    end: end,
                    scrub: 1,
                  },
                }
              );
            });
          }
        }

        // Grid Fade (Utility)
        {
          const gridFades = document.querySelectorAll(".grid-fade");

          if (gridFades.length) {
            gridFades.forEach((section) => {
              const scrubVal = 0.5;
              const fadeType = section.dataset.gridFade || "in";
              const tileSize = section.dataset.gridTileSize || "medium";
              const tileFadeRandom = section.dataset.gridFadeRandom || "true";

              // Determine config based on tileSize (default medium)
              let tileCount = 40;
              let minWidth = "12%";

              if (tileSize === "large") {
                tileCount = 20;
                minWidth = "18%";
              } else if (tileSize === "small") {
                tileCount = 192;
                minWidth = "6%";
              }

              const overlay = document.createElement("div");
              overlay.classList.add("grid-fade__overlay");

              const tiles = [];
              for (let i = 0; i < tileCount; i++) {
                const tile = document.createElement("div");
                tile.classList.add("grid-fade__overlay--tile");
                tile.style.minWidth = minWidth;
                overlay.appendChild(tile);
                tiles.push(tile);
              }

              section.appendChild(overlay);

              if (tileFadeRandom === "true") {
                shuffleArray(tiles);
              }

              if (fadeType === "in") {
                gsap.fromTo(
                  tiles,
                  { opacity: 1 },
                  {
                    opacity: 0,
                    ease: "none",
                    stagger: 1,
                    scrollTrigger: {
                      trigger: section,
                      start: "top 70%",
                      end: "top 15%",
                      scrub: scrubVal,
                    },
                  }
                );
              } else if (fadeType === "in-out") {
                const tl = gsap.timeline({
                  scrollTrigger: {
                    trigger: section,
                    start: "top 60%",
                    end: "bottom 20%",
                    scrub: scrubVal,
                  },
                });

                tl.to(tiles, {
                  opacity: 0,
                  ease: "none",
                  stagger: 1,
                })
                  .to(tiles, {
                    opacity: 0,
                    ease: "none",
                    stagger: 1,
                  })
                  .to(tiles, {
                    opacity: 1,
                    ease: "none",
                    stagger: 1,
                  });
              }
            });
          }
        }

        // Scroll Horizontal "sh" (pinned section)
        {
          const scrollHorizontal = document.querySelectorAll(
            ".scroll-horizontal__pin"
          );

          let scrollHorizontalScrub = maxSm ? 1 : 0.5;

          scrollHorizontal.forEach((el) => {
            let container = el.querySelector(".scroll-horizontal__container");
            let slider = el.querySelector(".scroll-horizontal__slider");
            let imgs = el.querySelectorAll(
              ".scroll-horizontal__figure--parallax img"
            );
            const sliderWidth = slider.scrollWidth;
            const containerWidth = container.offsetWidth;
            const distanceToTranslate = sliderWidth - containerWidth;

            let duration = maxSm ? "+=150%" : "+=200%";

            // Actual Pinning
            gsap.to(el, {
              scrollTrigger: {
                trigger: el,
                start: "top top",
                end: duration,
                pin: true,
              },
            });

            // Slider Along X-Axis
            gsap.fromTo(
              slider,
              { x: 0 },
              {
                x: () => -distanceToTranslate,
                ease: "none",
                scrollTrigger: {
                  trigger: el,
                  start: "top top",
                  end: duration,
                  scrub: scrollHorizontalScrub,
                },
              }
            );

            // // Optional parallax effect on images (use landscape images in portrait view)
            // imgs.forEach((img) => {
            //   gsap.fromTo(
            //     img,
            //     { x: 0 },
            //     {
            //       x: "25%", // Adjust this value for more or less parallax effect
            //       ease: "none",
            //       scrollTrigger: {
            //         trigger: el,
            //         start: "top top",
            //         end: duration,
            //         scrub: scrollHorizontalScrub,
            //       },
            //     }
            //   );
            // });

            // Scoped word/letter splitting to pin steps within scroll horizontal (sh)
            {
              const shSplitChars = document.querySelectorAll(".sh-split-chars");
              const shSplitWords = document.querySelectorAll(".sh-split-words");

              shSplitChars.forEach((el) => {
                new SplitText(el, {
                  type: "chars",
                  charsClass: "split-chars__char++",
                  tag: "span",
                });
              });

              shSplitWords.forEach((el) => {
                new SplitText(el, {
                  type: "words",
                  wordsClass: "split-words__word++",
                  tag: "span",
                });
              });
            }

            // Nested animations
            const shSplitOffset = 128;

            let shSplitChars1 = document.querySelectorAll(
              ".sh-split-chars-1 .split-chars__char"
            );

            if (shSplitChars1.length) {
              gsap.fromTo(
                shSplitChars1,
                {
                  opacity: 0,
                  y: -shSplitOffset,
                },
                {
                  opacity: 1,
                  y: 0,
                  stagger: 0.1,
                  ease: "power2.out",
                  scrollTrigger: {
                    trigger: ".scroll-horizontal",
                    start: `${maxMd ? "34%" : maxLg ? "22%" : "18%"} center`,
                    end: `${maxMd ? "48%" : maxLg ? "44%" : "42%"} center`,
                    scrub: 1,
                  },
                }
              );
            }

            let shSplitChars2 = document.querySelectorAll(
              ".sh-split-chars-2 .split-chars__char"
            );

            if (shSplitChars2.length) {
              gsap.fromTo(
                shSplitChars2,
                {
                  opacity: 0,
                  y: shSplitOffset,
                },
                {
                  opacity: 1,
                  y: 0,
                  stagger: 0.1,
                  ease: "power2.out",
                  scrollTrigger: {
                    trigger: ".scroll-horizontal",
                    start: `${maxMd ? "44%" : maxLg ? "34%" : "28%"} center`,
                    end: `${maxMd ? "56%" : maxLg ? "56%" : "52%"} center`,
                    scrub: 1,
                  },
                }
              );
            }

            let pinIconMobile = document.querySelector(".pin-icon-mobile");

            if (pinIconMobile) {
              gsap.to(pinIconMobile, {
                rotate: "-10deg",
                y: 0,
                opacity: 1,
                scale: 1,
                scrollTrigger: {
                  trigger: ".scroll-horizontal",
                  start: `${maxMd ? "64%" : "70%"} center`,
                  end: `${maxMd ? "66%" : "72%"} center`,
                  scrub: 1,
                },
              });
            }

            let pinIconDesktop = document.querySelector(".pin-icon-desktop");

            if (pinIconDesktop) {
              gsap.to(pinIconDesktop, {
                rotate: "10deg",
                y: 0,
                opacity: 1,
                scale: 1,
                scrollTrigger: {
                  trigger: ".scroll-horizontal",
                  start: `${maxMd ? "65%" : "71%"} center`,
                  end: `${maxMd ? "67%" : "73%"} center`,
                  scrub: 1,
                },
              });
            }

            let pinStar = document.querySelector(".pin-spin__star");

            if (pinStar) {
              gsap.to(".pin-spin__star", {
                rotate: "0",
                scale: "1",
                scrollTrigger: {
                  trigger: ".scroll-horizontal",
                  start: `${maxSm ? "74%" : "78%"} center`,
                  end: `${maxSm ? "80%" : "84%"} center`,
                  scrub: 1,
                },
              });
            }
          });
        }

        // Scroll Stack (Overlapping Panels) — Duration and Delays can be controls via pin-steps in _scroll-stack.scss
        {
          const stackScrollSections =
            document.querySelectorAll(".scroll-stack");

          let panelToTop = maxSm ? "96px" : "200px"; // Match with $panel-to-top in _scroll-stack.scss
          let panelScrub = 0.5;

          stackScrollSections.forEach((section) => {
            const panels = section.querySelectorAll(".scroll-stack__panel");
            const pinContainer = section.querySelector(".scroll-stack__pin");
            const pinSteps = section.querySelectorAll(
              ".scroll-stack__pin-step"
            );

            const duration = `${panels.length * 100}%`;

            // Pin the entire panel container
            gsap.to(pinContainer, {
              scrollTrigger: {
                trigger: pinContainer,
                start: `top ${bodyPadding}`,
                end: duration,
                pin: true,
              },
            });

            // Slide and scale panels
            panels.forEach((panel, i) => {
              const panelIndex = i + 1;
              const nextPanel = panels[i + 1];
              const triggerStep = section.querySelector(
                `.scroll-stack__pin-step-${panelIndex + 1}`
              );

              if (!triggerStep || !nextPanel) return;

              // Scale panels
              gsap.fromTo(
                `.scroll-stack__panel-${panelIndex}`,
                { scale: 1 },
                {
                  scale: 0.95,
                  ease: "none",
                  scrollTrigger: {
                    trigger: triggerStep,
                    start: "top 112%",
                    end: "bottom 112%",
                    scrub: panelScrub,
                  },
                }
              );

              // Slide in next panel
              gsap.fromTo(
                `.scroll-stack__panel-${panelIndex + 1}`,
                {
                  top: "120%",
                  // transform:
                  //   "perspective(1200px) rotateX(-50deg) translate(-50%, 0%)",
                },
                {
                  top: panelToTop,
                  // transform:
                  //   "perspective(1200px) rotateX(0deg) translate(-50%, 0%)",
                  ease: "none",
                  scrollTrigger: {
                    trigger: triggerStep,
                    start: "top 112%",
                    end: "bottom 112%",
                    scrub: panelScrub,
                  },
                }
              );
            });

            // Stack Link highlight
            if (document.querySelector(".scroll-stack__nav-link")) {
              const stackLinks = document.querySelectorAll(
                ".scroll-stack__nav-link"
              );

              pinSteps.forEach((marker, index) => {
                const link = stackLinks[index];

                ScrollTrigger.create({
                  trigger: marker,
                  start: "-15% top",
                  end: "85% top",
                  onEnter: () => link.classList.add("active"),
                  onEnterBack: () => link.classList.add("active"),
                  onLeave: () => link.classList.remove("active"),
                  onLeaveBack: () => link.classList.remove("active"),
                });
              });
            }
          });
        }

        // Glitch Text (Uses gsap scrambleText) // Place below horizontal scroll & scroll stacking
        {
          let alphaNumberic = "0123456789abcedfghijklmnopqrstuvwxyz";
          const glitchTextElems = document.querySelectorAll(".glitch-text");

          glitchTextElems.forEach((el) => {
            const width = el.offsetWidth;
            el.style.width = `${width}px`;
          });

          // Scroll-based glitch
          document.querySelectorAll(".glitch-scroll").forEach((el) => {
            const originalText = el.textContent;
            const chars = el.dataset.glitchChars || "upperAndLowerCase";
            const revealDelay =
              parseFloat(el.dataset.glitchRevealDelay) || 0.05;
            const duration = parseFloat(el.dataset.glitchDuration) || 0.75;
            const playOnceAttr = el.dataset.glitchOnce;
            const playOnce = playOnceAttr === "true"; // Default is false (repeat), only true if explicitly set
            const glitchTrigger = el.dataset.glitchTrigger || el; // Requires . or #
            const glitchStart = el.dataset.glitchStart || "top 98%";
            const glitchEnd = el.dataset.glitchEnd || "bottom top"; // Only on "playOnce = false"
            const glitchMarkers = el.dataset.glitchMarkers === "true";

            if (playOnce) {
              // 🔁 Play once on scroll
              gsap
                .timeline({
                  scrollTrigger: {
                    trigger: glitchTrigger,
                    start: glitchStart,
                    once: true,
                    markers: glitchMarkers,
                  },
                })
                .to(el, {
                  scrambleText: {
                    text: originalText,
                    chars,
                    revealDelay,
                  },
                  duration,
                });
            } else {
              // 🔁 Repeat on scroll in both directions
              const animateScramble = () => {
                el.textContent = originalText;

                gsap.to(el, {
                  scrambleText: {
                    text: originalText,
                    chars,
                    revealDelay,
                  },
                  duration,
                });
              };

              gsap.to(el, {
                scrollTrigger: {
                  trigger: glitchTrigger,
                  start: glitchStart,
                  end: glitchEnd,
                  onEnter: animateScramble,
                  onEnterBack: animateScramble,
                  markers: glitchMarkers,
                },
              });
            }
          });

          // Hover-based glitch
          document.querySelectorAll(".glitch-hover").forEach((el) => {
            const originalText = el.textContent;
            const width = el.scrollWidth;
            el.style.width = `${width}px`;
            el.style.display = "inline-block";

            const runGlitch = () => {
              el.textContent = originalText;

              gsap.to(el, {
                scrambleText: {
                  text: originalText,
                  chars: "upperAndLowerCase",
                },
                duration: 1,
                revealDelay: 0.125,
              });
            };

            el.addEventListener("mouseenter", runGlitch);
            el.addEventListener("focus", runGlitch);
          });

          // Sibling glitch, uses 'glitch-trigger' and 'glitch-target__arbitrary' — 'glitch-trigger' needs data-glitch-target attribute with the unique target class
          document.querySelectorAll(".glitch-trigger").forEach((trigger) => {
            const targetClass = trigger.dataset.glitchTarget;
            if (!targetClass) return;

            // Scope to the nearest ancestor that contains both trigger and target
            const scope =
              trigger.closest(`[class*="glitch"]`) || trigger.parentElement;

            // Search *within that scope* for the target class
            const target = scope.querySelector(`.${targetClass}`);
            if (!target) return;

            // Store original text only once
            if (!target.dataset.originalText) {
              const originalText = target.textContent;
              target.dataset.originalText = originalText;
              const width = target.scrollWidth;
              target.style.width = `${width}px`;
              target.style.display = "inline-block";
            }

            const runGlitch = () => {
              const originalText = target.dataset.originalText;

              target.textContent = originalText;

              gsap.to(target, {
                scrambleText: {
                  text: originalText,
                  chars: "upperAndLowerCase",
                },
                duration: 1,
                revealDelay: 0.125,
              });
            };

            trigger.addEventListener("mouseenter", runGlitch);
            trigger.addEventListener("focus", runGlitch);
          });

          // Cycle-based glitch
          document.querySelectorAll(".glitch-cycle").forEach((el) => {
            const words =
              el.dataset.glitchCycleWords?.split(",").map((w) => w.trim()) ||
              [];
            const colorValues = el.dataset.glitchCycleColors
              ?.split(",")
              .map((c) => c.trim());
            const hasColors =
              Array.isArray(colorValues) && colorValues.length > 0;

            let index = 0;
            const glitchCycleInterval =
              parseInt(el.dataset.glitchCycleInterval) || 2000;

            if (words.length === 0) return;

            const cycle = () => {
              const color = hasColors
                ? colorValues[index % colorValues.length]
                : null;

              gsap.to(el, {
                scrambleText: {
                  text: words[index],
                  chars: alphaNumberic,
                  duration: 1.25,
                  revealDelay: 0.125,
                },
                color: color,
                duration: 0.5,
                onComplete: () => {
                  index = (index + 1) % words.length;
                  setTimeout(cycle, glitchCycleInterval);
                },
              });
            };

            cycle();
          });
        }

        // Marquee
        {
          gsap.utils.toArray(".marquee").forEach((marqueeBlock) => {
            const marqueeInners =
              marqueeBlock.querySelectorAll(".marquee-inner");
            const velocity = parseFloat(
              marqueeBlock.getAttribute("data-marquee-velocity")
            );
            const speedDefault = parseFloat(
              marqueeBlock.getAttribute("data-marquee-speed")
            );
            const speedMd = parseFloat(
              marqueeBlock.getAttribute("data-marquee-speed-md")
            );
            const speedSm = parseFloat(
              marqueeBlock.getAttribute("data-marquee-speed-sm")
            );
            const scrubEnabled =
              marqueeBlock.hasAttribute("data-marquee-scrub");

            const scrollAlternate = marqueeBlock.hasAttribute(
              "data-marquee-scroll-alternate"
            );

            let marqueeSpeed = maxSm ? speedSm : maxMd ? speedMd : speedDefault;

            if (scrubEnabled) {
              // Scrub disables marquee animation, ties x directly to scroll
              marqueeInners.forEach((inner, index) => {
                gsap.fromTo(
                  inner,
                  { x: index % 2 === 0 ? "0%" : `-${velocity}%` },
                  {
                    x: index % 2 === 0 ? `-${velocity}%` : "0%",
                    scrollTrigger: {
                      trigger: marqueeBlock,
                      start: "top bottom",
                      end: "bottom top",
                      scrub: 1,
                      invalidateOnRefresh: true,
                    },
                  }
                );
              });
            } else {
              const marqueeTweens = [];

              marqueeInners.forEach((inner, index) => {
                // Always baseline animation
                const tween = gsap
                  .to(inner, {
                    xPercent: -50,
                    repeat: -1,
                    duration: marqueeSpeed,
                    ease: "linear",
                  })
                  .totalProgress(0.5)
                  .timeScale(index % 2 === 0 ? 1 : -1);

                marqueeTweens.push(tween);

                // If velocity is set > 0, overlay velocity scrub
                if (velocity > 0) {
                  gsap.fromTo(
                    inner,
                    { x: index % 2 === 0 ? "0%" : `-${velocity}%` },
                    {
                      x: index % 2 === 0 ? `-${velocity}%` : "0%",
                      scrollTrigger: {
                        trigger: marqueeBlock,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1,
                        invalidateOnRefresh: true,
                      },
                    }
                  );
                }
              });

              // Scroll direction swap
              if (scrollAlternate) {
                let currentScroll = window.scrollY;

                const adjustTimeScale = () => {
                  const isScrollingDown = window.scrollY > currentScroll;

                  marqueeTweens.forEach((tween, index) =>
                    gsap.to(tween, {
                      timeScale: (index % 2 === 0) === isScrollingDown ? 1 : -1,
                      duration: 0.3,
                      ease: "power2.out",
                    })
                  );

                  // Toggle class based on scroll direction
                  marqueeBlock.classList.toggle(
                    "marquee--alternated",
                    !isScrollingDown
                  );

                  currentScroll = window.scrollY;
                };

                window.addEventListener("scroll", adjustTimeScale, {
                  passive: true,
                });
              }
            }
          });
        }

        // Parallax
        {
          const parallaxConfigs = [
            { selector: ".parallax", y: "15%", scrub: 1 },
            { selector: ".parallax--strong", y: "25%", scrub: 1 },
            { selector: ".parallax--reverse", y: "-25%", scrub: 0.25 },
          ];

          parallaxConfigs.forEach(({ selector, y, scrub }) => {
            document.querySelectorAll(selector).forEach((el) => {
              gsap.to(el, {
                y,
                ease: "none",
                scrollTrigger: {
                  trigger: el,
                  start: "top bottom",
                  end: "bottom top",
                  scrub,
                },
              });
            });
          });
        }

        // Video Scrub
        {
          const video = document.querySelector(".video-scrub");

          if (video) {
            video.addEventListener("loadedmetadata", () => {
              ScrollTrigger.create({
                trigger: ".video-scrub-section",
                start: "top top",
                end: "bottom top",
                scrub: true,
                pin: true,
                onUpdate: (self) => {
                  const progress = self.progress;
                  video.currentTime = video.duration * progress;
                },
              });
            });
          }
        }
      }
    }
  );

  // Refresh ScrollTrigger after a brief page load. This allows images to use lazy loading and content to generate from 11ty
  window.addEventListener("load", () => {
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500); // try 200–500ms if needed
  });

  // Greater than 520 so it doesn't refresh on  mobile(dvh)
  if (window.innerWidth > 520) {
    window.addEventListener("resize", () => {
      ScrollTrigger.refresh();
    });
  }

  // Any page specific scrollTrigger fix (Optional)
  // if (document.querySelector(".main-library")) {
  //   window.addEventListener("load", () => {
  //     setTimeout(() => {
  //       ScrollTrigger.refresh();
  //     }, 500); // try 200–500ms if needed
  //   });
  // }
}
