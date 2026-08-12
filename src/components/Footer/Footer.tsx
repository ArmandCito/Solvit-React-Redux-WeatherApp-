import type { FooterProps } from "./Footer.ts";
import "./Footer.css";

function Footer({ year = new Date().getFullYear() }: FooterProps) {
  return (
    <footer className="footer">
      <p>© {year} SolvitCast Weather, Class of React Native G4. Powered by OpenWeatherMap.</p>
    </footer>
  );
}

export default Footer;
