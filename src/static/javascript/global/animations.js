gsap.registerPlugin(ScrollTrigger);

let responsiveGsap = gsap.matchMedia();

responsiveGsap.add(
  {
    maxSm: "(max-width: 480px)",
    maxMd: "(max-width: 768px)",
    maxLg: "(max-width: 1024px)",
    minMd: "(min-width: 769px)",
  },
  (context) => {
    let { maxSm, maxMd, maxLg, minMd } = context.conditions;

    // // TEMPLATE TWEEN - SCRUB
    // gsap.fromTo(
    //   ".slider__inner",
    //   { x: "-2%" },
    //   {
    //     x: maxSm ? "-32%" : maxLg ? "-32%" : "-32%",
    //     scrollTrigger: {
    //       trigger: ".slider",
    //       start: "top bottom",
    //       end: maxSm ? "bottom 75%" : "bottom top",
    //       scrub: 0.8,
    //       // markers: true,
    //     },
    //   }
    // );

    // GLOBAL - Easily toggle an 'animate' class on any element with '.gsap-animate' class
    const globalGenerateAnimate = (() => {
      const targetElements = document.querySelectorAll(".gsap-animate");

      targetElements.forEach((targetElem) => {
        gsap.to(targetElem, {
          scrollTrigger: {
            trigger: targetElem,
            start: "top 98%",
            end: "bottom top",
            onEnter: () => targetElem.classList.add("animate"),
            onLeave: () => targetElem.classList.remove("animate"),
            onEnterBack: () => targetElem.classList.add("animate"),
            onLeaveBack: () => targetElem.classList.remove("animate"),
          },
        });
      });
    })();

    // All marquee animations
    {
      let marqueeSpeed = maxSm ? 20 : maxMd ? 24 : 28;

      // Standard
      {
        const autoMarquees = gsap.utils.toArray(".marquee-inner");

        const marqueeTweens = autoMarquees.map((elem) =>
          gsap
            .to(elem, {
              xPercent: -50,
              repeat: -1,
              duration: marqueeSpeed,
              ease: "linear",
            })
            .totalProgress(0.5)
        );

        let currentScroll = 0;
        const adjustTimeScale = () => {
          const isScrollingDown = window.scrollY > currentScroll;
          marqueeTweens.forEach((tween, index) =>
            gsap.to(tween, {
              timeScale: (index % 2 === 0) === isScrollingDown ? 1 : -1,
            })
          );
          currentScroll = window.scrollY;
        };

        window.addEventListener("scroll", adjustTimeScale);
      }

      // Scrub, use 'marquee_scrub' boolean prop
      {
        const scrubMarquees = gsap.utils.toArray(".marquee--scrub");
        let sensitivity = 5;

        scrubMarquees.forEach((scrubElem) => {
          const marqueeInners = scrubElem.querySelectorAll(".marquee-inner");

          marqueeInners.forEach((inner, index) => {
            gsap.fromTo(
              inner,
              {
                x: index % 2 === 0 ? "0%" : `-${sensitivity}%`,
              },
              {
                x: index % 2 === 0 ? `-${sensitivity}%` : "0%",
                scrollTrigger: {
                  trigger: scrubElem,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1,
                },
              }
            );
          });
        });
      }
    }
  }
);

// Refresh ScrollTrigger instances on page load and resize
window.addEventListener("load", () => {
  ScrollTrigger.refresh();
});

// Greater than 520 so it doesn't refresh on  mobile(dvh)
if (window.innerWidth > 520) {
  window.addEventListener("resize", () => {
    ScrollTrigger.refresh();
  });
}

// Global - Everything Glitchy

responsiveGsap.add(
  {
    maxMd: "(max-width: 768px)",
    maxLg: "(max-width: 1024px)",
    minMd: "(min-width: 769px)",
  },
  (context) => {
    let { maxMd, maxLg, minMd } = context.conditions;

    const glitchCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789?";

    let glitchAnimationLength = 16; // Default: 16

    // Hero Glitch Text Function
    const applyHeroGlitch = ({ element, text, iterations, color }) => {
      let glitchIterations = 0; // Default: 0

      clearInterval(element.glitchInterval);

      if (color) {
        element.style.color = color;
      }

      const revealRate = iterations / text.length;

      element.glitchInterval = setInterval(() => {
        const glitchText = text
          .split("")
          .map((char, index) => {
            if (glitchIterations / revealRate > index) {
              return char;
            }

            return glitchCharacters.charAt(
              Math.floor(Math.random() * glitchCharacters.length)
            );
          })
          .join("");

        element.innerText = glitchText;

        if (glitchIterations >= iterations) {
          clearInterval(element.glitchInterval);
          element.innerText = text;
        }

        glitchIterations++;
      }, glitchAnimationLength);
    };

    // Not on other pages
    const dynamicText = document.querySelector(".dynamic-text");
    if (dynamicText) {
      const words = [
        { word: "Creative", color: "#E48C66" },
        { word: "Responsive", color: "#7EC1D4" },
        { word: "Accessible", color: "#A4D1A2" },
        { word: "Innovative", color: "#FBFAA2" },
        { word: "Engaging", color: "#E1A7B4" },
      ];

      let index = 0;

      const updateText = () => {
        const wordObj = words[index];
        applyHeroGlitch({
          element: dynamicText,
          text: wordObj.word,
          iterations: wordObj.word.length * 4,
          color: wordObj.color,
        });

        index = (index + 1) % words.length;
      };

      updateText();
      setTimeout(() => {
        setInterval(updateText, 2800);
      }, 500); // Delay for loader
    }

    // Reusable Glitch, a11y checked
    const singleGlitch = (element, originalText, duration) => {
      // Skip for a11y - reduced motion
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        element.innerText = originalText;
        return;
      }

      let iterations = 0;
      const glitchInterval = setInterval(() => {
        element.innerText = originalText
          .split("")
          .map((char, index) => {
            if (index < iterations) {
              return originalText[index];
            }
            return glitchCharacters[Math.floor(Math.random() * 32)];
          })
          .join("");

        if (iterations >= originalText.length) {
          clearInterval(glitchInterval);
        }

        iterations += 1 / duration;
      }, glitchAnimationLength);
    };

    // Scroll Glitch
    {
      const glitchTitles = document.querySelectorAll(".scroll-glitch");
      const glitchTitlesTargets = document.querySelectorAll(
        ".scroll-glitch-target"
      );

      glitchTitles.forEach((el, index) => {
        const originalText = el.getAttribute("data-title");
        const target = glitchTitlesTargets[index];

        gsap.to(el, {
          scrollTrigger: {
            trigger: target,
            toggleActions: "play none play none",
            start: "top bottom",
            end: "bottom top",
            onEnter: () => singleGlitch(el, originalText, 8),
            onLeave: () => singleGlitch(el, originalText, 8),
            onEnterBack: () => singleGlitch(el, originalText, 8),
            onLeaveBack: () => singleGlitch(el, originalText, 8),
          },
        });
      });
    }

    // Responsive Scroll Glitch
    {
      const responsiveItems = [
        {
          element: ".responsive-glitch-element__benefits",
          target: ".responsive-glitch-target__benefits",
          targetLg: ".responsive-glitch-target__benefits-lg",
          start: "top 72%",
          end: "bottom 36%",
          startLg: "top bottom",
          endLg: "bottom top",
        },
      ];

      responsiveItems.forEach((item) => {
        const element = document.querySelector(item.element);
        const target = document.querySelector(item.target);
        const targetLg = document.querySelector(item.targetLg);
        const start = item.start;
        const end = item.end;
        const startLg = item.startLg;
        const endLg = item.endLg;

        // Not on other pages
        if (element) {
          const originalText = element.getAttribute("data-title");

          gsap.to(element, {
            scrollTrigger: {
              trigger: maxLg ? targetLg : target,
              toggleActions: "play none play none",
              start: maxLg ? startLg : start,
              end: maxLg ? endLg : end,
              onEnter: () => singleGlitch(element, originalText, 8),
              onLeave: () => singleGlitch(element, originalText, 8),
              onEnterBack: () => singleGlitch(element, originalText, 8),
              onLeaveBack: () => singleGlitch(element, originalText, 8),
            },
          });
        }
      });
    }

    // Loader Glitch
    {
      const loaderText = document.querySelector(".loading-screen__text");
      const originalText = loaderText?.getAttribute("data-title");

      if (loaderText) {
        gsap.to(loaderText, {
          scrollTrigger: {
            trigger: ".loading-screen",
            start: "top 50%",
            end: "bottom 50%",
            onEnter: () => singleGlitch(loaderText, originalText, 1.25),
          },
        });
      }
    }

    // Global utility for glitch hover/focus. Add a data-title
    const glitchLinks = document.querySelectorAll(".glitch-link");

    glitchLinks.forEach((el) => {
      const originalLinkText = el.innerText;

      const handleGlitch = () => singleGlitch(el, originalLinkText, 8);
      const parentLink = el.closest("a");
      const siblingElement = el.closest("button");

      el.addEventListener("mouseenter", handleGlitch);
      el.addEventListener("focus", handleGlitch);

      if (parentLink) {
        parentLink.addEventListener("mouseenter", handleGlitch);
        parentLink.addEventListener("focus", handleGlitch);
      }

      if (siblingElement) {
        siblingElement.addEventListener("mouseenter", handleGlitch);
        siblingElement.addEventListener("focus", handleGlitch);
      }
    });
  }
);
