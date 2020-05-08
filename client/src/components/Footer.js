import React from 'react';
import { connect } from 'react-redux';
import { Menu, Dropdown, Button, Tooltip } from 'antd';
import GLOBAL from '../global';
import ModalSearchSelect from './ModalSearchSelect';

const { themes, languages } = GLOBAL;

const Footer = ({ editorConfig, setEditorConfig, connection }) => {
  const { theme, language } = editorConfig;
  const { isHost } = connection;

  const changeTheme = (name, value) => {
    setEditorConfig({
      ...editorConfig,
      theme: {
        name,
        value
      }
    });
  }

  const changeLanguage = (name, value) => {
    setEditorConfig({
      ...editorConfig,
      language: {
        name,
        value
      }
    });
  }

  // const handleMenuThemeClick = (e) => {
  //   setEditorConfig({
  //     ...editorConfig,
  //     theme: {
  //       name: themes[e.item.props.index].name,
  //       value: themes[e.item.props.index].value
  //     }
  //   });
  // }

  // const menuTheme = (
  //   <Menu onClick={handleMenuThemeClick}>
  //     {themes.map((theme, index) =>
  //       <Menu.Item key={index}>
  //         {theme.name}
  //       </Menu.Item>
  //     )}
  //   </Menu>
  // );

  // const handleMenuLanguageClick = (e) => {
  //   setEditorConfig({
  //     ...editorConfig,
  //     language: {
  //       name: languages[e.item.props.index].name,
  //       value: languages[e.item.props.index].value
  //     }
  //   });
  // }

  // const menuLanguage = (
  //   <Menu onClick={handleMenuLanguageClick}>
  //     {languages.map((language, index) =>
  //       <Menu.Item key={index}>
  //         {language.value}
  //       </Menu.Item>
  //     )}
  //   </Menu>
  // );

  return (
    <div className="footer">
      <ModalSearchSelect
        buttonText={theme.name}
        title="Themes"
        data={themes}
        selected={theme}
        changeFunction={changeTheme}
      />
      <ModalSearchSelect
        buttonText={language.name}
        title="Languages"
        data={languages}
        selected={language}
        changeFunction={changeLanguage}
        disabled={isHost ? false : true}
      />
      {/* <Dropdown overlay={menuTheme} placement="topRight" trigger={['click']}>
      <Tooltip placement="topRight" title="Theme">
        <Button>{theme.name}</Button>
      </Tooltip>
    </Dropdown>
    <Dropdown overlay={menuLanguage} placement="topRight" trigger={['click']}>
      <Tooltip placement="topRight" title="Language">
        <Button>{language.value}</Button>
      </Tooltip>
    </Dropdown> */}
    </div>
  );
}

const mapStateToProps = state => ({
  editorConfig: state.editorConfig,
  connection: state.connection
});

const mapDispatchToTops = dispatch => ({
  setEditorConfig(editorConfig) {
    dispatch({
      type: 'EDITOR',
      editorConfig
    })
  }
});

export default connect(mapStateToProps, mapDispatchToTops)(Footer);