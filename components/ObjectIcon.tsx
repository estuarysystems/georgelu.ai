type ObjectIconProps = {
  name: string;
  file: string;
  live?: boolean;
};

export function ObjectIcon({ name, file, live = false }: ObjectIconProps) {
  return (
    <div
      className={`object-icon${live ? " is-live" : ""}`}
      style={{ backgroundImage: `url(/objects/${file}-strip.webp)` }}
      role="img"
      aria-label={name}
    >
      {live ? (
        <span className="viewfinder" aria-hidden="true">
          <i className="tl" />
          <i className="tr" />
          <i className="bl" />
          <i className="br" />
        </span>
      ) : null}
    </div>
  );
}
