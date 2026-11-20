import { Link } from 'react-router-dom';
import { useSmoothScroll } from './SmoothScrollProvider';
export default function Footer() { const { scrollTo } = useSmoothScroll(); return <footer className="footer container"><Link className="brand" to="/">ae<span>®</span></Link><p>© {new Date().getFullYear()} Amanuel Eyob</p><p>Built with intent. Made to move.</p><button onClick={() => scrollTo(0)}>Back to top ↑</button></footer>; }
