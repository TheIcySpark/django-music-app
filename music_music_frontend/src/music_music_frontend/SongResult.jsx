import React from 'react'
import {
    Box,
    Button, Center, Divider, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
    ModalOverlay, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader,
    PopoverTrigger, Select, SimpleGrid, Stack, Tag, TagLeftIcon, useDisclosure, useToast
} from '@chakra-ui/react'
import { FaPlay } from "react-icons/fa"
import {
    Tr,
    Td
} from '@chakra-ui/react'
import { RiZoomInFill } from 'react-icons/ri'
import { MdAdd, MdAlbum, MdBook, MdDateRange, MdDelete, MdFormatListNumbered, MdPerson, MdSave, MdStyle } from 'react-icons/md'
import BASE from './url'

function SongResult(props) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()

    return (
        <Tr>
            <Td>
                <IconButton
                    icon={<FaPlay />}
                    isRound
                    variant="outline"
                    colorScheme='blue'
                    size="sm"
                    onClick={() => {
                        props.changeSongSrcUrl('')
                        props.changeSongSrcUrl(BASE + "api/song_audio_file/" + props.data.id)
                        props.setCurrentSongData(props.data)
                    }}
                />
            </Td>
            <Td p={1}>
                <Image src={props.data.album[0].image_url} boxSize='50px' borderRadius="full" />
            </Td>
            <Td>
                <Tag colorScheme="blue" p={2}>
                    {props.data.name}
                </Tag>
            </Td>
            <Td >
                <Tag colorScheme="blue" p={2}>
                    {props.data.artist[0].name}
                </Tag>
            </Td>
            <Td>
                <Tag colorScheme="blue" p={2}>
                    {props.data.album[0].name}
                </Tag>
            </Td>
            <Td>
                <IconButton
                    icon={<RiZoomInFill />}
                    isRound
                    variant="outline"
                    colorScheme='blue'
                    size="sm"
                    onClick={onOpen}
                />
                <Modal isOpen={isOpen} onClose={onClose} size='xl' scrollBehavior='inside'>
                    <ModalOverlay backdropFilter='blur(10px) hue-rotate(90deg)' />
                    <ModalContent>
                        <ModalHeader>
                            <Stack direction='row'>
                                <Box>
                                {props.data.name}
                                </Box>
                                <Popover>
                                    <PopoverTrigger>
                                        <Center>
                                            <IconButton
                                                isRound
                                                icon={<MdAdd />}
                                                colorScheme='purple'
                                            />
                                        </Center>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <PopoverArrow />
                                        <PopoverCloseButton />
                                        <PopoverHeader>Select Playlist</PopoverHeader>
                                        <PopoverBody >
                                            <Select id='infoPlaylistSelect' autoFocus>
                                                {props.ownPlaylists.length > 0 && props.ownPlaylists.map((data, index) =>
                                                    <option value={data.id} key={index + 'selectPlaylist'}>{data.name}</option>
                                                )}
                                            </Select>
                                        </PopoverBody>
                                        <PopoverFooter >
                                            <SimpleGrid columns={2} spacing={10}>
                                                <IconButton
                                                    isRound
                                                    icon={<MdDelete />}
                                                    colorScheme='red'
                                                    onClick={() => {
                                                        let playlist_id = document.getElementById('infoPlaylistSelect').value
                                                        fetch(BASE + 'api/delete_song_from_playlist/', {
                                                            method: 'POST',
                                                            headers: {
                                                                'Authorization': localStorage.getItem('Token'),
                                                                'Content-Type': 'application/json'
                                                            },
                                                            body: JSON.stringify({
                                                                playlist_id: playlist_id,
                                                                song_id: props.data.id
                                                            })
                                                        }).then((response) => {
                                                            if (response.status >= 200 || response.status <= 200) {
                                                                toast({
                                                                    title: 'Deleted',
                                                                    description: props.data.name,
                                                                    status: 'info',
                                                                    duration: 3000,
                                                                    position: 'top-right',
                                                                    isClosable: true,
                                                                })
                                                            }
                                                        })
                                                    }}
                                                />
                                                <IconButton
                                                    isRound
                                                    icon={<MdSave />}
                                                    colorScheme='green'
                                                    onClick={() => {
                                                        let playlist_id = document.getElementById('infoPlaylistSelect').value
                                                        fetch(BASE + 'api/add_song_to_playlist/', {
                                                            method: 'POST',
                                                            headers: {
                                                                'Authorization': localStorage.getItem('Token'),
                                                                'Content-Type': 'application/json'
                                                            },
                                                            body: JSON.stringify({
                                                                playlist_id: playlist_id,
                                                                song_id: props.data.id
                                                            })
                                                        }).then((response) => {
                                                            if (response.status >= 200 || response.status <= 200) {
                                                                toast({
                                                                    title: 'Saved',
                                                                    description: props.data.name,
                                                                    status: 'success',
                                                                    duration: 3000,
                                                                    position: 'top-right',
                                                                    isClosable: true,
                                                                })
                                                            }
                                                        })
                                                    }}
                                                />
                                            </SimpleGrid>

                                        </PopoverFooter>
                                    </PopoverContent>
                                </Popover>
                            </Stack>
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Stack direction='row' p={1}>
                                <Image
                                    boxSize='200px'
                                    objectFit='cover'
                                    src={props.data.album[0].image_url}
                                    borderRadius
                                />
                                <Divider orientation='vertical' />
                                <Stack direction='column' w='100%'>
                                    <Tag p={1} colorScheme='cyan' variant='solid' size='lg'>
                                        <TagLeftIcon as={MdAlbum} />
                                        Album: {props.data.album[0].name}
                                    </Tag>
                                    <Tag p={1} colorScheme='blue' variant='solid'>
                                        <TagLeftIcon as={MdDateRange} />
                                        Release date: {props.data.album[0].release_date}
                                    </Tag>
                                    <Tag p={1} colorScheme='blue' variant='solid'>
                                        <TagLeftIcon as={MdFormatListNumbered} />
                                        Total songs: {props.data.album[0].total_songs}
                                    </Tag>
                                    <Tag p={1} colorScheme='blue' variant='solid'>
                                        <TagLeftIcon as={MdBook} />
                                        Type: {props.data.album[0].type}
                                    </Tag>
                                </Stack>
                            </Stack>
                            <Divider />
                            {props.data.artist.length > 0 && props.data.artist.map((data, index) =>
                                <Stack direction='row' p={1} key={index + 'artistData'}>
                                    <Image
                                        boxSize='200px'
                                        objectFit='cover'
                                        src={data.image_url}
                                        borderRadius
                                    />
                                    <Divider orientation='vertical' />
                                    <Stack direction='column' w='100%'>
                                        <Tag p={1} colorScheme='red' variant='solid' size='lg'>
                                            <TagLeftIcon as={MdPerson} />
                                            Artist: {data.name}
                                        </Tag>
                                        {data.genres.length > 0 && data.genres.map((genresData, index) =>
                                            <Tag p={1} colorScheme='blue' variant='solid' key={index + 'genresData'}>
                                                <TagLeftIcon as={MdStyle} />
                                                {genresData.genre}
                                            </Tag>
                                        )}
                                    </Stack>
                                </Stack>
                            )}


                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme='red' mr={3} onClick={onClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Td>
        </Tr>
    )
}

export default SongResult