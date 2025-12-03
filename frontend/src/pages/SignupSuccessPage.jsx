import { Link } from "react-router-dom";
import { UserNavBar } from "../components/UserNavBar";
import { SuccessIcon } from "../components/icons/SuccessIcon";

export default function SignupSuccessPage() {
  return (
    <div className="min-h-screen bg-brown-100">
      <UserNavBar />

      <main className="flex items-center justify-center bg-brown-100 min-h-[80vh] px-4 py-8">
        {/* Success Card */}
        <div className="w-full max-w-[343px] lg:max-w-[798px]">
          <div className="bg-brown-200 rounded-2xl pt-[40px] px-[24px] pb-[40px] pl-[24px] shadow-lg lg:pt-[60px] lg:px-[120px] lg:pb-[60px] lg:pl-[120px]">
            <div className="flex flex-col items-center gap-10">
              {/* Success Icon */}
              <div className="w-20 h-20">
                <SuccessIcon
                  size={80}
                  className="w-full h-full text-green-500"
                />
              </div>

              {/* Success Message */}
              <h1 className="text-center font-poppins text-2xl font-semibold text-brown-600 leading-8 lg:text-[40px] lg:leading-12">
                Registration success
              </h1>

              {/* Continue Button */}
              <Link
                to="/login"
                className="mx-auto h-12 rounded-full bg-brown-600 px-[40px] py-3 font-poppins text-base font-medium leading-6 text-white transition-colors duration-200 hover:bg-brown-700 flex items-center justify-center"
              >
                Continue
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
