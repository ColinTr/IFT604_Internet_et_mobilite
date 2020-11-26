import React from "react";
import axiosHelper from "../../config/AxiosHelper";
import SpotifyPlayer from 'react-spotify-player';
import * as $ from "jquery"

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            token: null,
            featuredPlaylistUri: "null"
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.input = React.createRef();
    }

    componentDidMount() {
        this.getFeaturedPlaylistsOfCountry("FR")
    }

    getFeaturedPlaylistsOfCountry(country_code) {
        let that = this;
        axiosHelper.createGetAxiosRequest("spotify/featuredPlaylists/" + country_code)
            .then(response => {
                that.setState({featuredPlaylistUri: response.playlists.items[0].uri})
            })
            .catch(err => {
                console.log(err);
            });
    }

    handleSubmit(event) {
        this.getFeaturedPlaylistsOfCountry(this.input.current.value)
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
                <input type="text" placeholder="country code" ref={this.input}/>
                <button onClick={this.handleSubmit}>Changer</button>
                <SpotifyPlayer
                    uri={this.state.featuredPlaylistUri}
                    size={size}
                    view={view}
                    theme={theme}
                />
            </div>
        );
    }
}

export default Home;
