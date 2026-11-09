import React, { useEffect, useRef } from "react";
import { MdClose } from "react-icons/md";
import EditCustomer from "../../datawarehouse/editCus";

export default function InvoiceAddressModal({ customerId, close }) {
  const dialog = useRef(null);
  useEffect(() => {
    const element = dialog.current;
    element.showModal();
    return () => element.close();
  }, []);

  return (
    <dialog ref={dialog} aria-labelledby="invoice-address-title"
      onCancel={event => { event.preventDefault(); close(); }}
      className="m-auto w-[calc(100%-2rem)] max-w-6xl max-h-[85vh] overflow-y-auto rounded-lg bg-white p-0 shadow-lg backdrop:bg-black/50">
      <header className="flex items-center justify-between border-b p-4">
        <h2 id="invoice-address-title" className="m-0 text-xl font-semibold">Edit Customer Address</h2>
        <button type="button" aria-label="Close customer address" onClick={close}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-200 hover:text-gray-900">
          <MdClose size={24} aria-hidden="true" />
        </button>
      </header>
      <div className="p-4">
        <p className="text-gray-500">Changes update the customer's main address data. Use Set Tax to choose the tax address.</p>
        <EditCustomer cid={customerId} edit />
      </div>
      <footer className="flex justify-end border-t p-4">
        <button type="button" className="btn-primary px-4 py-1" onClick={close}>Done</button>
      </footer>
    </dialog>
  );
}
