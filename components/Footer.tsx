function Footer({ className }) {
  return (
    <footer className={`flex bg-main-bg   p-4 justify-between ${className}`}>
      <span className="text-sm text-main-text sm:text-center ">
        © 2024{" "}
        <a
          href="https://twitter.com/openbookdex"
          className="hover:text-[#ab82ae]"
        >
          Openbook Team
        </a>
        . All Rights Reserved.
      </span>
      <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-main-text text-gray-400 sm:mt-0">
        <li>
          <a
            href="https://twitter.com/openbookdex"
            className="mr-4 hover:text-hover-two md:mr-6"
          >
            Twitter
          </a>
        </li>
        <li>
          <a
            href="https://github.com/openbook-dex"
            className="mr-4 hover:text-hover-two md:mr-6"
          >
            GitHub
          </a>
        </li>
        <li>
          <a
            href="gofuckyourselfifyouwanttocontactus@weloveyou.shit"
            className="hover:text-hover-two"
          >
            Contact
          </a>
        </li>
      </ul>
    </footer>
  );
}

export default Footer;
