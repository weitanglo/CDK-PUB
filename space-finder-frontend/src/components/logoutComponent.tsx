import { useState } from "react";
import { AuthService } from "../services/AutnService"
import { Navigate } from "react-router-dom";

type LoginProps = {
  authService: AuthService;
  setUserNameCb: (userName: string | undefined) => void;
};

export default function LogoutComponent({ authService, setUserNameCb }: LoginProps) {

  const [logoutSuccess, setLogoutSuccess] = useState<boolean>(false);

  async function logout () {
        await authService.toSignOut();
        setLogoutSuccess(true);
        // set userName to undefined then the view of Navbar loginlogout become login not userName
        const userName = authService.getUserName();
        setUserNameCb(userName)
  }

  return (
    <div className="logoutComponent">
      <button onClick={() => logout ()}>logout</button>
      {logoutSuccess && <Navigate to="/login" replace={true} />}
    </div>
  );
}