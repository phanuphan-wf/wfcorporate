import React from "react";

function PrintOptions() {
  return (
    <section id="print-options">
      <div className="border border-zinc-300 rounded-md relative mt-6 p-4 bg-white">
        {/* Header */}
        <div className="absolute bg-white px-2 py-1 -top-3 left-4 text-red-600 font-semibold">
          Print Options
        </div>

        {/* Checkboxes */}
        <div className="flex flex-wrap gap-6 mt-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="accent-red-500 w-4 h-4" />
            Print all
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="accent-red-500 w-4 h-4" />
            Without Sales
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="accent-red-500 w-4 h-4" />
            Without Zones
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="accent-red-500 w-4 h-4" />
            Summary
          </label>
        </div>
      </div>
    </section>
  );
}

export default PrintOptions;
