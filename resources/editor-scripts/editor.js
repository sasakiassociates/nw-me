const elements = [];

const keyedObjects = {};

const storeContent = function (obj, $editable) {
    _.set(obj, $editable.attr('data-editable'), $editable.html());
};
const restoreContent = function (obj, $editable) {
    $editable.html(_.get(obj, $editable.attr('data-editable')));
};

const restoreFromData = function (data) {
    $('[data-editable]').each(function () {
        elements.push($(this)[0]);
        restoreContent(data, $(this));
    });
};

const getSaveData = function () {
    const ans = {};
    $('[data-editable]').each(function () {
        storeContent(ans, $(this));
    });
    return ans;
};

const enterEditMode = function () {
    document.title = 'EDITING: ' + document.title;
    $('[data-editable]').each(function () {
        elements.push($(this)[0]);
        storeContent(keyedObjects, $(this));
    });

    var editor = new MediumEditor(elements);
    editor.subscribe('editableInput', function (event, editable) {
        var $editable = $(editable);
        storeContent(keyedObjects, $editable);
    });
};

console.log('PAGE LOADED');
console.log('global.me_editMode CHECKED: ' + global.me_editMode);

if (global.me_editMode) {
    enterEditMode();
}