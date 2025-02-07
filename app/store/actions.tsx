import userSlice from './slice/userSlice';
import bookingSlice from './slice/bookingSlice';

const userAction = userSlice.actions;
const bookingAction = bookingSlice.actions;

export default {userAction, bookingAction};
