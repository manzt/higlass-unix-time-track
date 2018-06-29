import register from 'higlass-register';

import UnixTimeTrack from './UnixTimeTrack';

register({
  name: 'UnixTimeTrack',
  track: UnixTimeTrack,
  config: UnixTimeTrack.config,
});
