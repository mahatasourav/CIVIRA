import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-[#0B7EC8] to-[#0A63A5] text-white py-14">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
        {/* LEFT : Logo + Info */}
        <div className="flex flex-col gap-4 items-center md:items-start">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center">
              {/* Location + Camera SVG */}
              <svg viewBox="0 0 64 64" className="w-12 h-12 drop-shadow-sm">
                {/* Location Pin */}
                <path
                  d="M32 2C21.5 2 13 10.4 13 20.8c0 14.2 19 41.2 19 41.2s19-27 19-41.2C51 10.4 42.5 2 32 2z"
                  fill="#FFFFFF"
                />

                {/* Location Center */}
                <circle cx="32" cy="21" r="6" fill="#0A63A5" />

                {/* Camera Body */}
                <rect
                  x="34"
                  y="18"
                  width="22"
                  height="14"
                  rx="3"
                  fill="#BFE6FF"
                />

                {/* Camera Lens */}
                <circle cx="45" cy="25" r="4" fill="#0A63A5" />
              </svg>
            </div>

            <h2 className="text-3xl font-semibold tracking-wide">CIVIRA</h2>
          </div>

          {/* <p className="text-sm text-blue-100">Municipality Details</p> */}

          <p className="text-xs text-blue-200">
            © {new Date().getFullYear()} Civira
          </p>
        </div>

        {/* CENTER : Links */}
        <div className="flex flex-wrap justify-center gap-6 text-base text-white font-medium">
          <a href="#" className="hover:underline">
            About
          </a>
          <a href="#" className="hover:underline">
            Contact
          </a>
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline">
            Terms & Conditions
          </a>
        </div>

        {/* RIGHT : Social Icons */}
        <div className="flex gap-6 text-xl">
          <a href="#" className="hover:scale-110 transition">
            <FaFacebookF />
          </a>
          <a href="#" className="hover:scale-110 transition">
            <FaTwitter />
          </a>
          <a href="#" className="hover:scale-110 transition">
            <FaLinkedinIn />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
