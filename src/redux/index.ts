import reduxThunk from 'redux-thunk';
import user from './modules/user/reducer';
import global from './modules/global/reducer'
import booking from './modules/booking/reducer'
import maintenance from './modules/maintenance/reducer'
import { persistStore, persistReducer } from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session';
import { legacy_createStore as createStore, Store, applyMiddleware, combineReducers } from 'redux';

const reducer = combineReducers({
    user,
    global,
    booking,
    maintenance
});

const persistConfig = {
    key: 'fems2.0',
    storage: storageSession
};

const myPersistReducer = persistReducer(persistConfig, reducer);
const store: Store = createStore(myPersistReducer, applyMiddleware(reduxThunk));
const persistor = persistStore(store);

export { store, persistor };