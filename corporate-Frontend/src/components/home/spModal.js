export default function SplaseModal(props) {
  const closeModal = () => {
    props.onHide();
  };

  return (
    <div
      className={`fixed left-0 top-0 z-[9999] h-full w-full`}
      hidden={!props.show}
      onClick={closeModal}>
      <div className="h-full w-full bg-black opacity-60"></div>

      <div className="absolute left-1/2 top-1/2 w-full max-w-[540px] -translate-x-1/2 -translate-y-1/2 border-[10px] border-white md:max-w-[1024px]">
        <div className="hidden md:block">
          <img
            className="w-full"
            src={require("./simg/banner-Queen-1024.jpg")}
            alt="queen-banner"
          />
        </div>
        <div className="md:hidden">
          <img
            className="w-full"
            src={require("./simg/banner-Queen-540.jpg")}
            alt="queen-banner"
          />
        </div>
      </div>
    </div>
  );
}
