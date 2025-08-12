import React from "react";
import { Card } from "@/components/ui/card";
import { Market, nameToString } from "@openbook-dex/openbook-v2";
import { SolanaExplorer } from "./solana-explorer";

interface MarketDetailsProps {
  market?: Market | null;
  isLoading: boolean;
}

const MarketDetails = ({ market, isLoading }: MarketDetailsProps) => {
  if (isLoading) {
    return (
      <Card className="bg-gray-900 border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="animate-pulse">Loading market stats...</div>
        </div>
      </Card>
    );
  }

  if (!market) {
    return <></>;
  }

  return (
    <Card className="bg-gray-900 border-gray-800 p-4">
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div>
          <div className="text-sm text-gray-400">Name</div>
          <div className="text-white">{nameToString(market.account.name)}</div>
        </div>

        <div>
          <div className="text-sm text-gray-400">Minimum Order Size</div>
          <div className="text-white">{Number(market.minOrderSize)}</div>
        </div>
        <div>
          <div className="text-sm text-gray-400">Price Tick</div>
          <div className="text-white">{Number(market.tickSize)}</div>
        </div>
        <div>
          <div className="text-sm text-gray-400">BaseMint</div>
          <SolanaExplorer address={market.account.baseMint.toBase58()!} />
        </div>
        <div>
          <div className="text-sm text-gray-400">QuoteMint</div>
          <SolanaExplorer address={market.account.quoteMint.toBase58()!} />
        </div>
        <div>
          <div className="text-sm text-gray-400">MarketAddress</div>
          <SolanaExplorer address={market.pubkey.toBase58()!} />
        </div>
      </div>
    </Card>
  );
};

export default MarketDetails;
