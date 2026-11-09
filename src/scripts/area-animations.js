const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const tabLists = [...document.querySelectorAll(".side-nav, .mobile-nav")];
const tabPanels = [...document.querySelectorAll(".tab-panel")];

const updateIndicators = () => {
  tabLists.forEach((tabList) => {
    const active = tabList.querySelector('[aria-selected="true"]');
    if (!active || !tabList.getClientRects().length) return;

    const listBounds = tabList.getBoundingClientRect();
    const activeBounds = active.getBoundingClientRect();
    tabList.style.setProperty("--active-x", `${activeBounds.left - listBounds.left}px`);
    tabList.style.setProperty("--active-y", `${activeBounds.top - listBounds.top}px`);
    tabList.style.setProperty("--active-width", `${activeBounds.width}px`);
    tabList.style.setProperty("--active-height", `${activeBounds.height}px`);
    tabList.classList.add("has-motion-indicator");
  });
};

let indicatorFrame = 0;
const scheduleIndicatorUpdate = () => {
  if (indicatorFrame) return;
  indicatorFrame = requestAnimationFrame(() => {
    indicatorFrame = 0;
    updateIndicators();
  });
};

const tabObserver = new MutationObserver((changes) => {
  if (changes.some((change) => change.attributeName === "aria-selected")) {
    scheduleIndicatorUpdate();
  }

  if (!reducedMotion && changes.some((change) => change.attributeName === "hidden" && !change.target.hidden)) {
    requestAnimationFrame(() => {
      const panel = tabPanels.find((candidate) => !candidate.hidden);
      if (!panel || panel.getAnimations().some((animation) => animation.playState === "running")) return;
      panel.classList.remove("is-motion-entering");
      void panel.offsetWidth;
      panel.classList.add("is-motion-entering");
    });
  }
});

tabLists.forEach((tabList) => {
  tabObserver.observe(tabList, { subtree: true, attributes: true, attributeFilter: ["aria-selected"] });
});
tabPanels.forEach((panel) => tabObserver.observe(panel, { attributes: true, attributeFilter: ["hidden"] }));

window.addEventListener("resize", scheduleIndicatorUpdate, { passive: true });
document.fonts?.ready.then(scheduleIndicatorUpdate);
scheduleIndicatorUpdate();
