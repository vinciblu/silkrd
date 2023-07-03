import React from "react";
import { useSelector } from "react-redux";
import { IUserInfoRootState } from "../../../lib/types/user";
import UserAccountBtn from "./UserAccountBtn";
import LoginBtn from "./LoginBtn";
import Wallet from "../../wallet/Wallet";

const User = () => {
  const userInfo = useSelector(
    (state: IUserInfoRootState) => state.userInfo.userInformation
  );
  return <div>{userInfo ? <UserAccountBtn /> : <Wallet chainName={"silk"} />}</div>;
};

export default User;
