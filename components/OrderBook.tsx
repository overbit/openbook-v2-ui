import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/react";
import { Order, priceLotsToUi } from "@openbook-dex/openbook-v2";
import { PublicKey } from "@solana/web3.js";

const columnsBook = [
  {
    key: "owner",
    label: "OWNER",
  },
  {
    key: "quantity",
    label: "SIZE",
  },
  {
    key: "key",
    label: "PRICE",
  },
];

interface OrderBookProps {
  asks: Order[];
  bids: Order[];
  market: any;
}

export default function OrderBook({ asks, bids, market }: OrderBookProps) {
  return (
    <div className="h-full h-[26.5vh]">
      <div>
        <h3 className="text-center mt-8 mb-5 text-2xl text-title-text font-bold ">
        ASKS -------- OrderBook -------- BIDS
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-2 border-t border-gray-800 overflow-y-scroll h-full	">
        <div>
          <Table
            isStriped
            selectionMode="single"
            aria-label="ASKS -------- OrderBook -------- BIDS"
            className="border-r border-gray-800  min-h-[100%]"
          >
            <TableHeader className="text-left" columns={columnsBook}>
              {(column) => (
                <TableColumn
                  key={column.key}
                  className="text-[#d5cfd5] font-bold"
                >
                  {column.label}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={asks}>
              {(item) => (
                <TableRow key={item.price}>
                                  {(columnKey) => (
                                    <TableCell>
                                      {columnKey == "owner"
                                        ? item.leafNode.owner
                                            .toString()
                                            .substring(0, 4) +
                                          ".." +
                                          item.leafNode.owner.toString().slice(-4)
                                        : columnKey == "quantity"
                                        ? item.size.toString()
                                        : item.price}
                                    </TableCell>
                                  )}
                                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div>
          <Table isStriped selectionMode="single" aria-label="OrderBook">
            <TableHeader columns={columnsBook}>
              {(column) => (
                <TableColumn
                  key={column.key}
                  className="text-[#d5cfd5] font-bold"
                >
                  {column.label}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={bids}>
              {(item) => (
               <TableRow key={item.price}>
                                 {(columnKey) => (
                                   <TableCell>
                                     {columnKey == "owner"
                                       ? item.leafNode.owner
                                           .toString()
                                           .substring(0, 4) +
                                         ".." +
                                         item.leafNode.owner.toString().slice(-4)
                                       : columnKey == "quantity"
                                       ? item.size.toString()
                                       : item.price}
                                   </TableCell>
                                 )}
                               </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
