module.exports = {

  isValid: function isValid(isFound) {
    let isValue = true;
    if (isFound == '0') {
      console.log("I found");
    }
    if (isFound == null || isFound == "null" || isFound == "" || isFound == undefined || isFound == "undefined") {
      isValue = false;
    }
    return isValue;
  },

  getPageValue: function fetchPageValue(req, limit = 10) {

    let pageNo, pageOffset = 0;
    let isPageNo = this.isValid(req.query.page);
    if (isPageNo != true) {
      pageNo = 1;
    } else {
      pageNo = req.query.page;
    }
    try {
      if (!isNaN(pageNo)) {
        if (pageNo <= 1) {
          pageOffset = 0;
          pageNo = 1;
        } else {
          pageNo = parseInt(pageNo);
          pageOffset = ((pageNo - 1) * limit);
        }
      } else {
        pageNo = 1;
      }
    }
    catch (e) {
      pageNo = 1;
      pageOffset = 0;
    }
    finally {
      let pageData = {
        "pageNo": pageNo, "pageOffset": pageOffset, limit
      }
      return pageData;
    }
  },

  getLimitValue: function fetchLimitValue(req) {
    let limit = req.query.limit;
    let isLimit = this.isValid(limit);
    if (isLimit != true || limit == 0 || isNaN(limit)) {
      limit = 10;
    } else {
      limit = parseInt(limit);
    }
    return limit;
  }

}
