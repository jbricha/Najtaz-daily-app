import React from 'react'
import { View, Text, Image, StyleSheet, FlatList, ActivityIndicator } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import GroupDayStatsItem from './GroupDayStatsItem'
import { getDayStatsByGroup } from '../Models/NajtazApi'
import cloneDeep from 'lodash/cloneDeep';
import { useFocusEffect } from '@react-navigation/native';

class GroupActivity extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            fromIndex: 1, // Curseur pour connaître les éléments à charger prochainement
            totalElements: 0, // Total des éléments, on suppose qu'il y au moins un élément au premierer appel
            groupDayStatsList: [],
            groupParticipants: [],
            isLoading: true,
            updateListNextGoBack : false
        }
        
    }

    componentDidMount() {
        this._loadGroupDayStatsList()
    }
    _loadGroupDayStatsList() {
        this.setState({ isLoading: true,
                        updateListNextGoBack: false })
        getDayStatsByGroup(
            this.props.route.params.loggedUser.userGroupName,
            this.state.fromIndex,
            this.props.route.params.loggedUser.token)
            .then(data => {
                if (data && data.status == "success") {
                    if (data.response.groupParticipants) { // Premier chargement et après ajout de groupDayStatsList >
                        // On ramène la liste des participants du groupe au fromIndex=1
                        this.setState({
                            fromIndex: data.response.cursor,
                            totalElements: data.response.totalElements,
                            groupDayStatsList: data.response.results,
                            groupParticipants: data.response.groupParticipants,
                            isLoading: false,
                            updateListNextGoBack: false
                        })
                    } else { // Lazy loading > les participants du groupe sont déjà chargés 
                        this.setState({
                            fromIndex: data.response.cursor,
                            totalElements: data.response.totalElements,
                            groupDayStatsList: [...this.state.groupDayStatsList, ...data.response.results],
                            isLoading: false,
                            updateListNextGoBack: false
                        })
                    }
                } else {
                    Alert.alert("Erreur de chargement des saisie de votre groupe")
                }
            })
    }

    _loadMoreDayStats() {
        if (this.state.fromIndex <= this.state.totalElements && !this.state.isLoading) {
            this._loadGroupDayStatsList()
        }
    }

    _navigateToUpdateGroupDayParticipations = (dayStats) => {
        this.props.navigation.
            navigate("UpdateGroupDayParticipations",
                {
                    dayStats: dayStats,
                    groupParticipants: this.state.groupParticipants,
                    token: this.props.route.params.loggedUser.token,
                })
    }
    _navigateToAddNewGroupDayParticipations() {
        this.props.navigation.navigate("AddNewGroupDayParticipations", {
            groupName: this.props.route.params.loggedUser.userGroupName,
            groupParticipants: this.state.groupParticipants,
            token: this.props.route.params.loggedUser.token
        })
    }

    static getDerivedStateFromProps(props, state) {

        var newDayStatsList = []

        if (props.route.params.comingFrom == "updateDayStats" && state.updateListNextGoBack) {
            newDayStatsList = GroupActivity._getDayStatsListAfterUpdatedElement(
                props.route.params.updatedDayStats,
                state.groupDayStatsList)
            return { 
                groupDayStatsList: newDayStatsList,
                updateListNextGoBack : true }

        } else if (props.route.params.comingFrom == "saveNewDayStats" && state.updateListNextGoBack) {
            newDayStatsList = GroupActivity._getDayStatsListAfterSavedNewElement(
                props.route.params.savedDayStats,
                state.groupDayStatsList)
            return {
                fromIndex: state.fromIndex + 1,
                totalElements: state.totalElements + 1,
                groupDayStatsList: newDayStatsList,
                updateListNextGoBack : true }
        }
        return {updateListNextGoBack : true}
    }

    static _getDayStatsListAfterUpdatedElement(updatedDayStats, groupDayStatsList) {
        const tempData = cloneDeep(groupDayStatsList)
        var indexToUpdate = tempData.findIndex((d) => d._id == updatedDayStats._id)
        tempData[indexToUpdate] = updatedDayStats
        return tempData
    }
    static _getDayStatsListAfterSavedNewElement(savedDayStats, groupDayStatsList) {
        const tempData = cloneDeep(groupDayStatsList)
        var indexToAdd = tempData.findIndex((d) => d.day < savedDayStats.day)
        tempData.splice(indexToAdd, 0, savedDayStats)
        return tempData
    }
    renderFooter = () => {
        //it will show indicator at the bottom of the list when data is loading otherwise it returns null
        if (!this.state.isLoading) return null;
        return (
            <ActivityIndicator
                style={{ color: '#000' }}
            />
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.groupDayStatsList}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={
                        ({ item }) =>
                            <GroupDayStatsItem
                                dayStats={item}
                                displayDetailForDayParticipations={this._navigateToUpdateGroupDayParticipations} />
                    }
                    onEndReachedThreshold={1}
                    onEndReached={() => {
                        this._loadMoreDayStats()
                    }}
                    ListFooterComponent={this.renderFooter.bind(this)}
                />

                <View style={styles.addButtonBox}>
                    <TouchableOpacity style={styles.addButton}
                        onPress={() => this._navigateToAddNewGroupDayParticipations()}>
                        <Image style={styles.addImage}
                            source={require('../assets/ic_add.png')} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        // alignItems: 'center',
        // justifyContent: 'center'
    },
    addButtonBox: {
        position: 'absolute',
        width: 60,
        height: 60,
        right: 30,
        bottom: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    addButton: {
        width: 60,
        height: 60,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30
    },
    addImage: {
        width: 30,
        height: 30
    }
});

export default GroupActivity