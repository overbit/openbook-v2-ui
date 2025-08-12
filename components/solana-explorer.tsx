import { openSolanaExplorer, openSolscan, shortenAddress } from "@/lib/utils";
import { Telescope, Radar } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface SolanaExplorerProps {
  address: string;
}

export function SolanaExplorer({ address }: SolanaExplorerProps) {
  return (
    <div className="text-blue-400 ">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className=" cursor-pointer hover:text-blue-300"
              onClick={() => openSolanaExplorer(address)}
              title="View on Solana Explorer"
            >
              {shortenAddress(address)}
              <Telescope className="h-4 w-4  mx-1 text-purple-400 inline-block mr-1" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Open in Solana Explorer</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="cursor-pointer hover:text-blue-300"
              onClick={() => openSolscan(address)}
              title="View on Solscan"
            >
              <Radar className="h-4 w-4 mx-1 text-cyan-400 inline-block mr-1" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Open in Solscan</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
