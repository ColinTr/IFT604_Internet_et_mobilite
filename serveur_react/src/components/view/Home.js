import React from "react";
import axiosHelper from "../../config/AxiosHelper";
import SpotifyPlayer from 'react-spotify-player';
import * as $ from "jquery"
import {Button} from "reactstrap";

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            token: null,
            featuredPlaylistUri: null,
            inputTextValue: ""
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.update = this.update.bind(this);
    }

    componentDidMount() {
        let that = this;
        let latitude = null;
        let longitude = null;
        navigator.geolocation.getCurrentPosition(function(position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;

            $.ajax({
                url: "http://api.geonames.org/countryCodeJSON?lat=" + latitude + "&lng=" + longitude + "&username=koboard",
                type: "GET",
                success: data => {
                    that.setState({inputTextValue: data.countryCode});
                    that.getFeaturedPlaylistsOfCountry();
                },
                error: message => {
                    console.log(message);
                }
            });
        });
    }

    getFeaturedPlaylistsOfCountry() {
        let that = this;
        axiosHelper.createGetAxiosRequest("spotify/featuredPlaylists/" + this.state.inputTextValue)
            .then(response => {
                that.setState({featuredPlaylistUri: response.playlists.items[0].uri})
            })
            .catch(err => {
                console.log(err);
            });
    }

    /* Change le  */
    handleSubmit(event) {
        this.setState({inputTextValue: event.target.value});
    }

    update() {
        this.getFeaturedPlaylistsOfCountry()
    }

    render() {
        const size = {
            width: '100%',
            height: 300,
        };
        const view = 'list'; // or 'coverart'
        const theme = 'black'; // or 'white'

        return (
            <div>
                <span>Votre code de pays :  </span>
                <input type="text" size="4" placeholder="country code" value={this.state.inputTextValue} onChange={this.handleSubmit}/>
                <Button onClick={this.update}>Update playlist</Button>
                {this.state.featuredPlaylistUri && <SpotifyPlayer
                    uri={this.state.featuredPlaylistUri}
                    size={size}
                    view={view}
                    theme={theme}
                />}

                {!this.state.featuredPlaylistUri && <span><br/>Récupération de la top playlist...</span>}

            </div>
        );
    }
}

export default Home;
