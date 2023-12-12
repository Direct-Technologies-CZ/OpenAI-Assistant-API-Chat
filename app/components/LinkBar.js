import { VercelIcon, GithubIcon } from "@/app/icons";

const LinkBar = () => (


  <div className="items-center hidden w-full justify-between sm:flex border-b border-gray-200 bg-green-600">
    <a
      href="/deploy"
      target="_blank"
      className="rounded-lg p-2 transition-colors duration-200 hover:bg-stone-100 sm:bottom-auto"
    >
      <VercelIcon />
    </a>
    <a href="/storedAssistants">
      <button className="px-4 py-2 bg-cyan-600 text-white font-bold rounded border border-cyan-700 hover:bg-cyan-700 focus:outline-none focus:border-cyan-900 focus:ring ring-cyan-300 transition ease-in duration-200 text-center text-base shadow-md">
        Stored assistants
      </button>
    </a>
    <a href="/">
      <button className="px-4 py-2 bg-cyan-600 text-white font-bold rounded border border-cyan-700 hover:bg-cyan-700 focus:outline-none focus:border-cyan-900 focus:ring ring-cyan-300 transition ease-in duration-200 text-center text-base shadow-md">
        Create new assistant
      </button>
    </a>
    <a
      href="/github"
      target="_blank"
      className="rounded-lg p-2 transition-colors duration-200 hover:bg-stone-100 sm:bottom-auto"
    >
      <GithubIcon />
    </a>
  </div>
);

export default LinkBar;
