// API/NajtazApi.js

// Data and Workflow APIs ROOT URLs
const WF_API_URL = "https://najtaz.bubbleapps.io/version-test/api/1.1/wf"; // API de test
const DATA_API_URL = "https://najtaz.bubbleapps.io/version-test/api/1.1/obj";

const PAGINATION_SIZE = 10

const ENDPOINT_LOGIN = "/login"
export function loginUserWithApi(email, password) {
    url = WF_API_URL + ENDPOINT_LOGIN
    return fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    })
    .then((response) => response.json())
    .catch((error) => console.error(error));
}

const ENDPOINT_GET_GROUP_DAY_STATS = "/groupdaysstats"
export function getDayStatsByGroup(groupName, fromIndex, user_token) {
    url = WF_API_URL + ENDPOINT_GET_GROUP_DAY_STATS
    return fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + user_token
        },
        body: JSON.stringify({
            groupName: groupName,
            fromIndex: fromIndex,
            pagination_size: PAGINATION_SIZE,
        }),
    })
    .then((response) => response.json())
    .catch((error) => console.error(error));
}

const ENDPOINT_GET_GROUP_DAY_PARTICIPATIONS = "/groupdayparticipations"
export function getDayParticipations(groupName, day, user_token) {
    url = WF_API_URL + ENDPOINT_GET_GROUP_DAY_PARTICIPATIONS
    return fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + user_token
        },
        body: JSON.stringify({
            groupName: groupName,
            day: day
        }),
    })
    .then((response) => response.json())
    .catch((error) => console.error(error));
}

const ENDPOINT_UPDATE_GROUP_DAY_STATS = "/update_groupdaystats"
export function updateGroupDayStats(groupDayStats, user_token) {
    url = WF_API_URL + ENDPOINT_UPDATE_GROUP_DAY_STATS
    return fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + user_token
        },
        body: JSON.stringify({
            uid: groupDayStats._id,
            check_in_out_list: groupDayStats.check_in_out_list,
            nb_pages_list: groupDayStats.nb_pages_list,
            nb_texts_list: groupDayStats.nb_texts_list,
            nb_videos_list: groupDayStats.nb_videos_list,
            nb_podcast_list: groupDayStats.nb_podcast_list
        }),
    })
    .then((response) => response.json())
    .catch((error) => console.error(error));
}

const ENDPOINT_SAVE_GROUP_DAY_STATS = "/save_groupdaystats"
export function saveGroupDayStats(groupDayStats, user_token) {
    url = WF_API_URL + ENDPOINT_SAVE_GROUP_DAY_STATS
    return fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + user_token
        },
        body: JSON.stringify({
            groupName: groupDayStats.groupName,
            day: groupDayStats.day,
            participantsIDs_list : groupDayStats.participantsIDs_list,
            check_in_out_list: groupDayStats.check_in_out_list,
            nb_pages_list: groupDayStats.nb_pages_list,
            nb_texts_list: groupDayStats.nb_texts_list,
            nb_videos_list: groupDayStats.nb_videos_list,
            nb_podcast_list: groupDayStats.nb_podcast_list
        }),
    })
    .then((response) => response.json())
    .catch((error) => console.error(error));
}

const ENDPOINT_GET_TOTAL_PRESENCES = "/totalpresences"
export function getTotalPresences(user_token){
    url = WF_API_URL + ENDPOINT_GET_TOTAL_PRESENCES
    return fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + user_token
        }
    })
    .then((response) => response.json())
    .catch((error) => console.error(error));
}



