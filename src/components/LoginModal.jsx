export const LoginModal = ({ isOpen, onClose, onCreateAccount, onLogin }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-transparent" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-[343px] mx-4 rounded-2xl bg-brown-100 p-4 pt-4 pr-6 pb-10 pl-6 shadow-lg lg:w-[621px] lg:p-6 lg:pt-4 lg:pr-6 lg:pb-10 lg:pl-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-lg font-bold text-black transition-colors hover:text-gray-600"
        >
          ✕
        </button>

        {/* Content */}
        <div className="space-y-6 text-center">
          <h2 className="pt-6 font-poppins text-2xl font-semibold leading-8 text-brown-600 lg:text-3xl lg:leading-[48px]">
            Create an account to
            <br />
            continue
          </h2>

          <button
            onClick={onCreateAccount}
            className="h-12 w-[207px] rounded-full bg-brown-600 px-10 py-3 font-poppins text-base font-medium leading-6 text-white transition-colors hover:bg-brown-700"
          >
            Create account
          </button>

          <p className="font-poppins text-base font-medium leading-6 text-brown-400">
            Already have an account?{" "}
            <button
              onClick={onLogin}
              className="font-poppins text-base font-medium leading-6 underline transition-colors hover:text-brown-600"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
