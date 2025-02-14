import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/react";
import { LinkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

type Column = {
  key: string;
  label: string;
};

type Market = {
  market: string;
  baseMint: string;
  quoteMint: string;
  name: string;
};

interface MarketTableProps {
  columns: Column[];
  fetchMarket: (key: string) => Promise<void>;
  markets: Market[];
}

export default function MarketTable({
  columns,
  fetchMarket,
  markets,
}: MarketTableProps) {
  const linkedPk = (pk: string) => (
    <div>
      {pk.length > 15 ? `${pk.substring(0, 10)}...` : pk}
      <a
        href={`https://solscan.io/account/${pk}`}
        target="_blank"
        className="pl-2"
      >
        <LinkIcon className="w-4 h-4 inline" />
      </a>
    </div>
  );
  const [selectedKey, setSelectedKey] = useState("");

  const handleRowClick = (key: any) => {
    setSelectedKey(key.toString());
    fetchMarket(key.toString());
  };

  return (
    <Table
      isStriped
      selectionMode="single"
      aria-label="Markets"
      // onRowAction={async (key) => fetchMarket(key.toString())}
      defaultSelectedKeys={markets[0].market}
      className=" w-full table-fixed rounded-sm "
    >
      <TableHeader columns={columns} className="rounded-sm">
        {(column) => (
          <TableColumn
            key={column.key}
            className=" p-2 text-[#ebe8f5] bg-[#2f2838] font-bold"
          >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={markets}>
        {(item) => (
          <TableRow
            key={item.market}
            className={`cursor-pointer striped-row hover:text-[#9b83eb]  ${
              selectedKey === item.market ? "!text-red-500" : ""
            }`}
            onClick={() => handleRowClick(item.market)}
          >
            {(columnKey) => (
              <TableCell className="overflow-hidden text-ellipsis ">
                {columnKey == "name"
                  ? getKeyValue(item, columnKey)
                  : linkedPk(getKeyValue(item, columnKey))}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
