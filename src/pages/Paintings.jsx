import Gallery from './Gallery'
import { paintings } from '../data/artworks'

export default function Paintings({ navigateTo }) {
  return <Gallery works={paintings} type="peintures" navigateTo={navigateTo} />
}
