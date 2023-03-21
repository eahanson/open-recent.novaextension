exports.activate = function() {
  textEditors = []
  nova.workspace.onDidAddTextEditor((editor) => trackEditor(editor))
}

exports.deactivate = function() {
  textEditors = []
}

nova.commands.register("open-recent.show-recent", (workspace) => {
  workspace.showChoicePalette(editorPaths(), {}, (name, index) => openEditor(index));
});

// // //

function trackEditor(newEditor) {
  const index = textEditors.indexOf(newEditor);
  if (index !== -1) {
    textEditors.splice(index, 1);
  }
  textEditors.unshift(newEditor);
  textEditors.length = Math.min(textEditors.length, 100);
}

function openEditor(index) {
  if (index) {
    const editor = textEditors[index]
    nova.workspace.openFile(editor.document.path)
    trackEditor(editor)
  }
}

function editorPaths() {
  return textEditors.map((editor) => nova.workspace.relativizePath(editor.document.path))
}
