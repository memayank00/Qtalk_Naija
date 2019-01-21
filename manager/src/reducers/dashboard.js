const initState = {
    showDropdown : "hide",
    notifications : []
};

const _reducer = "_reducer";
export default function admin(state = initState, data) {
    switch (data.type) {
        case "Dashboard-toggleDropdown" + _reducer : {
            return { ...state, showDropdown: data.action};
        }

        case "Dashboard-notifications" + _reducer : {
            return { ...state, ...data.notitications};
        }


        default: {
            return state;
        }
    }
}