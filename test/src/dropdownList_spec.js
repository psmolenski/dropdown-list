describe("DropdownList initialization", function() {
  var testSelect;
  
  beforeEach(function() {
    testSelect = $('<select />');

    testSelect.append('<option value="1">one</opition>');
    testSelect.append('<option value="2">two</opition>');
    testSelect.append('<option value="3" selected="selected" >three</opition>');
    testSelect.append('<option value="18">eighteen</opition>');

    $('body').append(testSelect);
  });

  afterEach(function() {
    testSelect.next('.dropdown-wrapper').remove();
    testSelect.remove();
  });

  it("adds dropdown-list class to select input", function() {
    expect(testSelect.hasClass('dropdown-list')).toBe(false);
    testSelect.dropdownList();
    expect(testSelect.hasClass('dropdown-list')).toBe(true);
  });

  it('works only with <select> inputs', function(){
    var testList = $('<ul />');
    $('body').append(testList);

    expect(testList.hasClass('dropdown-list')).toBe(false);
    testList.dropdownList();
    expect(testList.hasClass('dropdown-list')).toBe(false);

    testList.remove();
  });

  it("creates HTML structure wrapper", function(){
    expect($('div.dropdown-wrapper').length).toEqual(0);
    testSelect.dropdownList();
    expect($('div.dropdown-wrapper').length).toEqual(1);
  });

  it("creates HTML option list wrapper", function(){
    expect($('.dropdown-option-list-wrapper').length).toEqual(0);
    testSelect.dropdownList();
    expect($('.dropdown-option-list-wrapper').length).toEqual(1);
  });

  it('creates HTML options list', function(){
    expect($('div.dropdown-wrapper .dropdown-option-list-wrapper ul.dropdown-option-list').length).toEqual(0);
    testSelect.dropdownList();
    expect($('div.dropdown-wrapper .dropdown-option-list-wrapper ul.dropdown-option-list').length).toEqual(1);
  });

  it('fill HTML options list with <select> <options>', function (){

    testSelect.dropdownList();

    expect($('ul.dropdown-option-list li.dropdown-option').length).toEqual(testSelect.find('option').length);
  });

  it('assign every HTML option a data-value corresponding to value of apropriate <select> <option>', function () {

    testSelect.dropdownList();

    var options = $('ul.dropdown-option-list li.dropdown-option'),
        selectOptions = testSelect.find('option');

    $.each(options, function(index){
      expect($(this).data('value')).toEqual($(selectOptions[index]).val());
    });
  });

  it('creates selected-option wrapper HTML', function() {
    expect($('.dropdown-selected-option-wrapper').length).toEqual(0);

    testSelect.dropdownList();

    expect($('.dropdown-selected-option-wrapper').length).toEqual(1);
  });

  it('creates selected-option HTML', function() {
    expect($('.dropdown-selected-option-wrapper .dropdown-selected-option').length).toEqual(0);

    testSelect.dropdownList();

    expect($('.dropdown-selected-option-wrapper .dropdown-selected-option').length).toEqual(1);
  });

  it('creates arrow for selected-option HTML', function() {
    expect($('.dropdown-selected-option-wrapper .dropdown-arrow').length).toEqual(0);

    testSelect.dropdownList();

    expect($('.dropdown-selected-option-wrapper .dropdown-arrow').length).toEqual(1);
  });

  it('sets selected-option HTML width to fill all the available space', function() {
    var selectedOptionWidth,
        selectedOptionWrapperInnerWidth,
        arrowWidth;

    testSelect.dropdownList();

    selectedOptionWidth = $('.dropdown-selected-option-wrapper .dropdown-selected-option').outerWidth();
    selectedOptionWrapperWidth = $('.dropdown-selected-option-wrapper').width();
    arrowWidth = $('.dropdown-selected-option-wrapper .dropdown-arrow').outerWidth();

    expect(selectedOptionWidth).toEqual(selectedOptionWrapperWidth-arrowWidth);
  });

  it('sets selected-option value accoringly to value of <select>', function(){
    testSelect.dropdownList();

    expect($('.dropdown-selected-option').data('value')).toEqual(testSelect.val());
  });

  it('sets selected-option text accoringly to value of <select>', function(){
    testSelect.dropdownList();

    expect($('.dropdown-selected-option').text()).toEqual(testSelect.find('option:selected').text());
  });

  it('sets options list width to match the width of selected option', function(){
    var dropdown,
        optionList,
        selectedOption;

    testSelect.dropdownList();

    dropdown = testSelect.next('.dropdown-wrapper');
    optionList = dropdown.find('.dropdown-option-list');
    selectedOption = dropdown.find('.dropdown-selected-option-wrapper');

    optionList.trigger('showOptionList');

    expect(optionList.outerWidth()).toEqual(selectedOption.outerWidth());
  });

  it('position option list right under the selected option', function(){
    var dropdown,
        optionList,
        selectedOption,
        selectedOptionBottomEdge,
        selectedOptionLeftEdge;

    testSelect.dropdownList();

    dropdown = testSelect.next('.dropdown-wrapper');
    optionList = dropdown.find('.dropdown-option-list');
    selectedOption = dropdown.find('.dropdown-selected-option-wrapper');

    optionList.trigger('showOptionList');

    selectedOptionBottomEdge = selectedOption.offset().top + selectedOption.outerHeight();
    selectedOptionLeftEdge = selectedOption.offset().left;

    expect(optionList.offset().top).toEqual(selectedOptionBottomEdge);
    expect(optionList.offset().left).toEqual(selectedOptionLeftEdge);
  });

});

describe('DropdowList interacions', function(){
  var dropdown, selectedOption, optionList;

  beforeEach(function() {
    testSelect = $('<select />');

    testSelect.append('<option value="1">one</opition>');
    testSelect.append('<option value="2">two</opition>');
    testSelect.append('<option value="3" selected="selected" >three</opition>');
    testSelect.append('<option value="4">four</opition>');

    $('body').append(testSelect);

    testSelect.dropdownList();

    dropdown = testSelect.next('.dropdown-wrapper');
    selectedOption = dropdown.find('.dropdown-selected-option');
    optionListWrapper = dropdown.find('.dropdown-option-list-wrapper');
    optionList = optionListWrapper.find('.dropdown-option-list');
  });

  afterEach(function() {
    testSelect.next('.dropdown-wrapper').remove();
    testSelect.remove();
  });

  it('shows option list after clicking at selected-option', function(){

    expect(optionListWrapper.is(':visible')).toBe(false);

    selectedOption.trigger('click');

    expect(optionListWrapper.is(':visible')).toBe(true);

    selectedOption.trigger('click');

    expect(optionListWrapper.is(':visible')).toBe(false);

  });

  it('adds dropdow-option-list-opened class when option list is opened', function(){
    expect(dropdown.hasClass('dropdown-option-list-opened')).toBe(false);
    dropdown.trigger('showOptionList');
    expect(dropdown.hasClass('dropdown-option-list-opened')).toBe(true);
  });

  it('removed dropdow-option-list-opened class when option list is being closed', function(){
    dropdown.trigger('showOptionList');
    expect(dropdown.hasClass('dropdown-option-list-opened')).toBe(true);
    dropdown.trigger('hideOptionList');
    expect(dropdown.hasClass('dropdown-option-list-opened')).toBe(false);
  });

  it('sets new selected-option after clicking at another option', function(){
    
    var option = $('.dropdown-option').eq(1);
    option.trigger('click');

    expect(selectedOption.text()).toEqual(option.text());
  });

  it('sets new selected option in <select> after clicking at another option', function(){
    
    var option = $('.dropdown-option').eq(1);
    option.trigger('click');

    expect(testSelect.find('option:selected').text()).toEqual(option.text());
  });

  it('hides option list after selecting new option', function(){
    var option = $('.dropdown-option').eq(1);
    
    expect(optionListWrapper.is(':visible')).toBe(false);
    
    selectedOption.trigger('click');
    
    expect(optionListWrapper.is(':visible')).toBe(true);
    
    option.trigger('click');
    
    expect(optionListWrapper.is(':visible')).toBe(false);

    
  });

  it('hides option list after clicking outside of the dropdown', function(){
    var option = $('.dropdown-option').eq(1);

    expect(optionListWrapper.is(':visible')).toBe(false);
    selectedOption.trigger('click');
    expect(optionListWrapper.is(':visible')).toBe(true);
    $('body').trigger('click');
    expect(optionListWrapper.is(':visible')).toBe(false);

  });

  it('adds disabled class to dropdown when <selecet> is being disabled', function(){
    expect(dropdown.hasClass('dropdown-disabled')).toBe(false);
    testSelect.prop('disabled', true);
    expect(dropdown.hasClass('dropdown-disabled')).toBe(true);
  });

  it('sets new seleced option text after changin selected option in <select>', function(){
    var newSelectedOption;
    expect(selectedOption.text()).toEqual(testSelect.find('option:selected').text());
    newSelectedOption = testSelect.find('option').not(':selected').eq(2);
    newSelectedOption.prop('selected', true);
    expect(selectedOption.text()).toEqual(newSelectedOption.text());

  });

  it('sets seleced option text to the first option after deselecting all options in <select>', function(){
    var newSelectedOption;

    newSelectedOption = testSelect.find('option').not(':selected').eq(2);
    newSelectedOption.prop('selected', true);
    expect(selectedOption.text()).toEqual(newSelectedOption.text());
    newSelectedOption.prop('selected', false);
    expect(selectedOption.text()).toEqual(testSelect.find('option').first().text());
  });

  


});
