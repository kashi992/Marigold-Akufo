import Gallery from './Gallery'
import { drawings } from '../data/artworks'

export default function Drawings({ navigateTo }) {
  return <Gallery works={drawings} type="sculptures" navigateTo={navigateTo} />
}
