import React, { useEffect } from "react";
import EStyleSheet from "react-native-extended-stylesheet";
import { StyleSheet, TouchableHighlight, View } from "react-native";
import { Text } from "@ui-kitten/components";
import { Spinner } from "@ui-kitten/components";
import { io } from "socket.io-client";
import * as SecureStore from "expo-secure-store";
import * as Device from "expo-device";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faWarehouse } from "@fortawesome/free-solid-svg-icons";

const GateButton = (props) => {
	const { style, disabled, onPress } = props;

	return (
		<View style={style}>
			<TouchableHighlight onPress={onPress} underlayColor={"#50555c"} style={{ borderRadius: 15 }}>
				<View style={[styles.button, styles.shadowProp]}>
					<FontAwesomeIcon size={32} icon={faWarehouse} style={[styles.icon, disabled && styles.disabled]} />
					<View style={styles.secondLine}>
						{disabled && <Spinner size="small" />}
						<Text style={disabled && [styles.disabled, styles.spinner]}>{disabled ? "Otwieram" : props.children}</Text>
					</View>
				</View>
			</TouchableHighlight>
		</View>
	);
};

export default function Controller() {
	const [buttons, setButtons] = React.useState([
		{ status: false, value: "Przednia brama", type: "gate", identifier: "front" },
		{ status: false, value: "Tylnia brama", type: "gate", identifier: "back" },
		{ status: false, value: "Brama test", type: "door", identifier: "test" },
	]);
	const buttonsRef = React.useRef(buttons);
	const [id, setId] = React.useState("");

	const setHeaders = async () => {
		setId(await SecureStore.getItemAsync("secure_deviceid"));
	};

	const call = async (side) => {
		let id = await SecureStore.getItemAsync("secure_deviceid");
		let object = { user_mac: id, gate: side };

		const socket = await io("http://192.168.1.231:4001", {
			"X-Address": id,
			"X-Name": Device.modelName,
		});

		socket.emit("open", JSON.stringify(object));

		setTimeout(() => {
			socket.disconnect();
		}, 150);
	};

	const handleClick = async (button) => {
		let newButton = buttonsRef.current;
		await call(button.identifier);

		let id = buttons.indexOf(button);

		newButton[id] = { ...button, status: true, value: "Otwieram" };

		setButtons([...newButton]);

		setTimeout(() => {
			let inButton = buttonsRef.current;
			inButton[id] = { ...button };
			setButtons([...inButton]);
		}, 5000);
	};

	useEffect(() => {
		setHeaders();

		return () => {
			if (socket) socket.disconnect();
		};
	}, []);

	return (
		<View style={{ margin: 15, display: "flex", justifyContent: "center", alignItems: "center" }}>
			<Text category={"h4"} style={{ width: "100%" }}>
				Kontroler urządzeń
			</Text>
			<View style={styles.container}>
				{buttons?.map((el) => (
					<GateButton
						key={`controller-${buttons.indexOf(el)}`}
						disabled={el.status}
						onPress={() => handleClick(el)}
						style={[styles.nnth_buttons, buttons.indexOf(el) % 2 !== 0 && styles.nth_buttons]}
					>
						{el.value}
					</GateButton>
				))}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		display: "flex",
		flexDirection: "row",
		marginHorizontal: 15,
		width: 325,
		flexWrap: "wrap",
	},
	nth_buttons: {
		marginLeft: 25,
	},
	nnth_buttons: {
		marginTop: 25,
	},
	secondLine: {
		display: "flex",
		flexDirection: "row",
	},
	spinner: {
		marginLeft: 10,
	},
	button: {
		color: "#f1f1f1",
		backgroundColor: "#40444b",
		borderColor: "transparent",
		borderRadius: 15,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		padding: 15,
		width: 150,
	},
	disabled: {
		color: "#656d7d",
	},
	lastButton: {
		marginTop: 25,
	},
	shadowProp: {
		shadowColor: "#000000",
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowRadius: 5,
		shadowOpacity: 0.25,
		elevation: 5,
	},
	indicator: {
		justifyContent: "center",
		alignItems: "center",
	},
	icon: {
		marginBottom: 10,
		color: "#CFFDF7",
	},
});
