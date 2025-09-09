import React, { useEffect, useState } from "react";
import useHeader from "../../../hook/useHeader";
import Axios from "axios";

export default function ModalAddProduct(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_Coupon_api;
  const bearer = useHeader();

  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const [product, setProduct] = useState({ productName: "" });

  const addProduct = async () => {
    if (product.productName != "") {
      const res = await Axios.post(url + "/PostProduct", product).then(
        (res) => {
          if (res.status != 200) {
            alert("Error! - Add product failed");
          }
        }
      );
      setProduct({ productName: "" });
    }
    props.onHide();
  };

  return (
    <div>
      <div
        id="staticModal"
        data-modal-backdrop="static"
        tabIndex="-1"
        aria-hidden="true"
        className={`fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full ${
          props.show ? "" : "hidden"
        }`}
      >
        <div className="relative w-full max-w-3xl max-h-full top-[100px] left-1/2 -translate-x-1/2">
          {/*-- Modal content --*/}
          <div className="relative bg-white rounded-lg shadow">
            {/*-- Modal header --*/}
            <div className="p-4 border-b rounded-t">
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Add New Product
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                  data-modal-hide="staticModal"
                  onClick={props.onHide}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>

            {/*-- Modal body --*/}
            <div className="p-6 space-y-6">
              <div>
                <label for="productname">Product Name: </label>
                <input
                  id="productname"
                  onChange={(e) =>
                    setProduct({ ...product, productName: e.target.value })
                  }
                  className="w-3/4"
                  value={product.productName}
                />
              </div>
            </div>
            {/*-- Modal footer --*/}
            <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b">
              <button
                data-modal-hide="staticModal"
                type="button"
                className="text-white bg-red-500 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                onClick={addProduct}
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      </div>
      {props.show && (
        <div
          modal-backdrop=""
          class="bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40"
        ></div>
      )}
    </div>
  );
}
