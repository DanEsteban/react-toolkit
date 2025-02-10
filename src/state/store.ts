import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
// import authSlice from "./slices/authSlice";
// import tableSlice from "./slices/tableSlice";
// import feedBackSlice from "./slices/feedBackSlice";
// import empresaSlice from "./slices/empresaSlice";

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
