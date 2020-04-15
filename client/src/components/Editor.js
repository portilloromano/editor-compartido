import React, { useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import { connect } from 'react-redux';
import { Menu, Dropdown, Button, Tooltip } from 'antd';
import GLOBAL from '../global';

const { themes, languages } = GLOBAL;

const Editor = ({ connection }) => {
  const [state, setState] = useState({
    code: '// type your code...',
  });

  const [theme, setTheme] = useState({
    name: 'Visual Studio Dark',
    value: 'vs-dark'
  });

  const [language, setLanguage] = useState({
    name: 'JavaScript',
    value: 'javascript'
  });

  const { socket, userId } = connection;

  const editorDidMount = (editor, monaco) => {
    editor.focus();
  }

  socket.on("edit", newValue => {
    console.log('listen: ', newValue);
    // setState({ code: newValue });
  })

  const onChange = (newValue, e) => {
    setState({ code: newValue });
    console.log('emit', newValue);
    socket.emit("editor", newValue);
  }

  const options = {
    selectOnLineNumbers: true,
    automaticLayout: true
  };

  const handleMenuThemeClick = (e) => {
    setTheme({
      name: themes[e.item.props.index].name,
      value: themes[e.item.props.index].value
    });
  }

  const menuTheme = (
    <Menu onClick={handleMenuThemeClick}>
      {themes.map((theme, index) =>
        <Menu.Item key={index}>
          {theme.name}
        </Menu.Item>
      )}
    </Menu>
  );

  const handleMenuLanguageClick = (e) => {
    setLanguage({
      name: languages[e.item.props.index].name,
      value: languages[e.item.props.index].value
    });
  }

  const menuLanguage = (
    <Menu onClick={handleMenuLanguageClick}>
      {languages.map((language, index) =>
        <Menu.Item key={index}>
          {language.value}
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <div className="editor">
      <MonacoEditor
        width="100%"
        height="100%"
        language={language.value}
        theme={theme.value}
        value={state.code}
        options={options}
        onChange={onChange}
        editorDidMount={editorDidMount}
      />
      <div className="editor-footer">
        <Dropdown overlay={menuTheme} placement="topRight" trigger={['click']}>
          <Tooltip placement="topRight" title="Theme">
            <Button>{theme.name}</Button>
          </Tooltip>
        </Dropdown>
        <Dropdown overlay={menuLanguage} placement="topRight" trigger={['click']}>
          <Tooltip placement="topRight" title="Language">
            <Button>{language.value}</Button>
          </Tooltip>
        </Dropdown>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  connection: state.connection
});

export default connect(mapStateToProps)(Editor);