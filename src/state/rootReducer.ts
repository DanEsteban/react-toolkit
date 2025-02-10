import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import empresaReducer from './slices/empresaSlice';
import tablesReducer from './slices/tableSlice';
import feedbackReducer from './slices/feedBackSlice';

const appReducer = combineReducers({
     authSlice: authReducer,
     empresaSlice: empresaReducer,
     tableSlice: tablesReducer,
     feedbackSlice: feedbackReducer,
});

const rootReducer = (state: any, action: any) => {
     if (action.type === 'auth/logout') {
          state = undefined;
          localStorage.clear(); 
     }
     return appReducer(state, action);
};

export default rootReducer;