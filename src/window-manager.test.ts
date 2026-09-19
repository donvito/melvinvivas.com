import assert from "node:assert/strict";
import { test } from "node:test";
import { fitWindow, isAppId, windowReducer } from "./window-manager.ts";
import type { AppWindow, DesktopState } from "./window-manager.ts";

const viewport = { width: 1440, height: 900 };
const empty: DesktopState = { windows: [], active: null };
const open = (state: DesktopState, id: "welcome" | "projects" | "about") =>
  windowReducer(state, { type: "open", id, viewport });

test("opening an existing minimized app restores it without losing geometry or duplicating it", () => {
  let state = open(empty, "welcome");
  state = windowReducer(state, {
    type: "move",
    id: "welcome",
    x: 230,
    y: 95,
    viewport,
  });
  state = windowReducer(state, { type: "minimize", id: "welcome" });
  state = open(state, "projects");
  state = open(state, "welcome");
  assert.equal(state.windows.length, 2);
  assert.equal(state.active, "welcome");
  assert.equal(state.windows[1].minimized, false);
  assert.equal(state.windows[1].x, 230);
  assert.equal(state.windows[1].y, 95);
});

test("closing and minimizing focus the highest visible window, never a hidden one", () => {
  let state = open(open(open(empty, "welcome"), "projects"), "about");
  state = windowReducer(state, { type: "minimize", id: "projects" });
  assert.equal(state.active, "about");
  state = windowReducer(state, { type: "close", id: "about" });
  assert.equal(state.active, "welcome");
  state = windowReducer(state, { type: "minimize", id: "welcome" });
  assert.equal(state.active, null);
  assert.equal(state.windows.length, 2);
});

test("taskbar toggles active apps and raises inactive apps", () => {
  let state = open(open(empty, "welcome"), "projects");
  state = windowReducer(state, { type: "taskbar", id: "welcome" });
  assert.equal(state.active, "welcome");
  assert.equal(state.windows[1].id, "welcome");
  state = windowReducer(state, { type: "taskbar", id: "welcome" });
  assert.equal(state.active, "projects");
  assert.equal(state.windows[1].minimized, true);
  state = windowReducer(state, { type: "taskbar", id: "welcome" });
  assert.equal(state.active, "welcome");
  assert.equal(state.windows[1].minimized, false);
});

test("maximizing and restoring preserves the original geometry", () => {
  const original = open(empty, "welcome");
  const maximized = windowReducer(original, {
    type: "maximize",
    id: "welcome",
  });
  assert.equal(maximized.windows[0].maximized, true);
  const restored = windowReducer(maximized, {
    type: "maximize",
    id: "welcome",
  });
  assert.deepEqual(restored, original);
});

test("desktop button minimizes all apps and opening one does not restore the others", () => {
  const state = windowReducer(open(open(empty, "welcome"), "projects"), {
    type: "show-desktop",
  });
  assert.equal(state.active, null);
  assert.ok(state.windows.every((win) => win.minimized));
  const restored = open(state, "projects");
  assert.equal(restored.active, "projects");
  assert.equal(restored.windows[0].minimized, true);
});

test("all supported viewport sizes keep window borders and controls on screen", () => {
  const win: AppWindow = {
    id: "welcome",
    width: 840,
    height: 670,
    x: 600,
    y: 800,
    maximized: false,
    minimized: false,
  };
  for (const width of [320, 375, 768, 1024, 1440]) {
    for (const height of [320, 600, 768, 900]) {
      const fitted = fitWindow(win, { width, height });
      assert.ok(fitted.x >= 6 && fitted.y >= 6);
      assert.ok(fitted.x + fitted.width <= width - 6);
      assert.ok(fitted.y + fitted.height <= height - 48);
    }
  }
});

test("resizing and moving clamp oversized and negative pointer positions", () => {
  let state = open(empty, "welcome");
  state = windowReducer(state, {
    type: "resize",
    id: "welcome",
    width: 10000,
    height: 10000,
    viewport,
  });
  assert.ok(state.windows[0].x + state.windows[0].width <= viewport.width - 6);
  assert.ok(
    state.windows[0].y + state.windows[0].height <= viewport.height - 48,
  );
  state = windowReducer(state, {
    type: "move",
    id: "welcome",
    x: -900,
    y: -900,
    viewport,
  });
  assert.equal(state.windows[0].x, 6);
  assert.equal(state.windows[0].y, 6);
  state = windowReducer(state, {
    type: "viewport",
    viewport: { width: 375, height: 667 },
  });
  assert.ok(state.windows[0].width <= 363);
  assert.ok(state.windows[0].height <= 613);
});

test("only known apps can be launched from URL fragments", () => {
  assert.equal(isAppId("projects"), true);
  assert.equal(isAppId("constructor"), false);
  assert.equal(isAppId(""), false);
  assert.equal(isAppId("<script>"), false);
});
