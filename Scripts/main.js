exports.activate = function() {
  textEditors = []
  nova.workspace.onDidAddTextEditor((editor) => trackEditor(editor))
}

exports.deactivate = function() {
  textEditors = []
}

nova.commands.register("open-recent.show-recent", (workspace) => {
  workspace.showChoicePalette(editorPaths(), {}, (name, index) => openEditor(index))
});

// // //

function editorPaths() {
  return textEditors.map((editor) => relativePath(editor))
}

function openEditor(index) {
  if (index) {
    const editor = textEditors[index]
    nova.workspace.openFile(editor.document.path)
    trackEditor(editor)
  }
}

function relativePath(editor) {
  return nova.workspace.relativizePath(editor.document.path)
}

function removeDuplicateEditors() {
  const seen = new Set();
  textEditors = textEditors.filter(editor => {
    const key = relativePath(editor)
    if (seen.has(key)) {
      return false
    } else {
      seen.add(key)
      return true
    }
  })
}

function trackEditor(newEditor) {
  textEditors.unshift(newEditor)
  removeDuplicateEditors()
  textEditors.length = Math.min(textEditors.length, 100);
}
