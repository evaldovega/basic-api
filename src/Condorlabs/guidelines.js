const OFFSET_MIN = 0;
const OFFSET_DEFAULT = 0;
const LIMIT_MIN = 1;
const LIMIT_DEFAULT = 25;

const queryStringToFilters = (query) => {
  let filters = {};
  let query_string = [];

  Object.keys(query).forEach((key) => {
    const field = query[key];
    if (
      field &&
      field != "" &&
      key != "limit" &&
      key != "offset" &&
      key != "size" &&
      key != "sort" &&
      key != "fields"
    ) {
      query_string.push(`&${key}=${field}`);
      if ((exp = field.match(/\*(.+)\*/))) {
        console.log("Que contenga ", exp[1]);
        filters[key] = { $regex: new RegExp(exp[1], "i") };
      } else if ((exp = field.match(/\*(.+)/))) {
        console.log("Inicia con " + exp[1]);
        filters[key] = { $regex: new RegExp("^" + exp[1], "i") };
      } else if ((exp = field.match(/(.+)\*/))) {
        console.log("Termina con " + exp[1]);
        filters[key] = { $regex: new RegExp(exp[1] + "$", "i") };
      } else {
        filters[key] = field;
      }
    }
  });

  return { filters, query_string };
};

const generateSorts = (sort) => {
  let _sort = sort.split(",");
  let _sortResult = {};
  _sort.forEach((s) => {
    if (s.startsWith("-")) {
      _sortResult[[s.slice(1)]] = -1;
    } else {
      _sortResult[[s]] = 1;
    }
  });
  console.log(_sortResult);
  return _sortResult;
};

const generatePagination = (
  ENDPOINT,
  query_string,
  offset,
  limit,
  sort,
  fields,
  size
) => {
  const response = {};

  offset = offset < OFFSET_MIN ? OFFSET_MIN : offset;
  limit = limit < LIMIT_MIN ? LIMIT_DEFAULT : limit;

  response.limit = limit;
  response.offset = offset;

  const pages = Math.ceil(size / limit);

  response.pages = pages;

  response.current_page = offset / limit + 1;

  response.size = size;

  if (response.current_page < response.pages) {
    response.next = `${ENDPOINT}?offset=${
      response.current_page * limit
    }&limit=${limit}&size=${size}${query_string}&sort=${sort}&fields=${fields}`;
  }

  if (response.current_page > 1) {
    response.previus = `${ENDPOINT}?offset=${
      (response.current_page - 2) * limit
    }&limit=${limit}&size=${size}${query_string}&sort=${sort}&fields=${fields}`;
  }

  response.last = `${ENDPOINT}?offset=${
    (response.pages - 1) * limit
  }&limit=${limit}&size=${size}${query_string}&sort=${sort}&fields=${fields}`;

  response.first = `${ENDPOINT}?offset=0&limit=${limit}&sort=${sort}&fields=${fields}`;

  return response;
};

module.exports = {
  OFFSET_MIN,
  OFFSET_DEFAULT,
  LIMIT_MIN,
  LIMIT_DEFAULT,
  queryStringToFilters,
  generatePagination,
  generateSorts,
};
