import * as gitea from "../gitea.ts";

export type LabelProps = {
  label: gitea.Label;
};

const default_background = "#999";

export default function Label({ label }: LabelProps) {
  const background = label.color ?? default_background;
  const isDark = isDarkColor(background);
  const cssClass = isDark ? "dark" : "light";

  return (
    <div
      className={`label ${cssClass}`}
      style={{ backgroundColor: `#${background}` }}
    >
      {label.name}
    </div>
  );
}

function isDarkColor(color: string) {
  const [r, g, b] = getRGB(color);

  // https://en.wikipedia.org/wiki/Relative_luminance
  const relativeLuminance =
    (r * 0.2126729 + g * 0.7151522 + b * 0.072175) / 255;

  return relativeLuminance < 0.453;
}

function getRGB(color: string): number[] {
  const match = color.match(/[0-9a-f]{2}/gi);
  if (!match) return [0, 0, 0];
  return match.map((hex) => parseInt(hex, 16));
}
