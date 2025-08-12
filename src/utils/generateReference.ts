export const generateTransactionReference = (): string => {
  const prefix = "TXN";
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(100000 + Math.random() * 900000)
    .toString()
    .slice(-6);
  return `${prefix}-${timestamp}-${random}`;
};
