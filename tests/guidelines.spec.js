const {
  queryStringToFilters,
  generatePagination,
  generateSorts,
} = require("../src/Condorlabs/guidelines");

describe("queryStringToFilters", () => {
  const input = {
    fullname: "Evaldo",
    city: "Barranquilla",
    email: "evega@condorlabs.io",
    limit: 10,
    offset: 0,
  };

  test("Return array", () => {
    const { filters, query_string } = queryStringToFilters(input);
    expect(query_string).toBeInstanceOf(Array);
  });

  test("Return 3 element", () => {
    const { filters, query_string } = queryStringToFilters(input);
    expect(query_string.length).toBe(3);
  });

  test("Convert query string", () => {
    const { filters, query_string } = queryStringToFilters(input);
    expect(query_string.toString()).toBe(
      "&fullname=Evaldo,&city=Barranquilla,&email=evega@condorlabs.io"
    );
  });
});
