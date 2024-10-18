import moment from 'moment';

export const removePaginateQuery = (query?: Record<string, any>) => {
  if (!query) return;
  const q = { ...query };
  if (q.page) delete q.page;
  if (q.limit) delete q.limit;
  return q;
};

type MapMetaObject = (query?: {
  page?: number;
  limit?: number;
  totalData?: number;
}) => {
  page: number;
  pageCount: number;
  limit: number;
  total: number;
};
export const mapMetaObject: MapMetaObject = (query) => {
  const limit = query?.limit;
  const meta = {
    page: Number(query?.page) || 1,
    pageCount: limit ? Math.ceil(query?.totalData / limit) : 1,
    limit: limit ? Number(limit) : query?.totalData,
    total: query?.totalData,
  };
  return meta;
};

// random string generator
export const randomString = (length: number) => {
  const chars =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};

// get title and summary from text
export const getRequestMessage = (text: string) => {
  const content = text.split('\n');
  let title = content[0];
  let summary = content[1];
  // remove Title: and Summary: from text
  title = title.replace('Title: ', '');
  summary = summary.replace('Summary: ', '');

  return {
    title,
    summary,
  };
};

/**
  - Define a case-insensitive regular expression for common image file extensions
  - Test the URL against the regular expression
*/
export function isImageExtension(url: string) {
  const imageExtensions = /\.(jpeg|jpg|gif|png|bmp|webp|tiff|svg)$/i;
  return imageExtensions.test(url);
}

export function defaultDateFormat(date: Date): string {
  const newDate = moment(date).format('MM/DD/YYYY').toString();
  return newDate;
}

/**
 - Capitalize the first letter of a string
 - Remove leading and trailing spaces
 - Remove multiple spaces 
 */

export function ucFirstCleanSpaces(str: string) {
  if (!str) return str;

  let newStr = str.replace(/\s+/g, ' '); // remove multiple spaces
  newStr = newStr.trim(); // remove leading and trailing spaces
  newStr = newStr.charAt(0).toUpperCase() + newStr.slice(1); //
  return newStr;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getClientIp(req: any) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  //wait until the server is deployed to get the real IP
  // const ip = null;
  return ip;
}
