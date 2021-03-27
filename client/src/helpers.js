export const paramStr = (obj) => {
  return Object.keys(obj)
    .map((field) => {
      return field + "=" + encodeURIComponent(obj[field]);
    })
    .join("&");
};
