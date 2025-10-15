import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen() {
    const [rut, setRut] = useState('');
    const [password, setPassword] = useState('');
    const { setIsLoggedIn } = useContext(AuthContext);

    const handleLogin = async () => {
        if (!rut || !password) {
            Alert.alert('Por favor, completa todos los campos');
            return;
        }

        try {
            const res = await axios.post('http://192.168.1.9:4000/api/users/login', {
                rut,
                password,
            });

            const token = res.data.token;
            await AsyncStorage.setItem('token', token);

            setIsLoggedIn(true); // Mostrar pestaña Reporte

            Alert.alert('Login exitoso', `Bienvenido ${res.data.user.nombres}`);
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                Alert.alert('Credenciales incorrectas');
            } else {
                Alert.alert('Error de conexión', 'No se pudo conectar con el servidor');
            }
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="RUT"
                value={rut}
                onChangeText={setRut}
                style={styles.input}
                autoCapitalize="none"
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            <Button title="Iniciar Sesión" onPress={handleLogin} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
    },
});
