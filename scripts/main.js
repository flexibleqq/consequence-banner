const MODULE_ID = "consequence-banner";

function registerSettings() {
  game.settings.register(MODULE_ID, "defaultText", {
    name: "Default Banner Text",
    hint: "Text shown when no custom text is supplied to the banner.",
    scope: "world",
    config: true,
    type: String,
    default: "This decision will have consequences."
  });

  game.settings.register(MODULE_ID, "defaultSound", {
    name: "Default Sound",
    hint: "Sound played whenever the banner is triggered without a custom sound. Leave blank for no sound.",
    scope: "world",
    config: true,
    type: String,
    default: "",
    filePicker: "audio"
  });

  game.settings.register(MODULE_ID, "defaultDuration", {
    name: "Default Duration (ms)",
    hint: "How long the banner stays visible before fading out, in milliseconds.",
    scope: "world",
    config: true,
    type: Number,
    default: 4000
  });

  game.settings.register(MODULE_ID, "defaultPosition", {
    name: "Default Screen Corner",
    scope: "world",
    config: true,
    type: String,
    choices: {
      "bottom-right": "Bottom Right",
      "bottom-left": "Bottom Left",
      "top-right": "Top Right",
      "top-left": "Top Left"
    },
    default: "bottom-right"
  });

  game.settings.register(MODULE_ID, "defaultVolume", {
    name: "Default Volume",
    scope: "world",
    config: true,
    type: Number,
    range: { min: 0, max: 1, step: 0.05 },
    default: 0.8
  });
}

/**
 * client
 * @param {string} [text]
 * @param {object} [options]
 */
function showConsequenceBanner(text, options = {}) {
  const {
    sound = game.settings.get(MODULE_ID, "defaultSound"),
    volume = game.settings.get(MODULE_ID, "defaultVolume"),
    duration = game.settings.get(MODULE_ID, "defaultDuration"),
    position = game.settings.get(MODULE_ID, "defaultPosition"),
    bgColor,
    textColor,
    accentColor,
    fontSize
  } = options;

  const displayText = text?.trim()?.length
    ? text
    : game.settings.get(MODULE_ID, "defaultText");

  if (sound) {
    foundry.audio.AudioHelper.play({ src: sound, volume, autoplay: true, loop: false }, false);
  }

  const banner = document.createElement("div");
  banner.classList.add("consequence-banner", `cb-position-${position}`);
  banner.innerText = displayText;

  if (bgColor) banner.style.setProperty("--cb-bg-color", bgColor);
  if (textColor) banner.style.setProperty("--cb-text-color", textColor);
  if (accentColor) banner.style.setProperty("--cb-accent-color", accentColor);
  if (fontSize) banner.style.setProperty("--cb-font-size", fontSize);

  document.body.appendChild(banner);

  requestAnimationFrame(() => banner.classList.add("cb-show"));

  setTimeout(() => {
    banner.classList.remove("cb-show");
    banner.classList.add("cb-hide");
    banner.addEventListener("transitionend", () => banner.remove(), { once: true });
  }, duration);
}

/**
 * GM only
 * @param {string} [text]
 * @param {object} [options]
 */

function broadcastConsequenceBanner(text, options = {}) {
  if (!game.user.isGM) {
    ui.notifications.warn("Only the GM can broadcast a Consequence Banner to all players.");
    return;
  }
  game.socket.emit(`module.${MODULE_ID}`, { text, options });
  showConsequenceBanner(text, options);
}

Hooks.once("init", () => {
  registerSettings();
});

Hooks.once("ready", () => {
  game.socket.on(`module.${MODULE_ID}`, (data) => {
    showConsequenceBanner(data.text, data.options);
  });

  const mod = game.modules.get(MODULE_ID);
  mod.api = {
    show: showConsequenceBanner,
    broadcast: broadcastConsequenceBanner
  };

  console.log(`${MODULE_ID} | Ready. Use game.modules.get("${MODULE_ID}").api.show(text, options) or .broadcast(...)`);
});
