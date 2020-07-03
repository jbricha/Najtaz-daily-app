import React from 'react';
import { FlatList, StyleSheet, Image, View, Text, TouchableOpacity, ActivityIndicator, Switch, Alert } from 'react-native';
import { getDayParticipations } from '../Models/NajtazApi';
import { TextInput } from "react-native-gesture-handler";
import cloneDeep from 'lodash/cloneDeep';
import { updateGroupDayStats } from '../Models/NajtazApi'
import moment from 'moment';

class UpdateGroupDayParticipations extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            dayParticipations: []
        }
        this.changesToUpdate = false
    }

    goBack() {
        const { navigation } = this.props
        navigation.goBack()
        navigation.state.params.onBack();  // Call onBack function of ScreenA
    }

    componentDidMount() {
        this.setState({ dayParticipations: this._getParticipationsFromDayStats(this.props.route.params.dayStats) })
    }
    // DayStats object to Participations array
    _getParticipationsFromDayStats(dayStats) {
        var participations = []
        if (!dayStats.participantsIDs_list) {
            Alert.alert("Identifiants des participants manquants")
            return
        }
        dayStats.participantsIDs_list.map((participantID, index) => {
            var currentParticipant = this._getParticipantByID(participantID,
                this.props.route.params.groupParticipants)
            participations[index] = {
                "groupName": dayStats.groupName,
                "day": dayStats.day,
                "check_in_out": dayStats.check_in_out_list ? dayStats.check_in_out_list[index] : 0,
                "nb_pages": dayStats.nb_pages_list ? dayStats.nb_pages_list[index] : 0,
                "nb_texts": dayStats.nb_pages_list ? dayStats.nb_texts_list[index] : 0,
                "nb_videos": dayStats.nb_videos_list ? dayStats.nb_videos_list[index] : 0,
                "nb_podcasts": dayStats.nb_videos_list ? dayStats.nb_podcast_list[index] : 0,
                "participant": participantID,
                "participantName": currentParticipant.name,
                "participantAvatarUri": "http://sites.altcode.co/avatars/najtazapp/"
                    + currentParticipant.name + "resized.jpg"
                    + '?random_number=' + new Date().getTime()
                // "participantAvatarUri": currentParticipant.avatar
            }
        })
        return participations
    }

    _getParticipantByID(participantID, participants) {
        return participants.find((p) => p._id == participantID)
    }

    // Participations array to DayStats object
    _getDayStatsFromParticipations(participations, initialDayStats) {
        var dayStats = cloneDeep(initialDayStats);
        participations.map((p, i) => {
            dayStats.check_in_out_list[i] = p.check_in_out
            dayStats.nb_pages_list[i] = p.nb_pages
            dayStats.nb_texts_list[i] = p.nb_texts
            dayStats.nb_videos_list[i] = p.nb_videos
            dayStats.nb_podcast_list[i] = p.nb_podcasts
        })
        return dayStats
    }

    _displayLoading() {
        if (this.state.isLoading) {
            return (
                <View style={styles.loading_container}>
                    <ActivityIndicator size='large' />
                </View>
            )
        }
    }

    _onCkechinSwitchChange(switchValue, ind) {
        this.changesToUpdate = true
        const tempData = cloneDeep(this.state.dayParticipations);
        tempData[ind].check_in_out = switchValue ? 1 : 0;
        this.setState({ dayParticipations: tempData });
    }

    _onPagesInputChange(value, ind) {
        this.changesToUpdate = true
        const tempData = cloneDeep(this.state.dayParticipations);
        tempData[ind].nb_pages = value ? parseInt(value) : 0;
        this.setState({ dayParticipations: tempData });
    }
    _onTextesInputChange(value, ind) {
        this.changesToUpdate = true
        const tempData = cloneDeep(this.state.dayParticipations);
        tempData[ind].nb_texts = value ? parseInt(value) : 0;
        this.setState({ dayParticipations: tempData });
    }
    _onVideosInputChange(value, ind) {
        this.changesToUpdate = true
        const tempData = cloneDeep(this.state.dayParticipations);
        tempData[ind].nb_videos = value ? parseInt(value) : 0;
        this.setState({ dayParticipations: tempData });
    }
    _onPodcastInputChange(value, ind) {
        this.changesToUpdate = true
        const tempData = cloneDeep(this.state.dayParticipations);
        tempData[ind].nb_podcasts = value ? parseInt(value) : 0;
        this.setState({ dayParticipations: tempData });
    }

    _updateParticipations() {

        if (this.changesToUpdate) {
            this.setState({ isLoading: true })
            var newDayStats = this._getDayStatsFromParticipations(this.state.dayParticipations,
                this.props.route.params.dayStats)
            updateGroupDayStats(newDayStats, this.props.route.params.token)
                .then(data => {
                    if (data.status == "success") {
                        this.props.navigation.navigate("GroupActivity",
                            {
                                comingFrom: "updateDayStats",
                                updatedDayStats: newDayStats
                            })
                    } else {
                        Alert.alert("Erreur de sauvegarde des activités de cette journée")
                    }
                    this.setState({ isLoading: false })
                })
        }
    }

    render() {

        var day = moment(this.props.route.params.dayStats.day)
        var fr = day.locale('fr')

        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.dayParticipations}
                    keyExtractor={(item) => item.participant.toString()}
                    renderItem={
                        ({ item, index }) =>
                            <View style={styles.participationItemContainer}>
                                <View style={styles.group1Row}>
                                    <View style={styles.group1}>
                                        <View style={styles.group2}>
                                            <Image
                                                source={{ uri: item.participantAvatarUri }}
                                                resizeMode="contain"
                                                style={styles.image1}
                                            ></Image>
                                            <Text style={styles.participantName}>{item.participantName}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.group7}>
                                        <View style={styles.group3}>
                                            <View style={styles.materialSwitch2Row}>
                                                <View style={styles.viewSwitch}>
                                                    <Switch
                                                        value={item.check_in_out == 0 ? false : true}
                                                        style={styles.switch}
                                                        onValueChange={(value) => this._onCkechinSwitchChange(value, index)}
                                                    ></Switch>
                                                </View>
                                                <Text style={styles.checkInOut}>Check-in / out</Text>
                                            </View>
                                        </View>
                                        <View style={styles.group6}>
                                            <View style={styles.group4}>
                                                <View style={styles.viewTextbox}>
                                                    <Text style={styles.label}>Pages lues</Text>
                                                    <TextInput placeholder="Nombre"
                                                        style={styles.inputStyle}
                                                        defaultValue={item.nb_pages.toString()}
                                                        keyboardType={'numeric'}
                                                        onChangeText={(value) => this._onPagesInputChange(value, index)}
                                                    ></TextInput>
                                                </View>
                                                <View style={styles.viewTextbox}>
                                                    <Text style={styles.label}>Textes</Text>
                                                    <TextInput placeholder="Nombre"
                                                        style={styles.inputStyle}
                                                        defaultValue={item.nb_texts.toString()}
                                                        keyboardType={'numeric'}
                                                        onChangeText={(value) => this._onTextesInputChange(value, index)}
                                                    ></TextInput>
                                                </View>
                                            </View>
                                            <View style={styles.group5}>
                                                <View style={styles.viewTextbox}>
                                                    <Text style={styles.label}>Vidéos</Text>
                                                    <TextInput placeholder="Nombre"
                                                        style={styles.inputStyle}
                                                        defaultValue={`${item.nb_videos}`}
                                                        keyboardType={'numeric'}
                                                        onChangeText={(value) => this._onVideosInputChange(value, index)}
                                                    ></TextInput>
                                                </View>
                                                <View style={styles.viewTextbox}>
                                                    <Text style={styles.label}>Podcasts</Text>
                                                    <TextInput placeholder="Nombre"
                                                        style={styles.inputStyle}
                                                        defaultValue={`${item.nb_podcasts}`}
                                                        keyboardType={'numeric'}
                                                        onChangeText={(value) => this._onPodcastInputChange(value, index)}
                                                    ></TextInput>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                    }
                />
                <View style={styles.footerBox}>
                    <View style={styles.dayTextInputBox}>
                        <Text style={styles.dayLabel}>Date des participations</Text>
                        <TextInput placeholder="Date des participations"
                            editable={false}
                            style={styles.dayTextInput}
                            value={day.format('dddd LL')}
                        ></TextInput>
                    </View>
                    <TouchableOpacity
                         style={this.changesToUpdate ? styles.saveButtonBox : styles.saveButtonBoxDisabled}
                         disabled={!this.changesToUpdate}
                         onPress={() => this._updateParticipations()}>
                         <Text style={styles.saveButton}>Sauvegarder</Text>
                    </TouchableOpacity>
                </View>
                {this._displayLoading()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 60
    },
    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    footerBox: {
        width: "100%",
        position: 'absolute',
        bottom: 0,
        height: 60,
        alignItems: "center",
        justifyContent: "space-around",
        flexDirection: "row",
        backgroundColor: "#F5F5F5"
    },
    dayTextInputBox: {
        width: "50%",
        borderColor: "black",
        borderBottomWidth: 1,
        marginBottom: 5,
        alignItems: "center",
        justifyContent: "space-around",
    },
    dayLabel: {
        color: "gray",
        opacity: 0.6,
        paddingTop: 5,
        fontSize: 14,
        //fontFamily: "roboto-regular",
    },
    dayTextInput: {
        flex: 1,
        width: "100%",
        color: "gray",
        paddingBottom: 0,
        fontSize: 16,
        //fontFamily: "roboto-regular",
        lineHeight: 20,
        textAlign: 'center'
    },
    saveButtonBoxDisabled: {
        borderColor: '#CCC',
        backgroundColor: "black",
        borderRadius: 25,
        height: 50,
        width: 150,
        alignItems: "center",
        justifyContent: "center",
    },
    saveButtonBox: {
        borderColor: '#fff',
        backgroundColor: "black",
        borderRadius: 25,
        height: 50,
        width: 150,
        alignItems: "center",
        justifyContent: "center",
    },
    saveButton: {
        color: 'white',
        textAlign: 'center',
        paddingLeft: 10,
        paddingRight: 10
    },

    // ITEM
    participationItemContainer: {
        width: 375,
        height: 182,
        borderColor: "#000000",
        borderWidth: 0,
        borderBottomWidth: 1,
        flexDirection: "row"
    },
    group1: {
        width: 154,
        height: 160
    },
    group2: {
        width: 125,
        height: 130,
        marginTop: 15,
        alignSelf: "center"
    },
    image1: {
        width: 100,
        height: 100,
        borderColor: "black",
        alignSelf: "center",
        borderRadius: 150 / 2,
        overflow: "hidden",
    },
    participantName: {
        color: "#121212",
        //fontFamily: "roboto-regular",
        textAlign: "center",
        marginTop: 12,
        alignSelf: "center",
        fontWeight: "bold"
    },
    group7: {
        width: 175,
        height: 155,
        marginLeft: 11,
        marginTop: 3
    },
    group3: {
        width: 175,
        height: 23,
        flexDirection: "row"
    },
    materialSwitch2: {
        width: 45,
        height: 23,
        overflow: "visible"
    },
    checkInOut: {
        color: "#121212",
        //fontFamily: "roboto-regular",
        marginLeft: 10,
        marginTop: 2
    },
    materialSwitch2Row: {
        height: 23,
        flexDirection: "row",
        flex: 1,
        marginRight: 29
    },
    group6: {
        width: 175,
        height: 125,
        marginTop: 7
    },
    group4: {
        width: 175,
        height: 60,
        flexDirection: "row"
    },
    materialStackedLabelTextbox1: {
        width: 80,
        height: 60
    },
    materialStackedLabelTextbox: {
        width: 80,
        height: 60,
        marginLeft: 15
    },
    materialStackedLabelTextbox1Row: {
        height: 60,
        flexDirection: "row",
        flex: 1
    },
    group5: {
        width: 175,
        height: 60,
        flexDirection: "row",
        marginTop: 5
    },
    materialStackedLabelTextbox2: {
        width: 80,
        height: 60
    },
    materialStackedLabelTextbox3: {
        width: 80,
        height: 60,
        marginLeft: 15
    },
    materialStackedLabelTextbox2Row: {
        height: 60,
        flexDirection: "row",
        flex: 1
    },
    group1Row: {
        height: 160,
        flexDirection: "row",
        flex: 1,
        marginRight: 35,
        marginTop: 10
    },
    viewTextbox: {
        backgroundColor: "transparent",
        borderColor: "#D9D5DC",
        borderBottomWidth: 1,
        marginRight: 30
    },
    label: {
        color: "#000",
        opacity: 0.6,
        paddingTop: 16,
        fontSize: 12,
        //fontFamily: "roboto-regular",
        textAlign: "center"
    },
    inputStyle: {
        flex: 1,
        width: 60,
        color: "#000",
        alignSelf: "stretch",
        paddingBottom: 0,
        fontSize: 16,
        //fontFamily: "roboto-regular",
        lineHeight: 20,
        textAlign: 'center'
    },
    viewSwitch: {
        alignItems: "center",
        justifyContent: "center"
    },
    switch: {
        width: 45,
        height: 22
    }

});

export default UpdateGroupDayParticipations