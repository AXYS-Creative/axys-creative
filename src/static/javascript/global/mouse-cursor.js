const cursor = document.querySelector(".mouse-cursor"),
  logo = document.querySelector(".logo"),
  menuBtn = document.querySelector(".menu-btn"),
  burger = document.querySelector(".burger"),
  mailForm = document.querySelector(".mail-form"),
  toastCloseBtn = document.querySelector(".toast__close-btn"),
  submitFormBtn = document.querySelector(".submit-btn");

const navLinks = document.querySelectorAll(".nav-link"),
  navFooterLinks = document.querySelectorAll(".nav-footer-link"),
  socialMediaLinks = document.querySelectorAll(".social-media-link"),
  cta1 = document.querySelectorAll(".cta-1"),
  cta2 = document.querySelectorAll(".cta-2"),
  workItems = document.querySelectorAll(".showcase-link"),
  classicLinks = document.querySelectorAll(".classic-link"),
  faqItems = document.querySelectorAll(".faq-item"),
  returnToTop = document.querySelectorAll(".return-to-top");

let followMouse = true;
cursor.style.opacity = 0; // Initially hide when loading the site

document.addEventListener("mousemove", (e) => {
  cursor.style.opacity = 1;

  if (followMouse) {
    cursor.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
  }
});

// Toggle vanish class to mouse cursor
const cursorHoverVanish = (elem) => {
  elem?.addEventListener("mouseenter", () => {
    cursor.classList.add("vanish-mouse-cursor");
  });
  elem?.addEventListener("mouseleave", () => {
    cursor.classList.remove("vanish-mouse-cursor");
  });
};

// Attaching vanish to individual elements
cursorHoverVanish(logo);
cursorHoverVanish(toastCloseBtn);
// Attaching events to NodeList items
[...cta1, ...workItems, ...classicLinks, ...faqItems].forEach(
  cursorHoverVanish
);

// Toggle sibling selector (dot, icon, etc...)
const cursorHoverSibling = (
  elements,
  querySelector,
  activeClass,
  pxOffset,
  eventType = "mousemove"
) => {
  elements.forEach((element) => {
    element.addEventListener(eventType, () => {
      followMouse = false;
      const sibling = element.querySelector(querySelector);
      const siblingRef = sibling.getBoundingClientRect();
      const centerX = siblingRef.left + siblingRef.width / 2 + pxOffset;
      const centerY = siblingRef.top + siblingRef.height / 2 + pxOffset;
      cursor.style.transform = `translate(${
        centerX - cursor.offsetWidth / 2
      }px, ${centerY - cursor.offsetHeight / 2}px)`;
      cursor.classList.add(activeClass);
    });

    element.addEventListener("mouseleave", () => {
      followMouse = true;
      cursor.classList.remove(activeClass);
    });
  });
};

// prettier-ignore
cursorHoverSibling(returnToTop, ".return-to-top-icon", "return-to-top-active", 0, undefined);
cursorHoverSibling(navLinks, ".nav-link-svg", "nav-link-active", 0, undefined);
cursorHoverSibling(navFooterLinks, ".icon", "nav-link-active", 0, undefined);
cursorHoverSibling(cta2, ".dot-wrapper", "cta2-active", 12, "mouseenter");

socialMediaLinks.forEach((link) => {
  link.addEventListener("mousemove", () => {
    const linkRect = link.getBoundingClientRect();
    const centerX = linkRect.left + linkRect.width / 2;
    const centerY = linkRect.top + linkRect.height / 2;
    cursor.style.transform = `translate(${
      centerX - cursor.offsetWidth / 2
    }px, ${centerY - cursor.offsetHeight / 2}px)`;
    cursor.classList.add("social-link-active");
    followMouse = false;
  });

  link.addEventListener("mouseleave", () => {
    cursor.classList.remove("social-link-active");
    followMouse = true;
  });
});

menuBtn.addEventListener("mousemove", () => {
  const burgerRect = burger.getBoundingClientRect();
  const centerX = burgerRect.left + burgerRect.width / 2;
  const centerY = burgerRect.top + burgerRect.height / 2;
  cursor.style.transform = `translate(${centerX - cursor.offsetWidth / 2}px, ${
    centerY - cursor.offsetHeight / 2
  }px)`;
  cursor.classList.add("burger-active");
  followMouse = false;
});

menuBtn.addEventListener("mouseleave", () => {
  cursor.classList.remove("burger-active");
  followMouse = true;
});

if (mailForm) {
  mailForm.addEventListener("mousemove", () => {
    followMouse = false;
    const submitBtnRect = submitFormBtn.getBoundingClientRect();
    const centerX = submitBtnRect.left + submitBtnRect.width / 2;
    const centerY = submitBtnRect.top + submitBtnRect.height / 2.2;
    cursor.style.transform = `translate(${
      centerX - cursor.offsetWidth / 2
    }px, ${centerY - cursor.offsetHeight / 2}px)`;
    cursor.classList.add("mail-form-active");
  });

  mailForm.addEventListener("mouseleave", () => {
    followMouse = true;
    cursor.classList.remove("mail-form-active");
  });

  submitFormBtn.addEventListener("mousemove", () => {
    const submitBtnRect = submitFormBtn.getBoundingClientRect();
    const centerX = submitBtnRect.left + submitBtnRect.width / 2;
    const centerY = submitBtnRect.top + submitBtnRect.height / 2;
    cursor.style.transform = `translate(${
      centerX - cursor.offsetWidth / 2
    }px, ${centerY - cursor.offsetHeight / 2}px)`;
    followMouse = false;
  });

  submitFormBtn.addEventListener("mouseleave", () => {
    followMouse = true;
  });
}

// Statement Section

const statementSection = document.querySelector("#statement-section");

if (statementSection) {
  statementSection.addEventListener(
    "mouseenter",
    () => (cursor.style.zIndex = -1)
  );
  statementSection.addEventListener(
    "mouseleave",
    () => (cursor.style.zIndex = 4)
  );

  const statementElements = [
    { word: ".statement-websites", icon: ".icon-globe" },
    { word: ".statement-a11y", icon: ".icon-person" },
    { word: ".statement-seo", icon: ".icon-magnifying-glass" },
  ];

  const activateMouseIcon = (cursor, icon) => {
    cursor.classList.add("statement-active");
    icon.classList.add("active");
  };

  const deactivateMouseIcon = (cursor, icon) => {
    cursor.classList.remove("statement-active");
    icon.classList.remove("active");
  };

  statementElements.forEach(({ word, icon }) => {
    const statementElement = document.querySelector(word);
    const iconElement = document.querySelector(icon);

    statementElement.addEventListener("mousemove", () =>
      activateMouseIcon(cursor, iconElement)
    );
    statementElement.addEventListener("mouseleave", () =>
      deactivateMouseIcon(cursor, iconElement)
    );
  });
}

// // Hide Mouse cursor on Safari ... glitched the animation
// const isSafari = () => {
//   let ua = navigator.userAgent.toLowerCase();
//   return ua.indexOf("safari") !== -1 && ua.indexOf("chrome") === -1;
// };

// if (isSafari()) {
//   cursor.style.transition = "none";
// }
