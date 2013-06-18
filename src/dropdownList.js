(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else {
    factory(jQuery);
  }
}(function ($) {

  function adjustOptionListWidth(event){
    var dropdown = $(this),
        optionList = dropdown.find('.dropdown-option-list'),
        selectedOption = dropdown.find('.dropdown-selected-option-wrapper');

        optionList.width(selectedOption.outerWidth());
  }

  function adjustSelectedOptionWidth(){
    var dropdown = $(this),
        selectedOption = dropdown.find('.dropdown-selected-option'),
        selectedOptionWrapper = dropdown.find('.dropdown-selected-option-wrapper'),
        arrow = dropdown.find('.dropdown-arrow');

    selectedOption.outerWidth(selectedOptionWrapper.width() - arrow.outerWidth());
  }

  function selectOption(optionValue, optionText){
    var dropdown = this;

    setSelectedOptionInDropdown.call(dropdown, optionValue, optionText);
    setSelectedOptionInSelect.call(dropdown, optionValue);
    dropdown.trigger('hideOptionList');
  }

  function setSelectedOptionInDropdown(optionValue, optionText) {
    var dropdown = this,
        selectedOption = dropdown.find('.dropdown-selected-option');

    selectedOption.text(optionText);
  }

  function setSelectedOptionInSelect(optionValue) {
    var dropdown = this,
        select = dropdown.prev('select.dropdown-list');

    if(select.length !== 1) {
      console.error('Correspondig <select> not found');
    }

    select.val(optionValue);

  }

  function toggleOptionList(event){
    var dropdown = $(event.delegateTarget),
        optionListWrapper = dropdown.find('.dropdown-option-list-wrapper');

    event.stopImmediatePropagation();

    if(optionListWrapper.is(':visible')) {
      dropdown.trigger('hideOptionList');
    } else {
      dropdown.trigger('showOptionList');
    }
  }

  function hideOptionList(event){
    var dropdown = $(this);
    dropdown.find('.dropdown-option-list-wrapper').hide();
    dropdown.removeClass('dropdown-option-list-opened');

    $('body').off('click.dropdown-hideOptionList');
  }

  function showOptionList(){
    var dropdown = $(this);

    dropdown.find('.dropdown-option-list-wrapper').show();
    dropdown.addClass('dropdown-option-list-opened');

    dropdown.trigger('adjustOptionListWidth');

    $('body').on('click.dropdown-hideOptionList', function(){
      dropdown.trigger('hideOptionList');
    });
  }

  function disableDropdown() {
    var dropdown = $(this);
    dropdown.addClass('dropdown-disabled');
  }

  function enableDropdown() {
    var dropdown = $(this);
    $(this).removeClass('dropdown-disabled');
  }

  function buildHtmlDropdown () {
    var dropdownWrapper,
        optionList,
        selectedOption,
        select = this;

    dropdownWrapper = $('<div />').addClass('dropdown-wrapper');
    selectedOption = buildSelectedOption.call(select);
    optionList = buildHtmlOptionList.call(select);

    dropdownWrapper.append(selectedOption);
    dropdownWrapper.append(optionList);

    return dropdownWrapper;
  }

  function buildSelectedOption() {
    var select = this,
        selectedOptionWrapper = $('<div />').addClass('dropdown-selected-option-wrapper clearfix'),
        selectedOption = $('<div />').addClass('dropdown-selected-option'),
        arrow = $('<div />').addClass('dropdown-arrow');

    selectedOption.data('value', select.val());
    selectedOption.text(select.find('option:selected').text());

    selectedOptionWrapper.append(selectedOption);
    selectedOptionWrapper.append(arrow);

    return selectedOptionWrapper;
  }

  function buildHtmlOptionList() {
    var select = this,
        optionListWrapper = $('<div />').addClass('dropdown-option-list-wrapper'),
        optionList = $('<ul />').addClass('dropdown-option-list');

    $.each(select.find('option'), function(){
      var option = $('<li />').addClass('dropdown-option');
      option.data('value', $(this).val());
      option.text($(this).text());
      optionList.append(option);
    });

    optionListWrapper.append(optionList);

    return optionListWrapper;
  }

  function addPropHooks(){
    addPropDisableHook();
    addPropSelectedHook();
  }

  function addPropDisableHook(){
    var previousHook, setProp;

    previousHook = $.propHooks.disable || {get : function(){}, set : function(){}};

    setProp = function(select, changeToDisabled) {
      var dropdown = $(select).next('.dropdown-wrapper');
      if(changeToDisabled) {
        dropdown.trigger('disable');
      } else {
        dropdown.trigger('enable');
      }

      return select;
    };

    $.propHooks.disabled = {
      get : previousHook.get,
      set : function (element, value) {
        if(!$(element).is('select.dropdown-list')) {
          return previousHook(element, value);
        }

        return setProp(element, value);
      }
    };
  }

  function addPropSelectedHook(){
    var previousHook = $.propHooks.selected || {get : function(){}, set : function(){}};

    setProp = function(option, changeToSelected) {
      var option = $(option),
          select = option.closest('select.dropdown-list'),
          dropdown = select.next('.dropdown-wrapper');

      if(changeToSelected) {
        selectOption.call(dropdown, option.val(), option.text());
      } else {
        var firstOption = select.find('option').first();
        selectOption.call(dropdown, firstOption.val(), firstOption.text());
      }

      return select;
    };

    $.propHooks.selected = {
      get : previousHook.get,
      set : function (element, value) {
        if(!$(element).is('option') || $(element).closest('select.dropdown-list').length !== 1) {
          return previousHook(element, value);
        }

        return setProp(element, value);
      }
    };
  }

  $.fn.dropdownList = function () {
    if(!this.is('select')) {
      console.error('DropdownList Plugin works only with <select> inputs');
      return;
    }

    var dropdown,
        select = this;

    select.addClass('dropdown-list');
    dropdown = buildHtmlDropdown.call(this);

    dropdown.on('adjustOptionListWidth', adjustOptionListWidth);
    dropdown.on('click', '.dropdown-option', function(event){
      var dropdown = $(event.delegateTarget),
          selectedOption = $(this);

      event.stopImmediatePropagation();

      selectOption.call(dropdown, selectedOption.data('value'), selectedOption.text());

    });
    dropdown.on('click', '.dropdown-selected-option-wrapper', toggleOptionList);
    dropdown.on('hideOptionList', hideOptionList);
    dropdown.on('showOptionList', showOptionList);
    dropdown.on('disable', disableDropdown);
    dropdown.on('enable', enableDropdown);

    select.after(dropdown);
    addPropHooks();

    adjustSelectedOptionWidth.call(dropdown);
  };

}));