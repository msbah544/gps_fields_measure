import React from 'react';
import {Icon, Layout, Menu, MenuItem} from '@ui-kitten/components';
import {StyleSheet} from 'react-native';

const StarIcon = props => <Icon {...props} name="star" />;

const useMenuState = (initialState = null) => {
  const [selectedIndex, setSelectedIndex] = React.useState(initialState);
  return {selectedIndex, onSelect: setSelectedIndex};
};

export const ModalMenu = () => {
  const leftMenuState = useMenuState();

  return (
    <Layout style={{}}>
      <Menu style={styles.menu} {...leftMenuState}>
        <MenuItem title="Users" accessoryLeft={StarIcon} />
        <MenuItem title="Orders" accessoryLeft={StarIcon} />
        <MenuItem title="Transactions" accessoryLeft={StarIcon} />
      </Menu>
    </Layout>
  );
};

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    margin: 8,
  },
});
