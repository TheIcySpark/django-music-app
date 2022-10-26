import { Button, FormControl, FormLabel, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { BsMusicNoteList } from 'react-icons/bs'
import { MdLibraryMusic, MdPlaylistAdd } from 'react-icons/md'
import { RiLogoutCircleRFill } from 'react-icons/ri'
import logo from './static/logo.svg'
import BASE from './url'

function PlayerMenu(props) {
    const [menuButtonsColors, setMenuButtonsColors] = React.useState(['green'])

    const { isOpen: isNewPlaylistOpen, onOpen: onNewPlaylistOpen, onClose: onNewPlaylistClose } = useDisclosure()
    const { isOpen: isDeletePlaylistOpen, onOpen: onDeletePlaylistOpen, onClose: onDeletePlaylistClose } = useDisclosure()
    const toast = useToast()

    const [playlistSelectedToUpdate, setPlaylistSelectedToUpdate] = React.useState('')

    function logout() {
        fetch(BASE + 'api/auth/token/logout', {
            method: 'POST',
            body: JSON.stringify({
                Token: localStorage.getItem('Token').split()[1]
            }),
            headers: {
                'Authorization': localStorage.getItem('Token')
            }
        })
        localStorage.removeItem('Token')
        props.setIsLoggedIn(false)
    }

    function createPlaylist() {
        let playlistName = document.getElementById('newPlaylistName').value
        fetch(BASE + 'api/playlists/', {
            method: 'POST',
            body: JSON.stringify({
                name: playlistName,
                public: 0
            }),
            headers: {
                'Authorization': localStorage.getItem('Token'),
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            props.fetchOwnPlaylists()
            onNewPlaylistClose()
        })
    }

    function highlighSelectedButton(i) {
        let x = []
        x[i] = 'green'
        setMenuButtonsColors(x)
    }

    useEffect(() => {
        props.fetchSongs(BASE + "api/songs/")
        props.fetchOwnPlaylists()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <Image src={logo} rounded />
            <Button
                mt={1}
                leftIcon={<MdLibraryMusic />}
                w="100%"
                colorScheme={menuButtonsColors[0]}
                onClick={() => {
                    props.fetchSongs(BASE + "api/songs/")
                    highlighSelectedButton(0)
                }}
            >
                All songs
            </Button>
            {props.ownPlaylists.length > 0 && props.ownPlaylists.map((data, index) =>
                <Button
                    leftIcon={<BsMusicNoteList />}
                    w="100%"
                    mt={1}
                    colorScheme={menuButtonsColors[index + 1]}
                    key={index + 'ownPlaylists'}
                    onAuxClick={(event) => {
                        event.preventDefault()
                        onDeletePlaylistOpen()
                        setPlaylistSelectedToUpdate(data)
                    }}
                    onClick={() => {
                        highlighSelectedButton(index + 1)
                        props.fetchSongs(BASE + "api/playlists/" + data.id + '/')
                    }}
                >
                    {data.name}
                </Button>
            )}
            <Modal
                isOpen={isDeletePlaylistOpen}
                onClose={onDeletePlaylistClose}
            >
                <ModalOverlay backdropFilter='blur(10px) hue-rotate(90deg)' />
                <ModalContent>
                    <ModalHeader>Edit playlist</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel>Playlist name</FormLabel>
                            <Input defaultValue={playlistSelectedToUpdate.name} id='updatePlaylistName' />
                        </FormControl>

                        <FormControl mt={4}>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='green' mr={3} onClick={() => {
                            let playlistName = document.getElementById('updatePlaylistName').value
                            fetch(BASE + 'api/playlists/' + playlistSelectedToUpdate.id + '/', {
                                method: 'PATCH',
                                body: JSON.stringify({
                                    name: playlistName,
                                    public: 0
                                }),
                                headers: {
                                    'Authorization': localStorage.getItem('Token'),
                                    'Content-Type': 'application/json'
                                }
                            }).then((response) => {
                                if (response.status >= 200 || response.status <= 200) {
                                    onDeletePlaylistClose()
                                    props.fetchOwnPlaylists()
                                    props.fetchSongs(BASE + "api/songs/")
                                    highlighSelectedButton(0)
                                    toast({
                                        title: 'Updated',
                                        description: "Playlist updated",
                                        status: 'success',
                                        duration: 3000,
                                        position: 'top-right',
                                        isClosable: true,
                                    })
                                }
                            })
                        }}>
                            Update
                        </Button>
                        <Button
                            colorScheme='red'
                            onClick={() => {
                                fetch(BASE + 'api/playlists/' + playlistSelectedToUpdate.id + '/', {
                                    method: 'DELETE',
                                    headers: {
                                        'Authorization': localStorage.getItem('Token'),
                                        'Content-Type': 'application/json'
                                    }
                                }).then((response) => {
                                    if (response.status >= 200 || response.status <= 200) {
                                        props.fetchOwnPlaylists()
                                        props.fetchSongs(BASE + "api/songs/")
                                        highlighSelectedButton(0)
                                        toast({
                                            title: 'Deleted',
                                            description: "Playlist deleted",
                                            status: 'warning',
                                            duration: 3000,
                                            position: 'top-right',
                                            isClosable: true,
                                        })
                                        onDeletePlaylistClose()

                                    }
                                })
                            }}>
                            Delete playlist
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Button
                mt={1}
                leftIcon={<MdPlaylistAdd />}
                w="100%"
                colorScheme='blue'
                onClick={onNewPlaylistOpen}
            >
                New playlist
            </Button>
            <Modal
                isOpen={isNewPlaylistOpen}
                onClose={onNewPlaylistClose}
            >
                <ModalOverlay backdropFilter='blur(10px) hue-rotate(90deg)' />
                <ModalContent>
                    <ModalHeader>Create new playlist</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel>Playlist name</FormLabel>
                            <Input id='newPlaylistName' />
                        </FormControl>

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={() => {
                            toast({
                                title: 'Created',
                                description: "New playlist created",
                                status: 'success',
                                duration: 3000,
                                position: 'top-right',
                                isClosable: true,
                            })
                            createPlaylist()
                        }}>
                            Save
                        </Button>
                        <Button onClick={onNewPlaylistClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Button
                mt={1}
                leftIcon={<RiLogoutCircleRFill />}
                w="100%"
                colorScheme="red"
                onClick={() => logout()}
            >
                Logout
            </Button>
        </>
    )
}

export default PlayerMenu