import {StyleSheet, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Text from '../Text';
import colors from 'app/utils/colors';

const ButtonAvailable = ({name, active, onPress, style}: any) => {
  const fontSize = style.find((elm: any) => elm.fontSize)?.fontSize || 14;
  return (
    <TouchableOpacity className="w-9 h-9 rounded-full bg-white" style={[style, styles.shadow]} onPress={() => onPress && onPress()}>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        colors={active ? ['#FCB076', colors.darkOrange] : ['#38BDBC', colors.secondary]}
        className="w-full h-full rounded-full items-center justify-center">
        <Text className="text-white font-medium" style={{fontSize}}>
          {name}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.32,
    elevation: 5,
  },
});
export default ButtonAvailable;
