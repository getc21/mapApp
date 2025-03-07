import { create } from 'zustand';
import { clearWatchLocation, getCurrentLocation, watchCurrentLocation } from '../../../actions/location/location';
import { Location } from '../../../infrastructure/interfaces/location';




interface LocationState {
    lastKnownLocation: Location|null;
    userLocationsList: Location[];
    watchId: number | null;



    getLocation: () => Promise<Location|null>;
    watchLocation: () => void;
    clearWatchLocation: () => void;
}



export const useLocationStore = create<LocationState>()((set, get) => ({

    lastKnownLocation: null,
    userLocationsList: [],
    watchId: null,

    getLocation: async() => {
        const location = await getCurrentLocation();
        set({ lastKnownLocation: location});
        return location;
    },

    watchLocation: () => {
        const watchId = get().watchId;
        if( watchId !== null ){
            get().clearWatchLocation();
        }

        const id = watchCurrentLocation((location) => {
            set({
                lastKnownLocation: location,
                userLocationsList: [...get().userLocationsList, location],
            });
        });

        set({ watchId: id});
    },

    clearWatchLocation: () => {
        const watchId = get().watchId;
        if( watchId !== null ){
            clearWatchLocation(watchId);
        }
    },
}));
