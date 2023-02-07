import React from 'react';
import {
  Icon,
  Layout,
  MenuItem,
  OverflowMenu,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import {StyleSheet} from 'react-native';

const BackIcon = props => <Icon {...props} name="arrow-back" />;

const MenuIcon = props => <Icon {...props} name="more-vertical" />;

const InfoIcon = props => <Icon {...props} name="info" />;

const LogoutIcon = props => <Icon {...props} name="log-out" />;

export default function Top({navigation}) {
  const [menuVisible, setMenuVisible] = React.useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const renderMenuAction = () => (
    <TopNavigationAction icon={MenuIcon} onPress={toggleMenu} />
  );

  const renderRightActions = () => (
    <React.Fragment>
      <OverflowMenu
        anchor={renderMenuAction}
        visible={menuVisible}
        onBackdropPress={toggleMenu}>
        <MenuItem accessoryLeft={InfoIcon} title="About" />
        <MenuItem accessoryLeft={LogoutIcon} title="Logout" />
      </OverflowMenu>
    </React.Fragment>
  );

  const renderBackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={() => navigation.goBack()} />
  );

  return (
    <Layout style={styles.container} level="1">
      <TopNavigation
        alignment="center"
        title="Map"
        subtitle="hybrid"
        accessoryLeft={renderBackAction}
        accessoryRight={renderRightActions}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    //minHeight: 128,
  },
});
