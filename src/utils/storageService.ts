type StorageKeys =
  | "user"
  | "cart"
  | "accessToken"
  | "refreshToken"
  | "couponId"
  | "orderId"
  | "sessionId";

const getItem = (key: StorageKeys, defaultValue: any[] | object | string) => {
  const result = localStorage.getItem(key);
  if (result) {
    return JSON.parse(result);
  } else {
    return defaultValue;
  }
};

const setItem = (key: StorageKeys, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};
const removeItem = (key: StorageKeys) => {
  localStorage.removeItem(key);
};

export { getItem, setItem, removeItem };
