import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { TouchableOpacity } from 'react-native-gesture-handler'
import moment from 'moment';
import 'moment/src/locale/fr';

class GroupDayStatsItem extends React.Component {

    _add(accumulator, a) {
        return accumulator + a;
    }

    render() {

        const { dayStats, displayDetailForDayParticipations } = this.props

        var day = moment(this.props.dayStats.day)
        var fr = day.locale('fr')

        return (
            <TouchableOpacity
                style={styles.main_container}
                onPress={() =>
                    displayDetailForDayParticipations(dayStats)}>
                <View style={styles.rectRow}>
                    <View style={styles.dayBox}>
                        <View style={styles.group6}>
                            <View style={styles.group0}>
                                <Text style={styles.weekday}>{fr.localeData().weekdays(day).toUpperCase()}</Text>
                            </View>
                            <View style={styles.group1}>
                                <Text style={styles.day}>{day.format('DD')}</Text>
                            </View>
                            <View style={styles.group7Stack}>
                                <View style={styles.group7}>
                                    <Text style={styles.month}>{fr.localeData().months(day)}</Text>
                                </View>
                                <View style={styles.group2}>
                                    <Text style={styles.mars3}>{day.format('YYYY')}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.sumsBox}>
                        <View style={styles.group9Row}>
                            <View style={styles.group9}>
                                <View style={styles.chipBox}>
                                    <Text style={styles.chipTextBig}>
                                        <Text style={{ fontWeight: 'bold' }}>
                                            {this.props.dayStats.check_in_out_list.reduce((a, b) => a + b, 0)}
                                        </Text> Présents</Text>
                                </View>
                            </View>
                            <View style={styles.group10}>
                                <View style={styles.chipBox}>
                                    <Text style={styles.chipTextBig}>
                                        <Text style={{ fontWeight: 'bold' }}>
                                            {this.props.dayStats.nb_pages_list.reduce((a, b) => a + b, 0)}
                                        </Text> Pages</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.group85Row}>
                            <View style={styles.group85}>
                                <View style={styles.chipBox}>
                                    <Text style={styles.chipText}>
                                        <Text style={{ fontWeight: 'bold' }}>
                                            {this.props.dayStats.nb_texts_list.reduce((a, b) => a + b, 0)}
                                        </Text> Textes</Text>
                                </View>
                            </View>
                            <View style={styles.group85}>
                                <View style={styles.chipBox}>
                                    <Text style={styles.chipText}>
                                        <Text style={{ fontWeight: 'bold' }}>
                                            {this.props.dayStats.nb_videos_list.reduce((a, b) => a + b, 0)}
                                        </Text> Vidéos</Text>
                                </View>
                            </View>
                            <View style={styles.group85}>
                                <View style={styles.chipBox}>
                                    <Text style={styles.chipText}>
                                        <Text style={{ fontWeight: 'bold' }}>
                                            {this.props.dayStats.nb_podcast_list.reduce((a, b) => a + b, 0)}
                                        </Text> Podcasts</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    main_container: {
        borderColor: "#000000",
        borderWidth: 0,
        borderBottomWidth: 1
    },
    dayBox: {
        width: 104,
        height: 119,
        backgroundColor: "rgba(230, 230, 230,1)"
    },
    group6: {
        width: 104,
        height: 92,
        marginTop: 10
    },
    group0: {
        width: 104,
        height: 10,
        justifyContent: "center"
    },
    weekday: {
        width: 103,
        height: 20,
        color: "#121212",
        flexDirection: "row",
        alignSelf: "stretch",
        justifyContent: "space-between",
        margin: 0,
        fontSize: 16,
        //fontFamily: "roboto-regular",
        textAlign: "center"
    },
    group1: {
        width: 104,
        height: 36,
        justifyContent: "center"
    },
    day: {
        width: 103,
        height: 46,
        color: "#121212",
        flexDirection: "row",
        alignSelf: "stretch",
        justifyContent: "space-between",
        margin: 0,
        fontSize: 40,
        //fontFamily: "roboto-regular",
        textAlign: "center"
    },
    group7: {
        top: 0,
        left: 0,
        width: 104,
        height: 29,
        position: "absolute",
        justifyContent: "space-between"
    },
    month: {
        color: "#121212",
        flexDirection: "row",
        alignSelf: "stretch",
        justifyContent: "space-between",
        fontSize: 24,
        //fontFamily: "roboto-regular",
        textAlign: "center",
        textTransform: 'uppercase'
    },
    group2: {
        top: 24,
        left: 0,
        width: 104,
        height: 25,
        position: "absolute",
        justifyContent: "space-between"
    },
    mars3: {
        color: "#121212",
        flexDirection: "row",
        alignSelf: "stretch",
        justifyContent: "space-between",
        fontSize: 24,
        //fontFamily: "roboto-regular",
        textAlign: "center"
    },
    group7Stack: {
        width: 104,
        height: 49,
        marginTop: 0
    },
    group9: {
        width: 120,
        height: 60,
        margin: 5
    },
    group72: {
        top: 19,
        left: 0,
        width: 77,
        height: 29,
        position: "absolute",
        alignItems: "flex-start",
        justifyContent: "center"
    },
    presents: {
        color: "#121212",
        flexDirection: "row",
        alignSelf: "center",
        justifyContent: "space-between",
        fontSize: 16,
        //fontFamily: "roboto-regular",
        textAlign: "center"
    },
    group8: {
        top: 0,
        left: 0,
        width: 77,
        height: 36,
        position: "absolute",
        justifyContent: "center"
    },
    mars22: {
        width: 35,
        height: 25,
        color: "#121212",
        flexDirection: "row",
        alignSelf: "center",
        justifyContent: "space-between",
        margin: 0,
        fontSize: 20,
        //fontFamily: "roboto-regular",
        textAlign: "center"
    },
    group72Stack: {
        width: 77,
        height: 48,
        marginTop: -1
    },
    group10: {
        width: 77,
        height: 45,
        margin: 5,
    },
    group723: {
        top: 18,
        left: 0,
        width: 77,
        height: 29,
        position: "absolute",
        alignItems: "flex-start",
        justifyContent: "center"
    },
    pages: {
        color: "#121212",
        flexDirection: "row",
        alignSelf: "center",
        justifyContent: "space-between",
        fontSize: 16,
        //fontFamily: "roboto-regular",
        textAlign: "center"
    },
    group823: {
        top: 0,
        left: 0,
        width: 77,
        height: 36,
        position: "absolute",
        justifyContent: "center"
    },
    mars2223: {
        width: 35,
        height: 25,
        color: "#121212",
        flexDirection: "row",
        alignSelf: "center",
        justifyContent: "space-between",
        margin: 0,
        fontSize: 20,
        //fontFamily: "roboto-regular",
        textAlign: "center"
    },
    group723Stack: {
        width: 77,
        height: 47
    },
    group83: {
        width: 77,
        height: 45
    },
    group73: {
        top: 19,
        left: 0,
        width: 77,
        height: 29,
        position: "absolute",
        alignItems: "flex-start",
        justifyContent: "center"
    },
    textes: {
        color: "#121212",
        flexDirection: "row",
        alignSelf: "center",
        justifyContent: "space-between",
        fontSize: 16,
        //fontFamily: "roboto-regular",
        textAlign: "center"
    },
    group84: {
        top: 0,
        left: 0,
        width: 77,
        height: 36,
        position: "absolute",
        justifyContent: "center"
    },
    mars223: {
        width: 35,
        height: 25,
        color: "#121212",
        flexDirection: "row",
        alignSelf: "center",
        justifyContent: "space-between",
        margin: 0,
        fontSize: 20,
        //fontFamily: "roboto-regular",
        textAlign: "center"
    },
    group73Stack: {
        width: 77,
        height: 48,
        marginTop: -1
    },
    group9Row: {
        height: 40,
        flexDirection: "row"
    },
    group85: {
        width: 80,
        height: 45,
        margin: 2
    },
    group722: {
        top: 18,
        left: 0,
        width: 77,
        height: 29,
        position: "absolute",
        alignItems: "flex-start",
        justifyContent: "center"
    },
    videos: {
        width: 49,
        height: 20,
        marginTop: 4,
        color: "#121212",
        flexDirection: "row",
        alignSelf: "center",
        justifyContent: "space-between",
        fontSize: 16,
        //fontFamily: "roboto-regular",
        textAlign: "center"
    },
    group822: {
        top: 0,
        left: 0,
        width: 77,
        height: 36,
        position: "absolute",
        justifyContent: "center"
    },
    mars2222: {
        width: 35,
        height: 25,
        color: "#121212",
        flexDirection: "row",
        alignSelf: "center",
        justifyContent: "space-between",
        margin: 0,
        fontSize: 20,
        //fontFamily: "roboto-regular",
        textAlign: "center"
    },
    group722Stack: {
        width: 77,
        height: 47
    },
    group8232: {
        width: 77,
        height: 45
    },
    group7222: {
        top: 18,
        left: 0,
        width: 77,
        height: 29,
        position: "absolute",
        alignItems: "flex-start",
        justifyContent: "center"
    },
    podcast: {
        width: 63,
        height: 20,
        marginTop: 4,
        color: "#121212",
        flexDirection: "row",
        alignSelf: "center",
        justifyContent: "space-between",
        fontSize: 16,
        //fontFamily: "roboto-regular",
        textAlign: "center"
    },
    group8222: {
        top: 0,
        left: 0,
        width: 77,
        height: 36,
        position: "absolute",
        justifyContent: "center"
    },
    mars22222: {
        width: 35,
        height: 25,
        color: "#121212",
        flexDirection: "row",
        alignSelf: "center",
        justifyContent: "space-between",
        margin: 0,
        fontSize: 20,
        //fontFamily: "roboto-regular",
        textAlign: "center"
    },
    group7222Stack: {
        width: 77,
        height: 47
    },
    group85Row: {
        height: 45,
        flexDirection: "row",
        marginTop: 10,
    },
    rectRow: {
        height: 119,
        flexDirection: "row",
        marginRight: 18
    },
    sumsBox: {
        marginLeft: 5,
        marginTop: 9,
        marginBottom: 16
    },
    chipBox: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgb(230,230,230)",
        borderRadius: 50,
        height: 40
    },
    chipTextBig: {
        fontSize: 14,
        color: "rgba(0,0,0,0.87)"
    },
    chipText: {
        fontSize: 12,
        color: "rgba(0,0,0,0.87)"
    }
});

export default GroupDayStatsItem;