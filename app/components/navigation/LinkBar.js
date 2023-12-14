import { VercelIcon, GithubIcon } from "@/app/icons";

const LinkBar = () => (


  <div className="items-center flex flex-col sm:flex-row w-full justify-between border-b border-gray-200 bg-green-600 pb-4 sm:pb-0">
    <a
      href="https://openai-assistant.ip-k8s.direct.cz/"
      target="_blank"
      className="rounded-lg p-2 transition-colors duration-200 hover:bg-stone-100 sm:bottom-auto"
    >
      <img src="https://www.direct-technologies.cz/static/header/direct-technologies-black.svg" alt="logo"
      style={{width: "100px", marginTop: "10px", marginBottom: "20px"}}/>
    </a>
    <a href="/storedAssistants">
      <button className="px-4 py-1 sm:py-2 bg-cyan-600 text-white font-bold rounded border border-cyan-700 hover:bg-cyan-700 focus:outline-none focus:border-cyan-900 focus:ring ring-cyan-300 transition ease-in duration-200 text-center text-xs sm:text-base shadow-md">
        Stored assistants
      </button>
    </a>
    <a href="/">
      <button className="px-2 py-1 sm:px-4 sm:py-2 bg-cyan-600 text-white font-bold rounded border border-cyan-700 hover:bg-cyan-700 focus:outline-none focus:border-cyan-900 focus:ring ring-cyan-300 transition ease-in duration-200 text-center text-xs sm:text-base shadow-md">
        Create new assistant
      </button>
    </a>
    <a
      href="/github"
      target="_blank"
      className="rounded-lg p-2 transition-colors duration-200 hover:bg-stone-100 sm:bottom-auto hidden sm:flex"
    >
      <GithubIcon />
    </a>
  </div>
);

export default LinkBar;
