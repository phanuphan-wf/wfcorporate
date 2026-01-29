
export default function FillModal({ show, message, onClose, lang}) {
  if (!show) return null;  

  return (
    <div>
      <div
        id="staticModal"
        tabIndex="-1"
        aria-hidden={!show}
        className={`fixed top-0 left-0 right-0 z-50 w-full p-4
        overflow-x-hidden overflow-y-auto md:inset-0
        h-[calc(100%-1rem)] max-h-full`}
      >
        <div className="relative w-full max-w-3xl max-h-full left-1/2 -translate-x-1/2">
          {/* Modal content */}
          <div className="relative bg-white rounded-lg shadow">
            {/* Header */}
            <div className="flex items-start justify-between p-4 border-b rounded-t">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-900">
                 {lang === "th" ? "ข้อมูลการสมัครงาน" : "Job application information"} 
              </h3>

              <button
                type="button"
                className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5"
                onClick={onClose}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              <p className="text-gray-900 dark:text-gray-900 font-medium">
                {message}
              </p>
            </div>

            

            {/* Footer */}
            <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b">
              <button
                type="button"
                className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5"
                onClick={onClose}
              >
               {lang === "th" ? "ตกลง" : "OK"} 
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40"></div>
    </div>
  );
}
