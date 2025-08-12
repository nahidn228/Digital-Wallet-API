import Wallet from "./wallet.model";

const getUserWalletFromDB = async (userId: string) => {
  const wallet = await Wallet.findOne({ userId });
  return wallet;
};


export const WalletService = {
  getUserWalletFromDB,
};
