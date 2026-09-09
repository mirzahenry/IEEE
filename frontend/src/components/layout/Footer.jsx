import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Linkedin, Facebook, Youtube } from 'lucide-react';
import useSettings from '../../hooks/useSettings';

const Footer = () => {
  const { settings: s } = useSettings();

  const quickLinks = [
    { path: '/',             label: 'Home' },
    { path: '/about',        label: 'About Us' },
    { path: '/excom',        label: 'Executive Committee' },
    { path: '/events',       label: 'Events' },
    { path: '/announcements',label: 'Announcements' },
  ];

  const exploreLinks = [
    { path: '/achievements', label: 'Achievements' },
    { path: '/projects',     label: 'Projects' },
    { path: '/gallery',      label: 'Gallery' },
    { path: '/resources',    label: 'Resources' },
    { path: '/contact',      label: 'Contact' },
  ];

  const socials = [
    { icon: Instagram, url: s.instagram_url, label: 'Instagram', hover: 'hover:bg-pink-600'  },
    { icon: Linkedin,  url: s.linkedin_url,  label: 'LinkedIn',  hover: 'hover:bg-blue-600'  },
    { icon: Facebook,  url: s.facebook_url,  label: 'Facebook',  hover: 'hover:bg-blue-800'  },
    { icon: Youtube,   url: s.youtube_url,   label: 'YouTube',   hover: 'hover:bg-red-600'   },
  ].filter(social => social.url);

  return (
    <footer className="bg-gray-950 text-gray-400">
      {/* Main grid */}
      <div className="container-custom py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-5 group">
              <div className="w-11 h-11 bg-gradient-to-br from-primary-600 to-earth-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <span className="text-white font-black text-base">GR</span>
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-none">GRSS</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Geosciences &amp; Remote Sensing</p>
              </div>
            </Link>

            <p className="text-sm leading-relaxed mb-5 text-gray-500">
              {s.about_text
                ? s.about_text.slice(0, 130) + (s.about_text.length > 130 ? '…' : '')
                : 'Exploring Earth. Advancing Technology. Inspiring the Next Generation of Geospatial Innovators.'}
            </p>

            {socials.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {socials.map(({ icon: Icon, url, label, hover }) => (
                  <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                    title={label} aria-label={label}
                    className={`w-9 h-9 rounded-lg bg-gray-800 ${hover} flex items-center justify-center transition-colors group`}>
                    <Icon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map(link => (
                <li key={link.path}>
                  <Link to={link.path}
                    className="text-sm hover:text-primary-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-gray-700 group-hover:bg-primary-400 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Explore</h3>
            <ul className="space-y-2.5">
              {exploreLinks.map(link => (
                <li key={link.path}>
                  <Link to={link.path}
                    className="text-sm hover:text-primary-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-gray-700 group-hover:bg-primary-400 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact Us</h3>
            <ul className="space-y-3">
              {s.email && (
                <li className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                  <a href={`mailto:${s.email}`} className="text-sm hover:text-primary-400 transition-colors break-all">
                    {s.email}
                  </a>
                </li>
              )}
              {s.phone && (
                <li className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                  <a href={`tel:${s.phone}`} className="text-sm hover:text-primary-400 transition-colors">
                    {s.phone}
                  </a>
                </li>
              )}
              {s.address && (
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{s.address}</span>
                </li>
              )}
              {s.university_name && (
                <li className="text-sm text-gray-600 pl-7">{s.university_name}</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()}{' '}
            <span className="text-gray-500">{s.society_name || 'Geosciences & Remote Sensing Society'}</span>.
            All Rights Reserved.
          </p>
          <div className="flex items-center gap-5 text-xs">
            <Link to="/contact" className="hover:text-primary-400 transition-colors">Contact</Link>
            <Link to="/search"  className="hover:text-primary-400 transition-colors">Search</Link>
            <Link to="/admin/login" className="hover:text-primary-400 transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
