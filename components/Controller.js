import React, { useEffect } from "react";
import { StyleSheet, TouchableHighlight, View } from "react-native";
import { Text } from "@ui-kitten/components";
import { Spinner } from "@ui-kitten/components";
import { io } from "socket.io-client";
import * as SecureStore from "expo-secure-store";
import * as Device from "expo-device";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faWarehouse } from "@fortawesome/free-solid-svg-icons";

const GateButton = (props) => {
	const { additionalStyle, disabled, onPress } = props;
	return (
		<View style={additionalStyle}>
			<TouchableHighlight onPress={onPress} underlayColor={"#50555c"} style={{ borderRadius: 15 }}>
				<View style={style.button}>
					<FontAwesomeIcon size={32} icon={faWarehouse} style={[style.icon, disabled && style.disabled]} />
					<View style={style.secondLine}>
						{disabled && <Spinner size="small" />}
						<Text category={"h6"} style={disabled && [style.disabled, style.spinner]}>
							{disabled ? "Otwieram" : props.children}
						</Text>
					</View>
				</View>
			</TouchableHighlight>
		</View>
	);
};

export default function Controller() {
	const [frontButton, setFrontButton] = React.useState({ status: false, value: "Otwórz przód" });
	const [backButton, setBackButton] = React.useState({ status: false, value: "Otwórz tył" });
	const [id, setId] = React.useState("");
	const socket = io("http://192.168.1.231:4001", {
		"X-Address": id,
		"X-Name": Device.modelName,
	});

	if (id === "") {
		socket.on("failed", () => socket.disconnect());
	}

	const setHeaders = async () => {
		setId(await SecureStore.getItemAsync("secure_deviceid"));
	};

	const call = async (side) => {
		let id = await SecureStore.getItemAsync("secure_deviceid");
		let object = { user_mac: id, gate: side };
		socket.emit("open", JSON.stringify(object));
	};

	const handleClick = async (button) => {
		let handler = button === "front" ? setFrontButton : setBackButton;
		let target = button === "front" ? frontButton : backButton;

		await call(button);

		handler({ status: true, value: "Otwieram" });

		setTimeout(() => {
			handler({ status: false, value: target.value });
		}, 5000);
	};

	useEffect(() => {
		setHeaders();

		return () => {
			if (socket) socket.disconnect();
		};
	}, []);

	return (
		<View style={style.container}>
			<GateButton disabled={frontButton.status} onPress={() => handleClick("front")}>
				Otwórz przód
			</GateButton>
			<GateButton disabled={backButton.status} onPress={() => handleClick("back")} additionalStyle={{ marginLeft: 15 }}>
				Otwórz tył
			</GateButton>
		</View>
	);
}

const style = StyleSheet.create({
	container: {
		display: "flex",
		flexDirection: "row",
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
		borderRadius: 15,
		borderColor: "transparent",
		display: "flex",
		padding: 15,
		justifyContent: "center",
		alignItems: "center",
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
		shadowRadius: 10,
		shadowOpacity: 1.0,
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
