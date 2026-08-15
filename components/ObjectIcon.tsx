type ObjectIconProps = {
  name: string;
  file: string;
  live?: boolean;
};

export function ObjectIcon({ name, file, live = false }: ObjectIconProps) {
  return (
    <div className={`object-icon${live ? " is-live" : ""}`}>
      <img src={`/objects/${file}.png`} alt="" width={144} height={144} />
      {live ? (
        <span className="viewfinder" aria-hidden="true">
          <i className="tl" />
          <i className="tr" />
          <i className="bl" />
          <i className="br" />
        </span>
      ) : null}
      <span className="visually-hidden">{name}</span>
    </div>
  );
}
