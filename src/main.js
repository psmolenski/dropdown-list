require.config({
  paths : {
    'jquery' : '../lib/jquery-1.9.1'
  }
});

require(["jquery", "dropdownList"], function ($) {
  $(function () {
    $('select').dropdownList();
  });
});
