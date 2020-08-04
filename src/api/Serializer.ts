export const apiString2json = (message: string): {[key: string]: string} => {
  const json: {[key: string]: string} = {};
  const keys = message.split(',');
  keys.forEach(entry => {
    const kv = entry.split('=');
    json[kv[0]] = kv[1];
  });
  return json;
};

export const json2apiString = (json: {[key: string]: string}) => {
  return Object.keys(json)
    .map(key => `${key}=${json[key]}`)
    .join('&');
};

export const string2bool = (value: string) => {
  return value === 'true' || value === '0' || value !== undefined;
};
