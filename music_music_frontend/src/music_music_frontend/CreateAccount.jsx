import React from 'react'
import logo from './static/logo.svg'
import {
    ChakraProvider,
    Container,
    Input,
    Center,
    Image,
    Text,
    Button,
    Tag,
    Link,
    useToast
} from '@chakra-ui/react'
import BASE from './url'

function CreateAccount(props) {
    const toast = useToast()

    function postCreateAccount() {
        let username = document.getElementById('usernameInput').value
        let email = document.getElementById('emailInput').value
        let password = document.getElementById('passwordInput').value
        let passwordConfirm = document.getElementById('passwordConfirmInput').value
        if (password !== passwordConfirm) {
            toast({
                title: 'Password error',
                description: "Password not match",
                status: 'error',
                duration: 3000,
                position: 'top-right',
                isClosable: true,
            })
            return
        }
        fetch(BASE+'api/create_account/', {
            method: 'POST',
            body: JSON.stringify({
                username: username,
                password: password,
                email: email,
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            if (response.status !== 200) {
                toast({
                    title: 'Account creation error',
                    description: "Username or password error",
                    status: 'error',
                    duration: 3000,
                    position: 'top-right',
                    isClosable: true,
                })
                return
            }
            props.setCreateAccount(false)
        })

    }

    return (
        <ChakraProvider resetCSS>
            <Container p={5}>
                <Center>
                    <Image src={logo} height="200px" width="200px" />
                </Center>
                <Center>
                    <Text>Create Account</Text>
                </Center>
                <Tag mt={2} mb={1}>Username</Tag>
                <Input variant="filled" id='usernameInput' />
                <Tag mt={2} mb={1}>Email</Tag>
                <Input variant="filled" id='emailInput' />
                <Tag mt={2} mb={1}>Password</Tag>
                <Input type={"password"} variant="filled" mt={1} id='passwordInput' />
                <Tag mt={2} mb={1}>Confirm password</Tag>
                <Input type={"password"} variant="filled" mt={1} id='passwordConfirmInput' />
                <Center>
                    <Button
                        mt={2}
                        variant="solid"
                        size="md"
                        onClick={() => postCreateAccount()}
                    >
                        Create account
                    </Button>
                </Center>
                <Link onClick={() => props.setCreateAccount(false)}>Already have an account?</Link>
            </Container>
        </ChakraProvider>
    )
}

export default CreateAccount