import React from "react";

export default function ModalBill(props) {

  return (
    <div>
      <div
        id="staticModal"
        data-modal-backdrop="static"
        tabIndex="-1"
        aria-hidden="true"
        className={`fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full flex justify-center ${
          props.show ? "" : "hidden"
        }`}
      >
         <div className="absolute w-full max-w-3xl md:max-w-xl lg:max-w-3xl max-h-full top-[100px] left-1/2 -translate-x-1/2">
 
          <div className="relative bg-white rounded-lg shadow-xl border-t-4">
            
       
            <div className="p-4 border-b rounded-t flex items-center justify-between bg-gray-50">
          
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                onClick={props.onHide}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </button>
            </div>
         
       
           
            <div className="p-8 text-center">
                <div className="mb-4 text-gray-600">
                    <p className="text-lg font-medium">
                    This item has a deposit exceeding 50% of the total amount.
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-center p-4 border-t border-gray-200 rounded-b">
              <button
                type="button"
                className="text-white bg-red-500 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                onClick={props.onHide}
              >
                ok
              </button>
            </div>
          </div>
        </div>
      </div>

   
      {props.show && (
        <div className="bg-gray-900 bg-opacity-50 fixed inset-0 z-40"></div>
      )}
    </div>
  );
}