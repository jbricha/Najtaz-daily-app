import React from 'react'
import { FlatList, StyleSheet, Image, View, Text, TouchableOpacity, ActivityIndicator, Switch, Alert } from 'react-native'
import { TextInput } from "react-native-gesture-handler";
import cloneDeep from 'lodash/cloneDeep';
import { saveGroupDayStats } from '../Models/NajtazApi'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment';

class AddNewGroupDayParticipations extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            showDatePicker: false,
            day: this._getCurrentDayMidday(), // TODO à mettre 12pm
            dayParticipations: []
        }
    }
    _getCurrentDayMidday() {
        var dt = new Date();
        return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 12, 0, 0).getTime();
    }
    _getMaximumPossibleDate() {
        var dt = new Date();
        return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 12, 0, 0);
    }
    _getMinimumPossibleDate() {
        var dt = new Date();
        return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() - 1, 12, 0, 0);
    }
    componentDidMount() {
        this.setState({ dayParticipations: this._initParticipationsFromDayStats() })
    }
    // DayStats object to Participations array
    _initParticipationsFromDayStats(dayStats) {

        var participations = []
        this.props.route.params.groupParticipants.map((participant, index) => {

            participations[index] = {
                "groupName": this.props.route.params.groupName,
                "day": this.state.day,
                "check_in_out": 0,
                "nb_pages": 0,
                "nb_texts": 0,
                "nb_videos": 0,
                "nb_podcasts": 0,
                "nb_debates": 0,
                "participant": participant._id,
                "participantName": participant.name,
                "participantAvatarUri": "http://sites.altcode.co/najtazapp/"
                    + participant.name + "resized.jpg"
                    + '?random_number=' + new Date().getTime()
                // "participantAvatarUri": currentParticipant.avatar
            }
        })
        return participations
    }

    // Participations array to DayStats object
    _getDayStatsFromParticipations(groupName, day, participations) {
        var dayStats = {
            groupName : groupName,
            day : day,
            check_in_out_list : [],
            nb_pages_list : [],
            nb_texts_list : [],
            nb_videos_list : [],
            nb_podcast_list : [],
            participantsIDs_list : [],
        }
        participations.map((p, i) => { // TODO init the arrays
            dayStats.check_in_out_list[i] = p.check_in_out 
            dayStats.nb_pages_list[i] = p.nb_pages
            dayStats.nb_texts_list[i] = p.nb_texts
            dayStats.nb_videos_list[i] = p.nb_videos
            dayStats.nb_podcast_list[i] = p.nb_podcasts
            dayStats.participantsIDs_list[i] = p.participant
        })
        // participations.map((p, i) => { dayStats.nb_pages_list[i] = p.nb_pages })
        // participations.map((p, i) => { dayStats.nb_texts_list[i] = p.nb_texts })
        // participations.map((p, i) => { dayStats.nb_videos_list[i] = p.nb_videos })
        // participations.map((p, i) => { dayStats.nb_podcast_list[i] = p.nb_podcasts })
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
        const tempData = cloneDeep(this.state.dayParticipations);
        tempData[ind].check_in_out = switchValue ? 1 : 0;
        this.setState({ dayParticipations: tempData });
    }

    _onPagesInputChange(value, ind) {
        const tempData = cloneDeep(this.state.dayParticipations);
        tempData[ind].nb_pages = value ? parseInt(value) : 0;
        this.setState({ dayParticipations: tempData });
    }
    _onTextesInputChange(value, ind) {
        const tempData = cloneDeep(this.state.dayParticipations);
        tempData[ind].nb_texts = value ? parseInt(value) : 0;
        this.setState({ dayParticipations: tempData });
    }
    _onVideosInputChange(value, ind) {
        const tempData = cloneDeep(this.state.dayParticipations);
        tempData[ind].nb_videos = value ? parseInt(value) : 0;
        this.setState({ dayParticipations: tempData });
    }
    _onPodcastInputChange(value, ind) {
        const tempData = cloneDeep(this.state.dayParticipations);
        tempData[ind].nb_podcasts = value ? parseInt(value) : 0;
        this.setState({ dayParticipations: tempData });
    }

    _saveParticipations() {

        this.setState({ isLoading: true })
        var newDayStats = this._getDayStatsFromParticipations(this.props.route.params.groupName,
                                                              this.state.day, 
                                                              this.state.dayParticipations)
        saveGroupDayStats(newDayStats, this.props.route.params.token)
            .then(data => {
                if (data.status == "success") {
                    newDayStats._id = data.response.savedID
                    this.props.navigation.navigate("GroupActivity",
                        {
                            comingFrom: "saveNewDayStats",
                            savedDayStats: newDayStats
                        })
                } else if (data.status == "NOT_RUN"){ // La date est déjà utilisée par un autre GroupDayStats dans la DB
                    Alert.alert("La date choisie a déjà été saisie. Merci de choisir une autre date.")
                } else {
                    Alert.alert("Erreur de création des activités de cette journée")
                }
                this.setState({ isLoading: false })
            })
    }

    _displayDateTimePicker() {
        if (this.state.showDatePicker) {
            return (<DateTimePicker
                testID="dateTimePicker"
                timeZoneOffsetInMinutes={0}
                value={this.state.day}
                mode={'date'}
                is24Hour={true}
                display="default"
                onChange={this._onDatePickedChange}
                maximumDate={this._getMaximumPossibleDate()}
                minimumDate={this._getMinimumPossibleDate()}
            />)
        }
    }
    _onDatePickedChange = (event, selectedDate) => {
        if (selectedDate) {
            this.setState({ day: selectedDate.getTime(), showDatePicker: false })
        }
    }

    render() {

        var day = moment(this.state.day)
        var fr = day.locale('fr')

        return (
            <View style={styles.container}>
                {this._displayDateTimePicker()}
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
                    <TouchableOpacity style={styles.dayTextInputBox}
                        onPress={() => this.setState({ showDatePicker: true })}>
                        <Text style={styles.dayLabel}>Date des participations</Text>
                        <TextInput placeholder="Date des participations"
                            editable={false}
                            style={styles.dayTextInput}
                            value={day.format('dddd LL')}
                        ></TextInput>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.saveButtonBox}
                        onPress={() => this._saveParticipations()}>
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
        color: "#000",
        opacity: 0.6,
        paddingTop: 5,
        fontSize: 14,
        //fontFamily: "roboto-regular",
    },
    dayTextInput: {
        flex: 1,
        width: "100%",
        color: "#000",
        paddingBottom: 0,
        fontSize: 16,
        //fontFamily: "roboto-regular",
        lineHeight: 20,
        textAlign: 'center'
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
    },

});

export default AddNewGroupDayParticipations