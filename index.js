/**
 * Host half of the landmarks-3d bundle.
 *
 * The whole feature lives in the browser: the client half registers a sidebar
 * pantheon entry plus the matching `main` panel key. Nothing has to run on the
 * host, so this plugin only needs to exist (and be loadable) for the bundle row.
 */
export const name = 'landmarks-3d'

export function apply() {}
