/**
 * The HUD lives in ordinary HTML around the game canvas. This class is the
 * only code that touches those elements; scenes call its methods and never
 * query the DOM themselves. Structure lives in index.html, looks in style.css.
 */
export type HudMode = "title" | "play" | "attract" | "cutscene";

export class Hud {
  private readonly cabinet = find<HTMLElement>("#cabinet");
  private readonly score = find<HTMLOutputElement>("#score");
  private readonly best = find<HTMLOutputElement>("#best");
  private readonly lives = [
    ...document.querySelectorAll<HTMLElement>("#lives .pip"),
  ];
  private readonly power = [
    ...document.querySelectorAll<HTMLElement>("#power .cell"),
  ];
  private readonly route = find<HTMLOListElement>("#route");
  private readonly boss = find<HTMLElement>("#boss");
  private readonly bossFill = find<HTMLElement>("#boss-fill");
  private readonly banner = find<HTMLElement>("#banner");
  private readonly caption = find<HTMLElement>("#caption");
  private stops: HTMLElement[] = [];
  private shownScore = -1;
  private bestScore = 0;

  /** Builds one route stop per sector from the template in index.html. */
  setRoute(names: readonly string[]): void {
    const template = find<HTMLTemplateElement>("#stop-template");
    this.route.replaceChildren();
    this.stops = names.map((name) => {
      const stop = template.content.firstElementChild!.cloneNode(
        true,
      ) as HTMLElement;
      stop.querySelector(".stop-name")!.textContent = name;
      this.route.append(stop);
      return stop;
    });
  }

  setMode(mode: HudMode): void {
    this.cabinet.dataset.mode = mode;
  }

  setScore(score: number): void {
    if (score === this.shownScore) return;
    this.shownScore = score;
    this.score.value = pad(score);
    if (score > this.bestScore) {
      this.bestScore = score;
      this.best.value = pad(score);
    }
  }

  setLives(lives: number): void {
    this.lives.forEach((pip, i) => pip.classList.toggle("lit", i < lives));
  }

  setPower(level: number): void {
    this.power.forEach((cell, i) => cell.classList.toggle("lit", i < level));
  }

  /** Marks earlier stops cleared and highlights the current one (-1: none). */
  setSector(current: number): void {
    this.stops.forEach((stop, i) => {
      stop.dataset.state = i < current
        ? "cleared"
        : i === current
        ? "current"
        : "ahead";
    });
  }

  /** Shows the boss meter at a 0–1 fraction, or hides it with null. */
  setBoss(fraction: number | null): void {
    this.boss.hidden = fraction === null;
    if (fraction !== null) {
      this.bossFill.style.setProperty("--fill", String(Math.max(0, fraction)));
    }
  }

  announce(title: string, subtitle = ""): void {
    this.banner.querySelector("strong")!.textContent = title;
    this.banner.querySelector("span")!.textContent = subtitle;
    restartAnimation(this.banner, "show");
  }

  /** Shakes the panels; heavy impacts use the stronger animation. */
  shudder(heavy = false): void {
    restartAnimation(this.cabinet, heavy ? "quake" : "shudder");
  }

  say(text: string): void {
    this.caption.textContent = text;
    this.caption.classList.toggle("visible", text !== "");
  }
}

function find<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`index.html is missing ${selector}`);
  return element;
}

function pad(score: number): string {
  return String(score).padStart(7, "0");
}

/** Removing a class and forcing layout lets the same CSS animation replay. */
function restartAnimation(element: HTMLElement, className: string): void {
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
}
