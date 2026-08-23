/** True while EssayView is mounted. HomeStage must not handle Escape then. */
let essaySurface = false;

export function setEssaySurface(open: boolean) {
  essaySurface = open;
}

export function essaySurfaceOpen() {
  return essaySurface;
}
