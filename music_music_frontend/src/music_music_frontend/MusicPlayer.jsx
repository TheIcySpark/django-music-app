import React, { useEffect } from 'react'
import {
    Grid,
    GridItem,
    ChakraProvider,
    InputGroup,
    InputLeftElement,
    Input,
    Thead,
    Tr,
    Th,
    Tbody,
    Table,
    IconButton,
    Center,
} from '@chakra-ui/react'
import { MdSearch } from "react-icons/md"
import { GrFormPreviousLink, GrFormNextLink } from "react-icons/gr"
import SongResult from './SongResult.jsx'
import AudioPlayer from './AudioPlayer.jsx'
import PlayerMenu from './PlayerMenu.jsx'
import BASE from './url'

function MusicPlayer(props) {
    const [songResults, setSongResults] = React.useState([])
    const [nextPageSongResults, setNextPageSongResults] = React.useState('')
    const [previousPageSongResults, setPreviousPageSongResults] = React.useState('')
    const [songsSrcQueue, setSongsSrcQueue] = React.useState([])
    const [songSrcUrl, setSongSrcUrl] = React.useState('')
    const [currentSongData, setCurrentSongData] = React.useState(Object)
    const [ownPlaylists, setOwnPlaylists] = React.useState([])
    const [playingPlaylistUrl, setPlayingPlaylistUrl] = React.useState('')
    const [currentPlaylistUrl, setCurrentPlaylistUrl] = React.useState('')

    function changeSongSrcUrl(url) {
        setSongSrcUrl(url)
        setPlayingPlaylistUrl(currentPlaylistUrl)
    }

    function fetchSongs(url, query='') {
        fetch(url + query)
            .then((response) => response.json())
            .then((data) => {
                setSongResults(data.results)
                setNextPageSongResults(data.next)
                setPreviousPageSongResults(data.previous)
                setCurrentPlaylistUrl(url)
            })
    }

    function fetchOwnPlaylists() {
        fetch(BASE + 'api/playlists/', {
            method: 'GET',
            headers: {
                'Authorization': localStorage.getItem('Token'),
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            return response.json()
        }).then((response) => {
            setOwnPlaylists(response)
        })
    }

    useEffect(() => {
        if (playingPlaylistUrl === '') {
            return
        }
        const fetchData = async () => {
            let songsSrcs = []
            let first_url = playingPlaylistUrl
            await fetch(playingPlaylistUrl)
                .then((data) => data.json())
                .then(async (data) => {
                    while (data.previous !== null) {
                        first_url = data.previous
                        const new_data = await fetch(data.previous)
                            .then((response) => response.json())
                            .then((response) => {
                                return response
                            })
                        data = new_data
                    }

                    const urls = [first_url]
                    while (data.next !== null) {
                        urls.push(data.next)
                        const new_data = await fetch(data.next)
                            .then((response) => {
                                return response.json()
                            })
                            .then((response) => {
                                return response
                            })
                        data = new_data
                    }
                    let i = 0
                    while (i <= urls.length - 1) {
                        const response = await fetch(urls[i])
                            .then((response) => response.json())
                            .then((data) => {
                                return data.results
                            })
                        songsSrcs = songsSrcs.concat(response)
                        i += 1
                    }
                    setSongsSrcQueue(songsSrcs)
                })
        }
        fetchData()
    }, [playingPlaylistUrl])

    return (
        <ChakraProvider>
            <Grid
                h='100vh'
                p={1}
                templateRows='repeat(10, 1fr)'
                templateColumns='repeat(6, 1fr)'
                gap={2}
            >
                <GridItem rowSpan={9} colSpan={1} overflowY="auto"
                    onContextMenu={(event) => {
                        event.preventDefault()
                    }}
                >
                    <PlayerMenu
                        fetchOwnPlaylists={fetchOwnPlaylists}
                        ownPlaylists={ownPlaylists}
                        fetchSongs={fetchSongs}
                        setIsLoggedIn={props.setIsLoggedIn}
                    />
                </GridItem>

                <GridItem rowSpan={9} colSpan={5} overflowY="auto" >
                    <InputGroup w="100%">
                        <InputLeftElement
                            children={<MdSearch />}
                        />
                        <Input
                            placeholder='Search song'
                            onChange={(event) => {
                                let playlistUrl = currentPlaylistUrl.split('?')[0]
                                fetchSongs(playlistUrl,'?name=' + event.target.value)
                            }}
                        />
                    </InputGroup>
                    {songResults.length > 0 &&
                        <>
                            <Table variant="striped" size='lg'>
                                <Thead>
                                    <Tr>
                                        <Th></Th>
                                        <Th></Th>
                                        <Th>Song</Th>
                                        <Th>Artist</Th>
                                        <Th>Album</Th>
                                        <Th></Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {songResults.length > 0 && songResults.map((data, index) =>
                                        <SongResult
                                            changeSongSrcUrl={changeSongSrcUrl}
                                            setCurrentSongData={setCurrentSongData}
                                            ownPlaylists={ownPlaylists}
                                            data={data}
                                            key={index + 'songResults'}
                                        />
                                    )}
                                </Tbody>
                            </Table>
                            <Center m={2}>
                                <IconButton
                                    disabled={previousPageSongResults == null}
                                    value={previousPageSongResults}
                                    mr={1}
                                    colorScheme='blue'
                                    aria-label='Search database'
                                    variant="solid"
                                    size="lg"
                                    icon={<GrFormPreviousLink />}
                                    onClick={() => fetchSongs(previousPageSongResults)}
                                />
                                <IconButton
                                    value={nextPageSongResults}
                                    disabled={nextPageSongResults == null}
                                    colorScheme='blue'
                                    aria-label='Search database'
                                    variant="solid"
                                    size="lg"
                                    icon={<GrFormNextLink />}
                                    onClick={() => fetchSongs(nextPageSongResults)}
                                />
                            </Center>
                        </>
                    }
                </GridItem>
                <GridItem rowSpan={1} colSpan={6}>
                    <AudioPlayer
                        songSrcUrl={songSrcUrl}
                        setSongSrcUrl={setSongSrcUrl}
                        currentSongData={currentSongData}
                        setCurrentSongData={setCurrentSongData}
                        songsSrcQueue={songsSrcQueue}
                    />

                </GridItem>
            </Grid>
        </ChakraProvider >
    )
}

export default MusicPlayer