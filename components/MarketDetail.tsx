import { nameToString } from "@openbook-dex/openbook-v2";

export default function MarketDetail({ market }) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 p-6  border-l border-gray-800 w-1/5 overflow-x-auto text-sm text-[#a49ac2] bg-[#30273c]">
        <div className="flex flex-col items-start break-words whitespace-normal border-b-2 border-gray-800">
          <p className="mb-3 text-xl text-title-text font-bold">
            {market.asks ? nameToString(market.name) : ""}
          </p>
        </div>

        <div className="flex flex-col items-start break-words">
          <p className="font-bold text-sm mb-1">Base Mint</p>
          <p className="mb-3 text-xs break-words word-wrap overflow-wrap">
            {market.asks ? market.baseMint.toString() : ""}
          </p>
        </div>

        <div className="flex flex-col items-start break-words">
          <p className="font-bold text-sm mb-1">Quote Mint</p>
          <p className="mb-3 text-xs break-words word-wrap overflow-wrap">
            {market.asks ? market.quoteMint.toString() : ""}
          </p>
        </div>

        <div className="flex flex-col items-start break-words">
          <p className="font-bold text-sm mb-1">Bids</p>
          <p className="mb-3 text-xs break-words word-wrap overflow-wrap">
            {market.asks ? market.bids.toString() : ""}
          </p>
        </div>

        <div className="flex flex-col items-start break-words">
          <p className="font-bold text-sm mb-1">Asks</p>
          <p className="mb-3 text-xs break-words word-wrap overflow-wrap">
            {market.asks ? market.asks.toString() : ""}
          </p>
        </div>

        <div className="flex flex-col items-start break-words">
          <p className="font-bold text-sm mb-1">Event Heap</p>
          <p className="mb-3 text-xs break-words word-wrap overflow-wrap">
            {market.asks ? market.eventHeap.toString() : ""}
          </p>
        </div>

        <div className="flex flex-col items-start break-words">
          <p className="font-bold text-sm mb-1">Base Deposits</p>
          <p className="mb-3 text-xs break-words word-wrap overflow-wrap">
            {market.asks ? market.baseDepositTotal.toString() : ""}
          </p>
        </div>

        <div className="flex flex-col items-start break-words">
          <p className="font-bold text-sm mb-1">Quote Deposits</p>
          <p className="mb-3 text-xs break-words word-wrap overflow-wrap">
            {market.asks ? market.quoteDepositTotal.toString() : ""}
          </p>
        </div>

        <div className="flex flex-col items-start break-words">
          <p className="font-bold text-sm mb-1">Taker Fees</p>
          <p className="mb-3 text-xs break-words word-wrap overflow-wrap">
            {market.asks ? market.takerFee.toString() : ""}
          </p>
        </div>

        <div className="flex flex-col items-start break-words">
          <p className="font-bold text-sm mb-1">Maker Fees</p>
          <p className="mb-3 text-xs break-words word-wrap overflow-wrap">
            {market.asks ? market.makerFee.toString() : ""}
          </p>
        </div>

        <div className="flex flex-col items-start break-words">
          <p className="font-bold text-sm mb-1">Base Lot Size</p>
          <p className="mb-3 text-xs break-words word-wrap overflow-wrap">
            {market.asks ? market.baseLotSize.toString() : ""}
          </p>
        </div>

        <div className="flex flex-col items-start break-words">
          <p className="font-bold text-sm mb-1">Quote Lot Size</p>
          <p className="mb-3 text-xs break-words word-wrap overflow-wrap">
            {market.asks ? market.quoteLotSize.toString() : ""}
          </p>
        </div>

        <div className="flex flex-col items-start break-words">
          <p className="font-bold text-sm mb-1">Base Decimals</p>
          <p className="mb-3 text-xs break-words word-wrap overflow-wrap">
            {market.asks ? market.baseDecimals : ""}
          </p>
        </div>

        <div className="flex flex-col items-start break-words">
          <p className="font-bold text-sm mb-1">Quote Decimals</p>
          <p className="mb-3 text-xs break-words word-wrap overflow-wrap">
            {market.asks ? market.quoteDecimals : ""}
          </p>
        </div>
      </div>

      {/* <button
        className="items-center text-center bg-blue-500 hover:bg-blue-700 text-white font-bold !text-sm py-2 px-4 rounded"
        onClick={(e: any) => crankMarket()}
      >
        CRANK
      </button> */}
    </>
  );
}
