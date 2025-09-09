import { useState, useEffect, useContext } from "react";
import { BoothContext } from "./createBooth";

export default function CreateBox() {
  const { boothC, listVersion } = useContext(BoothContext);
  const [booth, setBooth] = boothC;
  // Simpler: sanitize on input to allow only letters (unicode)
  const handleRowInput = (e) => {
    const lettersOnly = (e.target.value.match(/\p{L}/gu) || []).join("");
    if (e.target.value !== lettersOnly) {
      e.target.value = lettersOnly;
    }
    return lettersOnly.toUpperCase();
  };

  const handleNumberInput = (e) => {
    const digitsOnly = e.target.value.replace(/\D+/g, "");
    if (e.target.value !== digitsOnly) {
      e.target.value = digitsOnly;
    }
    return digitsOnly;
  };

  return (
    <section className="create-box" key={listVersion}>
      <div className="border rounded-lg relative">
        <div className="absolute z-10 -top-[15px] left-4">
          <h3 className="bg-white px-3 py-1">Create Booth</h3>
        </div>
        <div className="w-full grid grid-cols-2 lg:grid-cols-[1fr_220px_2fr] pt-6 px-4 pb-4 gap-2 md:gap-4">
          <div className="flex items-center gap-2 max-lg:col-span-2">
            <input
              type="radio"
              name="boothType"
              value="set"
              id="createset"
              className="accent-red-500"
              onChange={(e) => setBooth({ ...booth, action: "set" })}
            />
            <label htmlFor="createset">Create Set</label>
          </div>
          <div className="flex items-center gap-2 justify-end">
            <label htmlFor="rowset">Row</label>
            <input
              name="rowset"
              type="text"
              className="w-24 disabled:bg-gray-200"
              onInput={(e) => setBooth({ ...booth, row: handleRowInput(e) })}
              disabled={booth.action !== "set"}
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="rowsetto">to</label>
            <input
              name="rowsetto"
              type="text"
              className="w-24 disabled:bg-gray-200"
              onInput={(e) => setBooth({ ...booth, rowto: handleRowInput(e) })}
              disabled={booth.action !== "set"}
            />
          </div>
          <div className="flex items-center gap-2 col-start-1 lg:col-start-2 justify-end">
            <label htmlFor="numset">Number</label>
            <input
              name="numset"
              type="text"
              className="w-24 disabled:bg-gray-200"
              inputMode="numeric"
              onChange={(e) =>
                setBooth({ ...booth, num: handleNumberInput(e) })
              }
              disabled={booth.action !== "set"}
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="numsetto">to</label>
            <input
              name="numsetto"
              type="text"
              className="w-24 disabled:bg-gray-200"
              onChange={(e) =>
                setBooth({ ...booth, numto: handleNumberInput(e) })
              }
              disabled={booth.action !== "set"}
            />
          </div>

          <div className="flex items-center gap-2 max-lg:col-span-2">
            <input
              type="radio"
              name="boothType"
              value="set"
              id="createrow"
              className="accent-red-500"
              onChange={(e) => setBooth({ ...booth, action: "row" })}
            />
            <label htmlFor="createset">Create Row</label>
          </div>
          <div className="flex items-center gap-2 justify-end">
            <label htmlFor="rowrow">Row</label>
            <input
              name="rowrow"
              type="text"
              className="w-24 disabled:bg-gray-200"
              onInput={(e) => setBooth({ ...booth, row: handleRowInput(e) })}
              disabled={booth.action !== "row"}
            />
          </div>
          <div className="flex items-center gap-2 col-start-1 lg:col-start-2 justify-end">
            <label htmlFor="numrow">Number</label>
            <input
              name="numrow"
              type="text"
              className="w-24 disabled:bg-gray-200"
              onChange={(e) =>
                setBooth({ ...booth, num: handleNumberInput(e) })
              }
              disabled={booth.action !== "row"}
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="numrowto">to</label>
            <input
              name="numrowto"
              type="text"
              className="w-24 disabled:bg-gray-200"
              onChange={(e) =>
                setBooth({ ...booth, numto: handleNumberInput(e) })
              }
              disabled={booth.action !== "row"}
            />
          </div>

          <div className="flex items-center gap-2 max-lg:col-span-2">
            <input
              type="radio"
              name="boothType"
              value="set"
              id="createsing"
              className="accent-red-500"
              onChange={(e) => setBooth({ ...booth, action: "booth" })}
            />
            <label htmlFor="createsing">Create Single Booth</label>
          </div>
          <div className="flex items-center gap-2 justify-end">
            <label htmlFor="cbooth">Booth Number</label>
            <input
              name="cbooth"
              type="text"
              className="w-24 disabled:bg-gray-200"
              onChange={(e) =>
                setBooth({ ...booth, row: e.target.value.toUpperCase() })
              }
              disabled={booth.action !== "booth"}
            />
          </div>

          <div className="flex items-center gap-2 max-lg:col-span-2 col-start-1">
            <input
              type="radio"
              name="boothType"
              value="set"
              id="delbooth"
              className="accent-red-500"
              onChange={(e) => setBooth({ ...booth, action: "del" })}
            />
            <label htmlFor="delbooth">Delete Single Booth</label>
          </div>
          <div className="flex items-center gap-2 justify-end">
            <label htmlFor="delb">Booth Number</label>
            <input
              name="delb"
              type="text"
              className="w-24 disabled:bg-gray-200"
              onChange={(e) =>
                setBooth({ ...booth, row: e.target.value.toUpperCase() })
              }
              disabled={booth.action !== "del"}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
