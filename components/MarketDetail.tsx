import { nameToString } from "@openbook-dex/openbook-v2";
import { useEffect } from "react";

export default function MarketDetail({ market, bestAsk, bestBid }) {

  
  return (
    <>
<div className="grid grid-cols-1 sm:grid-cols-3 gap-5 p-7 border-l border-gray-800 w-full overflow-x-auto text-sm text-[#a49ac2] bg-[#30273c]">
  <section className="flex flex-col items-start break-words whitespace-normal border-b-2 border-gray-800 col-span-3">
    <h3 className="mb-4 text-xl text-title-text font-bold">{market.asks ? nameToString(market.name) : ""}</h3>
  </section>

  {[
    { label: 'Base Mint', value: market.baseMint },
    { label: 'Quote Mint', value: market.quoteMint },
    { label: 'Bids', value: market.bids },
    { label: 'Asks', value: market.asks },
    { label: 'Event Heap', value: market.eventHeap },
    { label: 'Base Deposits', value: market.baseDepositTotal },
    { label: 'Quote Deposits', value: market.quoteDepositTotal },
    { label: 'Taker Fees', value: market.takerFee },
    { label: 'Maker Fees', value: market.makerFee },
    { label: 'Base Lot Size', value: market.baseLotSize },
    { label: 'Quote Lot Size', value: market.quoteLotSize },
    { label: 'Base Decimals', value: market.baseDecimals },
    { label: 'Quote Decimals', value: market.quoteDecimals },
    { label: 'Best Ask', value: bestAsk?.price },
    { label: 'Best Bid', value: bestBid?.price }
  ].map(({ label, value }, index) => (
    <div key={index} className="flex flex-col items-start break-words">
      <p className="font-bold text-sm mb-1">{label}</p>
      <p className="mb-3 text-xs break-words word-wrap overflow-wrap">
        {value ? value.toString() : ""}
      </p>
    </div>
  ))}
</div>
    </>
  );
}
