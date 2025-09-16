// src/components/solution/finance/collectionReport/checkboxPrint.js
import React from "react";

function Filter() {
  return (
    <section id="checkbox-print">
      <div className="border border-zinc-300 rounded-md relative mt-6">
        <div className="absolute bg-white px-2 py-1 -top-4 left-3 text-red-600">
          Filter
        </div>
        <div className="flex flex-col px-3 py-4 space-y-3">
          {/* By Sales */}
          <div className="flex items-center gap-3">
            <label
              htmlFor="bySales"
              className="flex items-center font-medium gap-2 w-36">
              <input
                type="checkbox"
                id="bySales"
                className="size-4 accent-red-500"
              />
              By Sales :
            </label>
            <input
              id="salesInput"
              className="border rounded-md p-1.5 w-full md:w-100"
              placeholder="ระบุสถานที่จัดงาน"
            />
          </div>

          {/* By Zone */}
          <div className="flex items-center gap-3">
            <label
              htmlFor="byZone"
              className="flex items-center font-medium gap-2 w-36">
              <input
                type="checkbox"
                id="byZone"
                className="size-4 accent-red-500"
              />
              By Zone :
            </label>
            <select
              className="border rounded-md p-1.5 w-full md:w-100"
              id="cmbExhibition"
              defaultValue="0">
              <option value="0" disabled hidden>
                select exhibition
              </option>
              <option value="1">Exhibition 1</option>
              <option value="2">Exhibition 2</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* By Shop */}
          <div className="flex items-center gap-3">
            <label
              htmlFor="byShop"
              className="flex items-center font-medium gap-2 w-36">
              <input
                type="checkbox"
                id="byShop"
                className="size-4 accent-red-500"
              />
              By Customer :
            </label>
            <input
              id="shopInput"
              type="text"
              className="border rounded-md p-1.5 w-full md:w-100"
              placeholder="ระบุชื่อร้านค้า"
            />
          </div>

          {/* By Debt */}
          <div className="flex items-center gap-3">
            <label
              htmlFor="byDebt"
              className="flex items-center font-medium gap-2 w-36">
              <input
                type="checkbox"
                id="byPayment"
                className="size-4 accent-red-500"
              />
              By Payment Status :
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="debtStatus"
                  value="no"
                  className="accent-red-500 size-4"
                />
                <span>No Balance Remaining</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="debtStatus"
                  value="hasDebt"
                  className="accent-red-500 size-4"
                />
                <span>Balance Remaining</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Filter;
