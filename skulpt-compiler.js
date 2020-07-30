const Range = ace.require("ace/range").Range;

$(document).ready(function () {
  //editor
  $(".editor").each(function (index) {
    const editor = ace.edit(this);
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/python");
    editor.session.setValue("#Enter your code here\nprint('hello world')"); //you can set value from xhr here
    $(this).data("aceObject", editor);
  });

  //console
  $(".output").each(function (index) {
    const output = ace.edit(this);
    output.session.setMode("ace/mode/plain_text");
    output.renderer.setShowGutter(false);
    output.setReadOnly(true);
    $(this).data("aceObject", output);
    output.prevCursorPosition = output.getCursorPosition();

    //restrict cursor after the printed part during input
    output.selection.on("changeCursor", function () {
      const currentPosition = output.getCursorPosition();
      if (currentPosition.row < output.prevCursorPosition.row) {
        output.selection.moveCursorToPosition(output.prevCursorPosition);
      } else if (currentPosition.row == output.prevCursorPosition.row) {
        if (currentPosition.column < output.prevCursorPosition.column) {
          output.selection.moveCursorToPosition(output.prevCursorPosition);
        }
      }
    });

    //prevent selection by double triple click during input
    output.selection.on("changeSelection", function () {
      const anchorPosition = output.selection.getSelectionAnchor();
      const leadPosition = output.selection.getSelectionLead();

      if (
        anchorPosition.row < output.prevCursorPosition.row ||
        leadPosition.row < output.prevCursorPosition.row
      ) {
        output.selection.clearSelection();
      } else if (
        anchorPosition.row == output.prevCursorPosition.row ||
        leadPosition.row == output.prevCursorPosition.row
      ) {
        if (
          anchorPosition.column < output.prevCursorPosition.column ||
          leadPosition.column < output.prevCursorPosition.column
        ) {
          output.selection.clearSelection();
        }
      }
    });
  });

  //prevent selection by drag and drop during input
  $(".output").on(
    "dragstart ondrop dbclick",
    (e) => {
      e.stopImmediatePropagation();
      e.stopPropagation();
      e.preventDefault();
      return false;
    },
    false
  );
});

function builtinRead(x) {
  if (
    Sk.builtinFiles === undefined ||
    Sk.builtinFiles["files"][x] === undefined
  )
    throw "File not found: '" + x + "'";
  return Sk.builtinFiles["files"][x];
}

function runit(editorElem, outputElem) {
  $(".run-button").hide(); //hiding every runButton and turning into stop button
  $(".stop-button").show();
  const editor = $(editorElem).data("aceObject");
  const output = $(outputElem).data("aceObject");
  const prog = editor.session.getValue();
  output.session.setValue("");
  Sk.pre = "output";
  Sk.configure({
    inputfun: function () {
      output.setReadOnly(false);
      // the function returns a promise to give a result back later...
      return new Promise(function (resolve, reject) {
        $(outputElem).on("keydown", function (e) {
          if (e.keyCode == 13) {
            e.preventDefault();
            output.setReadOnly(true);
            $(outputElem).off("keydown");
            output.navigateLineEnd();
            const inputText = output.session.getTextRange(
              new Range(
                output.prevCursorPosition.row,
                output.prevCursorPosition.column,
                output.getCursorPosition().row,
                output.getCursorPosition().column
              )
            );
            resolve(inputText);
            output.insert("\n");
            output.prevCursorPosition = output.getCursorPosition();
            output.session.setUndoManager(new ace.UndoManager()); //resets undo stack
          }
        });

        $(".stop-button").on("click", function (e) {
          $(outputElem).unbind();
          output.setReadOnly(true);
          return resolve();
        });
      });
    },
    output: function (text) {
      output.insert(text);
      output.prevCursorPosition = output.getCursorPosition();
      output.session.setUndoManager(new ace.UndoManager());
    },
    read: builtinRead,
    __future__: Sk.python3,
    execLimit: Number.POSITIVE_INFINITY,
  });
  //(Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = "mycanvas"; //for future pupose
  var myPromise = Sk.misceval.asyncToPromise(function () {
    return Sk.importMainWithBody("<stdin>", false, prog, true);
  });
  myPromise.then(
    function (mod) {
      console.log("success");
      $(".run-button").show();
      $(".stop-button").hide();
    },
    function (err) {
      output.insert("<" + err.toString() + ">");
      $(".run-button").show();
      $(".stop-button").hide();
    }
  );
}

function stopit() {
  Sk.execLimit = 1; //stop all previous execution

  Sk.timeoutMsg = function () {
    Sk.execLimit = Number.POSITIVE_INFINITY;
    return "Program Terminated";
  };
}
