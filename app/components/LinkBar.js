import { VercelIcon, GithubIcon } from "@/app/icons";

const LinkBar = () => (
  <div className="items-center hidden w-full justify-between sm:flex">
    <a
      href="/deploy"
      target="_blank"
      className="rounded-lg p-2 transition-colors duration-200 hover:bg-stone-100 sm:bottom-auto"
    >
      <VercelIcon />
    </a>
    <a href="/storedAssistants">Stored assistants</a>
    <a href="/">Create new assistant</a>
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
