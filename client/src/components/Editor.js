import React, { useState, useEffect } from 'react';
import MonacoEditor from 'react-monaco-editor';
import { connect } from 'react-redux';

let issocket = false;
let decorations = {};
let contentWidgets = {};
let versionId = 0;

let editor;
let monaco;

const Editor = ({ connection, editorConfig, setEditorConfig }) => {
  const { socket, userId, isHost } = connection;

  const [code, setCode] = useState({
    value: ''
  });

  const [theme, setTheme] = useState({
    name: 'Visual Studio Dark',
    value: 'vs-dark'
  });

  const [language, setLanguage] = useState({
    name: 'JavaScript',
    value: 'javascript'
  });

  useEffect(() => {
    setEditorConfig({
      ...editorConfig,
      theme: {
        name: theme.name,
        value: theme.value
      },
      language: {
        name: language.name,
        value: language.value
      }
    });
  }, []);

  useEffect(() => {
    if (isHost) {
      editor.updateOptions({ readOnly: false });
      socket.emit("filedata", editor.getValue(), language);
    }

    insertWidget();
    decorations[userId] = [];
  }, [editor]);

  useEffect(() => {
    setTheme({
      name: editorConfig.theme.name,
      value: editorConfig.theme.value
    });
  }, [editorConfig.theme]);

  useEffect(() => {
    setLanguage({
      name: editorConfig.language.name,
      value: editorConfig.language.value
    });
  }, [editorConfig.language]);

  const changeLanguage = (name, value) => {
    setEditorConfig({
      ...editorConfig,
      language: {
        name,
        value
      }
    });
    if (isHost) {
      socket.emit('change_language', { name, value });
    }
  }

  const editorDidMount = (pEditor, pMonaco) => {
    editor = pEditor;
    monaco = pMonaco;

    editor.focus();

    editor.onDidChangeModelContent((e) => {
      if (issocket === false) {
        console.log('emit', e);
        socket.emit('key', e);
      } else
        issocket = false;
    })

    editor.onDidChangeCursorSelection((e) => {
      socket.emit('selection', e)
    })
  }

  const insertWidget = () => {
    contentWidgets[userId] = {
      domNode: null,
      position: {
        lineNumber: 0,
        column: 0
      },
      getId: function () {
        return 'content.' + userId;
      },
      getDomNode: function () {
        if (!this.domNode) {
          this.domNode = document.createElement('div')
          this.domNode.innerHTML = ''
          this.domNode.style.background = '#EC2928'
          this.domNode.style.color = '#FFFFFF'
          this.domNode.style.padding = '0 5px'
          this.domNode.style.borderRadius = '3px'
          this.domNode.style.opacity = 0.5
          this.domNode.style.width = 'max-content'
        }
        return this.domNode
      },
      getPosition: function () {
        return {
          position: this.position,
          preference: [monaco.editor.ContentWidgetPositionPreference.ABOVE, monaco.editor.ContentWidgetPositionPreference.BELOW]
        }
      }
    }
  }

  const changeWidgetPosition = (e) => {
    contentWidgets[userId].position.lineNumber = e.selection.endLineNumber
    contentWidgets[userId].position.column = e.selection.endColumn

    editor.removeContentWidget(contentWidgets[userId])
    editor.addContentWidget(contentWidgets[userId])
  }

  const changeSelection = (e) => {
    var selectionArray = []
    if (e.selection.startColumn === e.selection.endColumn && e.selection.startLineNumber === e.selection.endLineNumber) {
      e.selection.endColumn++
      selectionArray.push({
        range: e.selection,
        options: {
          className: 'cursor',
          hoverMessage: {
            value: ''
          }
        }
      })

    } else {
      selectionArray.push({
        range: e.selection,
        options: {
          className: 'selection',
          hoverMessage: {
            value: ''
          }
        }
      })
    }

    decorations[userId] = editor.deltaDecorations(decorations[userId], selectionArray);
  }

  const changeText = (e) => {
    editor.getModel().applyEdits(e.changes)
  }

  socket.on('resetdata', (data, language) => {
    issocket = true;
    editor.setValue(data);
    editor.updateOptions({ readOnly: true });
    changeLanguage(language.name, language.value);
    issocket = false;
  })

  socket.on('selection', (data) => {
    changeSelection(data)
    changeWidgetPosition(data)
  })

  socket.on('key', (data) => {
    issocket = true
    if (versionId !== data.versionId) {
      console.log('key', data);
      versionId = data.versionId;
      changeText(data);
    }
  })

  socket.on('change_language', language => {
    changeLanguage(language.name, language.value);
  })

  const onChange = (newValue, e) => {
    setCode({
      value: newValue
    });
  }

  const options = {
    selectOnLineNumbers: true,
    automaticLayout: true
  };

  return (
    <div className="editor">
      <MonacoEditor
        width="100%"
        height="100%"
        language={language.value}
        theme={theme.value}
        value={code.value}
        options={options}
        onChange={onChange}
        editorDidMount={editorDidMount}
      />
    </div>
  );
}

const mapStateToProps = state => ({
  connection: state.connection,
  editorConfig: state.editorConfig
});

const mapDispatchToTops = dispatch => ({
  setEditorConfig(editorConfig) {
    dispatch({
      type: 'EDITOR',
      editorConfig
    })
  }
});

export default connect(mapStateToProps, mapDispatchToTops)(Editor);