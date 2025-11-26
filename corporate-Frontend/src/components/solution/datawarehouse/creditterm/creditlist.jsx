import { createContext, useState } from "react";

export const dataContext = createContext();

export default function CreditList() {
  const [search, setSearch] = useState("");
  return (
    <dataContext.Provider value={{ searchC: [search, setSearch] }}>
      <section className="creditlist">
        <h2 className="text-xl font-medium">Credit List</h2>
        <div className="flex flex-col lg:flex-row lgitems-center gap-4 my-8">
          <label htmlFor="customer">Customer Name</label>
          <input id="customer" className="w-full lg:w-[400px]" />
          <button className="btn-primary px-2">search</button>
        </div>
      </section>
    </dataContext.Provider>
  );
}
