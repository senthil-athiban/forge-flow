"use client";
import React from "react";
import Link from "next/link";
import { Zap } from "@/types/zap";

const ZapTable = ({ zaps }: { zaps: Array<Zap> }) => {
  return (
    <div className="flex justify-center w-full pt-10">
      <div className="relative overflow-x-auto max-w-screen-lg w-full">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
            <tr>
              <th scope="col" className="px-6 py-3">
                S.no
              </th>
              <th scope="col" className="px-6 py-3">
                Triggers
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
              <th scope="col" className="px-6 py-3">
                Running
              </th>
            </tr>
          </thead>

          <tbody className="bg-white border-b w-full">
            {zaps.map((zap, index) => {
              return (
                <tr key={zap.id} className="border-b">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                  >
                    {zap.trigger.triggerType.name}
                  </td>
                  <td className="px-6 py-4">
                    {zap.actions.map(
                      (action, index) => action.actionType.name + ", "
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <Link
                      className="hover:bg-gray-300 p-2"
                      href={`/zap/${zap.id}`}
                    >
                      {" > "}
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};


export default ZapTable;
