import moment from 'moment';
import 'moment/src/locale/fr';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { VictoryChart, VictoryLegend, VictoryLine, VictoryScatter } from "victory-native";
import { getTotalPresences } from '../Models/NajtazApi';

const dataExample = [
    {
        "dayName": "LUNDI",
        "presence": 95,
    }, {
        "dayName": "MARDI",
        "presence": 104,
    }, {
        "dayName": "MERCREDI",
        "presence": 92,
    }, {
        "dayName": "JEUDI",
        "presence": 102,
    }, {
        "dayName": "VENDREDI",
        "presence": 90,
    },
]

const dataExample2 = [
    {
        "dayName": "LUNDI",
        "presence": 99,
    }, {
        "dayName": "MARDI",
        "presence": 84,
    }, {
        "dayName": "MERCREDI",
        "presence": 90,
    }, {
        "dayName": "JEUDI",
        "presence": 80,
    }, {
        "dayName": "VENDREDI",
        "presence": 88,
    },
]

const NAJTAZ_START_DATE = new Date(2020, 2, 16, 12, 0, 0).getTime(); // Date de début de Najtaz en dure !

const weekColors = [
    "lightgray",
    "lightcoral",
    "lightskyblue",
    "lightsalmon",
    "mediumorchid",
    "lightpink",
    "lightblue",
    "lightgreen",
    "plum",
    "powderblue",
    "antiquewhite",
    "aqua",
    "bisque",
    "blueviolet",
    "burlywood",
    "cadetblue",
    "chocolate",
    "coral",
    "darkblue",
    "seagreen"]

const weekLegendLabels = [
    "Semaine 0",
    "Semaine 1 : du 16 mars 2020",
    "Semaine 2 : du 16 mars 2020",
    "Semaine 3 : du 23 mars 2020",
    "Semaine 4 : du 30 mars 2020",
    "Semaine 5 : du 6 avril 2020",
    "Semaine 6 : du 13 avril 2020",
    "Semaine 7 : du 27 avril 2020",
    "Semaine 8 : du 4 mai 2020",
    "Semaine 9 : du 11 mai 2020",
    "Semaine 10 : du 18 mai 2020",
    "Semaine 11 : du 25 mai 2020",
    "Semaine 12 : du 1 juin 2020",
    "Semaine 13 : du 8 juin 2020",
    "Semaine 14 : du 15 juin 2020",
    "Semaine 15 : du 22 juin 2020",
    "Semaine 16 : du 29 juin 2020",
    "Semaine 17 : du 6 juillet 2020",
    "Semaine 18 : du 13 juillet 2020",
    "Semaine 19 : du 20 juillet 2020",
    "Semaine 20 : du 27 juillet 2020"
]


class ReportTotalPresences extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            weeksTotalPresences: {}, // Object with week numbers as keys, and 5 days totals array as values
            lastWeekPresences: [],
            weeksLegendList: []
        }
    }

    componentDidMount() {
        this._loadTotalPresencesList()
    }

    _loadTotalPresencesList() {
        this.setState({ isLoading: true })
        getTotalPresences(this.props.route.params.loggedUser.token)
            .then(data => {
                if (data && data.status == "success") {

                    var weekTotalPresences = this._getTotalPresencesGroupedByWeek(data.response.results)
                    var lastPresences = this._getLastWeekTotalPresences(weekTotalPresences)
                    var weekLegendList = this._getLegendDataList(Object.keys(weekTotalPresences))

                    this.setState({
                        isLoading: false,
                        weeksTotalPresences: weekTotalPresences,
                        lastWeekPresences: lastPresences,
                        weeksLegendList: weekLegendList
                    })
                } else {
                    Alert.alert("Erreur de chargement des reportings")
                }
            })
    }

    _getTotalPresencesGroupedByWeek(totalPresencesArray) {

        var result = {}
        for (var i = 0; i < totalPresencesArray.length; i++) {
            var dayTotalPresence = totalPresencesArray[i]
            var weekCountBetween = this._getWeekCountBetween(NAJTAZ_START_DATE, dayTotalPresence["day"])
            dayTotalPresence.dayName = this._getDayWeekName(dayTotalPresence["day"])
            if (!result[weekCountBetween]) {
                result[weekCountBetween] = []
            }
            result[weekCountBetween].unshift(dayTotalPresence);
        }

        return result

    }

    _getWeekCountBetween(d1, d2) {
        var weekCount = parseInt(moment(d2).format('W')) - parseInt(moment(d1).format('W')) + 1
        return weekCount
    }
    _getDayWeekName(d) {
        var fr = moment().locale('fr')
        var momentDay = moment(d);
        return momentDay.format('dddd')
    }

    _getLegendDataList(weekNumberList) {
        var result = weekNumberList.map((weekNumber, index) => {
            return { name: weekLegendLabels[weekNumber], symbol: { fill: weekColors[weekNumber] } }
        })
        return result.reverse()
    }

    _displayWeekLines() {

        var totalPresencesByWeeks = this.state.weeksTotalPresences
        return Object.keys(totalPresencesByWeeks).map((weekNumber, index) => {
            if (!weekNumber) {
                return null
            }
            console.log("weekNumber " + weekNumber)
            console.log(totalPresencesByWeeks[weekNumber])
            return (
                <VictoryLine
                    interpolation="linear" data={totalPresencesByWeeks[weekNumber]}
                    x="dayName" y="presence"
                    key={index}
                    style={{ data: { stroke: weekColors[weekNumber] } }}
                />
            )
        })
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

    _getLastWeekTotalPresences(weeksTotalPresences) {
        console.log(Object.keys(weeksTotalPresences).length)
        var result = weeksTotalPresences[Object.keys(weeksTotalPresences)[Object.keys(weeksTotalPresences).length - 1]]
        console.log(result)
        return result
    }

    render() {

        // return null

        return (
            <View style={styles.container}>

                {this._displayLoading()}

                <VictoryChart polar={false} style={styles.chart} >
                    {this._displayWeekLines()}
                    <VictoryScatter
                        data={this.state.lastWeekPresences}
                        x="dayName" y="presence"
                        key={100}
                        size={5}
                        style={{ data: { fill: weekColors[Object.keys(this.state.weeksTotalPresences).length] } }}
                    />
                    {/* <VictoryLine
                        interpolation="linear" data={dataExample}
                        x="dayName" y="presence"
                        style={{ data: { stroke: "blue" } }}
                    />
                    <VictoryLine
                        interpolation="linear" data={dataExample2}
                        x="dayName" y="presence"
                        style={{ data: { stroke: "red" } }}
                    /> */}
                </VictoryChart>

                <VictoryLegend x={30} y={0}
                    title=""
                    centerTitle
                    orientation="vertical"
                    gutter={10}
                    style={{ border: { stroke: "" }, title: { fontSize: 16 } }}
                    data={this.state.weeksLegendList}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        color: "red"
    },
    chart: {
        width: "95%"
    }
});

export default ReportTotalPresences