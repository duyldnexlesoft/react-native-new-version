import {Alert as AlertReact, Platform} from 'react-native';
const Alert = {
  alert: (message: any) => (Platform.OS === 'ios' ? AlertReact.alert(message) : AlertReact.alert('', message)),
};
export default Alert;
