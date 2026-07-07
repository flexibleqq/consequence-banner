# Consequence Banner

A small FoundryVTT module that plays a sound and shows a customizable,
fading corner banner — the kind of "this decision will have
consequences" notification you see in Life is Strange and other
narrative/choice-driven games.

## Usage

### From a Macro (recommended)

Create a new **Script** macro in Foundry and paste:

```js
game.modules.get("consequence-banner").api.show(
  "This decision will have consequences.",
  {
    sound: "modules/consequence-banner/sounds/consequence.ogg",
    duration: 4000,
    position: "bottom-right"
  }
);
```

This only shows the banner on the client that runs the macro.

### Broadcasting to every player (GM only)

To trigger the banner on every connected client at once (e.g. right
after a party makes a big choice):

```js
game.modules.get("consequence-banner").api.broadcast(
  "This decision will have consequences."
);
```

Only a GM account can call `.broadcast()` — if a player tries, they'll
get a warning notification instead, and nothing will fire.

### Full option list

```js
game.modules.get("consequence-banner").api.show(text, {
  sound:       "path/to/sound.ogg", // omit or "" for no sound
  volume:      0.8,                 // 0.0 - 1.0
  duration:    4000,                // ms the banner stays visible
  position:    "bottom-right",      // "bottom-right" | "bottom-left" | "top-right" | "top-left"
  bgColor:     "linear-gradient(135deg, rgba(20,20,30,0.9), rgba(50,20,60,0.9))",
  textColor:   "#f0f0f0",
  accentColor: "#a83279",
  fontSize:    "1.4rem"
});
```

Any option you omit falls back to the module's configured world
setting (or a sensible built-in default).

## Notes

- The banner element is `pointer-events: none`, so it never blocks
  clicks on the canvas or UI underneath it.
- Sounds are played locally per-client to avoid double-playback —
  when you `.broadcast()`, each client plays the sound and shows the
  banner itself upon receiving the socket message.
