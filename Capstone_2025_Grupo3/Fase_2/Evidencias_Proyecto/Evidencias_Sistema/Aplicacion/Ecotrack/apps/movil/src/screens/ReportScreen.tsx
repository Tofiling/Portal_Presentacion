import React, { useState, useContext } from 'react';
import { View, TextInput, Button, ScrollView, Switch, Text, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

type PersonaKeys = 'nombre_completo' | 'rut' | 'fecha_nacimiento' | 'direccion' | 'comuna' | 'telefono' | 'email';
type VehiculoKeys = 'marca' | 'modelo' | 'anio' | 'patente' | 'numero_motor' | 'vin_chasis';

export default function ReportScreen() {
    const { setIsLoggedIn } = useContext(AuthContext);

    const [formId] = useState('fid-declaracion-siniestro');
    const [origen] = useState('web');

    const getFechaHoy = () => {
        const hoy = new Date();
        const dia = String(hoy.getDate()).padStart(2, '0');
        const mes = String(hoy.getMonth() + 1).padStart(2, '0');
        const anio = hoy.getFullYear();
        return `${anio}-${mes}-${dia}`;
    };

    const getHoraActual = () => {
        const ahora = new Date();
        const horas = String(ahora.getHours()).padStart(2, '0');
        const minutos = String(ahora.getMinutes()).padStart(2, '0');
        return `${horas}:${minutos}`;
    };

    const [antecedentes, setAntecedentes] = useState({
        fecha_accidente: getFechaHoy(),
        hora_accidente: getHoraActual(),
        lugar_accidente: '',
        comuna: '',
        concurrio_carabineros: null as boolean | null,
        se_tomo_alcoholemia: null as boolean | null,
        lesionados: null as boolean | null,
        danos_materiales: null as boolean | null,
        numero_vehiculos_involucrados: 0,
        vehiculos_distintos_de_a_y_b: null as boolean | null,
        objetos_distintos_al_vehiculo: null as boolean | null
    });

    const [vehiculoA, setVehiculoA] = useState({
        persona: { nombre_completo: '', rut: '', fecha_nacimiento: '', direccion: '', comuna: '', telefono: '', email: '' },
        vehiculo: { marca: '', modelo: '', anio: null, patente: '', numero_motor: '', vin_chasis: '' },
        aseguradora: ''
    });

    const [vehiculosB, setVehiculosB] = useState<Array<any>>([]);

    const [declaracion, setDeclaracion] = useState({
        entendido_procedimiento: null as boolean | null,
        acepta_declaracion_jurada: null as boolean | null,
        lugar_firma: '',
        fecha_firma: ''
    });

    const [adjuntos, setAdjuntos] = useState({ fotos: [] as string[], croquis: '', otros: [] as string[] });

    // Actualiza vehículos B según número
    const updateVehiculosB = (num: number) => {
        if (num <= 0) {
            setVehiculosB([]);
            return;
        }
        const newVehiculos: Array<any> = [];
        for (let i = 0; i < num; i++) {
            newVehiculos.push({
                persona: { nombre_completo: '', rut: '', fecha_nacimiento: '', direccion: '', comuna: '', telefono: '', email: '' },
                vehiculo: { marca: '', modelo: '', anio: null, patente: '', numero_motor: '', vin_chasis: '' },
                aseguradora: ''
            });
        }
        setVehiculosB(newVehiculos);
    };

    // Manejo cambios en Vehículo B
    const handleVehiculoBChange = (
        index: number,
        field: 'persona' | 'vehiculo' | 'aseguradora',
        key: PersonaKeys | VehiculoKeys | 'aseguradora',
        value: string | number
    ) => {
        const updated = [...vehiculosB];
        if (field === 'persona' || field === 'vehiculo') {
            updated[index][field][key] = value;
        } else if (field === 'aseguradora') {
            updated[index].aseguradora = value;
        }
        setVehiculosB(updated);
    };

    const handleReport = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('Debes iniciar sesión primero');
                return;
            }

            const payload = {
                formId,
                metadata: { createdAt: new Date().toISOString(), version: '1.0.0', origen },
                antecedentes_siniestro: antecedentes,
                vehiculo_a: vehiculoA,
                vehiculos_b: vehiculosB,
                declaracion,
                firmas: { vehiculo_a: '', vehiculo_b: '' },
                adjuntos
            };

            await axios.post('http://localhost:4000/api/incidents', payload, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
            });

            Alert.alert('Reporte enviado con éxito');
        } catch (error) {
            console.log(error);
            Alert.alert('Error al enviar reporte');
        }
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        setIsLoggedIn(false);
        Alert.alert('Sesión cerrada');
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.sectionTitle}>Antecedentes del Siniestro</Text>
            <TextInput placeholder="Fecha accidente" value={antecedentes.fecha_accidente} style={styles.input} editable={false} />
            <TextInput placeholder="Hora accidente" value={antecedentes.hora_accidente} style={styles.input} editable={false} />
            <Text style={styles.label}>Lugar accidente</Text>
            <TextInput value={antecedentes.lugar_accidente} onChangeText={text => setAntecedentes({ ...antecedentes, lugar_accidente: text })} style={styles.input} />
            <Text style={styles.label}>Comuna</Text>
            <TextInput value={antecedentes.comuna} onChangeText={text => setAntecedentes({ ...antecedentes, comuna: text })} style={styles.input} />

            <View style={styles.switchContainer}>
                <Text>Concurrio Carabineros</Text>
                <Switch value={!!antecedentes.concurrio_carabineros} onValueChange={val => setAntecedentes({ ...antecedentes, concurrio_carabineros: val })} />
            </View>
            <View style={styles.switchContainer}>
                <Text>Se tomó alcoholemia</Text>
                <Switch value={!!antecedentes.se_tomo_alcoholemia} onValueChange={val => setAntecedentes({ ...antecedentes, se_tomo_alcoholemia: val })} />
            </View>
            <View style={styles.switchContainer}>
                <Text>Hubo lesionados</Text>
                <Switch value={!!antecedentes.lesionados} onValueChange={val => setAntecedentes({ ...antecedentes, lesionados: val })} />
            </View>
            <View style={styles.switchContainer}>
                <Text>Daños materiales</Text>
                <Switch value={!!antecedentes.danos_materiales} onValueChange={val => setAntecedentes({ ...antecedentes, danos_materiales: val })} />
            </View>

            <Text style={styles.label}>Número vehículos involucrados</Text>
            <TextInput value={String(antecedentes.numero_vehiculos_involucrados)} keyboardType="number-pad" onChangeText={text => { const num = Number(text); setAntecedentes({ ...antecedentes, numero_vehiculos_involucrados: num }); updateVehiculosB(num); }} style={styles.input} />

            <View style={styles.switchContainer}>
                <Text>Vehículos distintos de A y B</Text>
                <Switch value={!!antecedentes.vehiculos_distintos_de_a_y_b} onValueChange={val => setAntecedentes({ ...antecedentes, vehiculos_distintos_de_a_y_b: val })} />
            </View>
            <View style={styles.switchContainer}>
                <Text>Objetos distintos al vehículo</Text>
                <Switch value={!!antecedentes.objetos_distintos_al_vehiculo} onValueChange={val => setAntecedentes({ ...antecedentes, objetos_distintos_al_vehiculo: val })} />
            </View>

            <Text style={styles.sectionTitle}>Vehículo A</Text>
            {Object.keys(vehiculoA.persona).map((key: string) => (
                <TextInput key={key} placeholder={key} value={vehiculoA.persona[key as PersonaKeys]} onChangeText={text => setVehiculoA({ ...vehiculoA, persona: { ...vehiculoA.persona, [key]: text } })} style={styles.input} />
            ))}
            {Object.keys(vehiculoA.vehiculo).map((key: string) => (
                <TextInput key={key} placeholder={key} value={vehiculoA.vehiculo[key as VehiculoKeys] ? String(vehiculoA.vehiculo[key as VehiculoKeys]) : ''} onChangeText={text => setVehiculoA({ ...vehiculoA, vehiculo: { ...vehiculoA.vehiculo, [key]: key === 'anio' ? Number(text) : text } })} style={styles.input} />
            ))}

            {/* Vehículos B dinámicos */}
            {vehiculosB.map((veh, idx) => (
                <View key={idx} style={{ marginTop: 10, borderTopWidth: 1, borderColor: '#ccc', paddingTop: 10 }}>
                    <Text style={{ fontWeight: 'bold' }}>Vehículo B {idx + 1}</Text>
                    {Object.keys(veh.persona).map((key: string) => (
                        <TextInput key={key} placeholder={key} value={veh.persona[key as PersonaKeys]} onChangeText={text => handleVehiculoBChange(idx, 'persona', key as PersonaKeys, text)} style={styles.input} />
                    ))}
                    {Object.keys(veh.vehiculo).map((key: string) => (
                        <TextInput key={key} placeholder={key} value={veh.vehiculo[key as VehiculoKeys] ? String(veh.vehiculo[key as VehiculoKeys]) : ''} onChangeText={text => handleVehiculoBChange(idx, 'vehiculo', key as VehiculoKeys, key === 'anio' ? Number(text) : text)} style={styles.input} />
                    ))}
                    <TextInput placeholder="aseguradora" value={veh.aseguradora} onChangeText={text => handleVehiculoBChange(idx, 'aseguradora', 'aseguradora', text)} style={styles.input} />
                </View>
            ))}

            {/* Declaración */}
            <Text style={styles.sectionTitle}>Declaración</Text>
            <View style={styles.switchContainer}>
                <Text>Entendido procedimiento</Text>
                <Switch value={!!declaracion.entendido_procedimiento} onValueChange={val => setDeclaracion({ ...declaracion, entendido_procedimiento: val })} />
            </View>
            <View style={styles.switchContainer}>
                <Text>Acepta declaración jurada</Text>
                <Switch value={!!declaracion.acepta_declaracion_jurada} onValueChange={val => setDeclaracion({ ...declaracion, acepta_declaracion_jurada: val })} />
            </View>
            <TextInput placeholder="Lugar firma" value={declaracion.lugar_firma} onChangeText={text => setDeclaracion({ ...declaracion, lugar_firma: text })} style={styles.input} />
            <TextInput placeholder="Fecha firma" value={declaracion.fecha_firma} onChangeText={text => setDeclaracion({ ...declaracion, fecha_firma: text })} style={styles.input} />

            <Button title="Enviar Reporte" onPress={handleReport} />
            <View style={{ marginTop: 20 }} />
            <Button title="Cerrar Sesión" color="red" onPress={handleLogout} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 15 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginVertical: 5, borderRadius: 5 },
    switchContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 5 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 15, marginBottom: 5 },
    label: { fontWeight: 'bold', marginTop: 10, marginBottom: 5 }
});
