import { ComponentProps } from 'react';
import "./songRow.styles.css";
import { Track } from '../../shared/types';

type Props = ComponentProps<'div'> & {
  track: Track;
  isCurrent?: boolean;
}

function SongRow(props: Props) {
  const { track, isCurrent, ...rest } = props;
  return (
    <article className={`songRow ${isCurrent ? "songRow_active" : ""}`} role="button" tabIndex={0} {...rest}>
      <img
        className="songRow_album"
        src={track.album.images[0]?.url}
        alt={track.name}
      />
      <div className="songRow_info">
        <h1>{track.name}</h1>
        <p>
          {track.artists.map(({name}) => name).join(", ")}{', '}
          <em>{track.album.name}</em>
        </p>
      </div>
    </article>
  );
}

export default SongRow;
