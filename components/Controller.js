import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableHighlight, ScrollView, View, Dimensions } from "react-native";
import { Text } from "@ui-kitten/components";
import { Spinner } from "@ui-kitten/components";
import { io } from "socket.io-client";
import * as SecureStore from "expo-secure-store";
import * as Device from "expo-device";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faWarehouse } from "@fortawesome/free-solid-svg-icons";
import * as ScreenOrientation from "expo-screen-orientation";

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
	]);
	const buttonsRef = React.useRef(buttons);
	const [divider, setDivider] = useState(1);
	const [size, setSize] = useState(0);
	const [offset, setOffset] = useState(0);
	const [orientation, setOrientation] = useState(false);
	const [initOrientation, setInitOrientation] = useState(null);

	const call = async (side) => {
		let id = await SecureStore.getItemAsync("secure_deviceid");

		let object = { user_mac: id, gate: side };

		const socket = await io("https://gate-opener-socket.herokuapp.com", {
			"X-Address": id,
			"X-Name": Device.modelName,
		});

		socket.emit("open", JSON.stringify(object));

		socket.on("recieved", () => {
			socket.disconnect();
		});
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

	const checkForDeviceType = async () => {
		let type = await Device.getDeviceTypeAsync();
		if (type === Device.DeviceType.PHONE) ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
		else Dimensions.addEventListener("change", ({ window: { width, height } }) => setOrientation(width > height));
		setOrientation(Dimensions.get("window").height < Dimensions.get("window").width);
		setInitOrientation(type === Device.DeviceType.TABLET);
	};

	useEffect(() => {
		let screenSize = Dimensions.get("window").width - Math.floor(Dimensions.get("window").width / 10);
		let div = Math.floor(screenSize / 150);
		setDivider(div);
		setSize(Math.ceil(buttons.length / div));
		if (initOrientation === null) checkForDeviceType();
	}, [orientation]);

	return (
		<View style={{ margin: 15 }}>
			<Text category={"h4"} style={{ marginTop: 25 }}>
				Kontroler urządzeń
			</Text>
			<View
				onLayout={({ nativeEvent }) => setOffset(nativeEvent.layout.y)}
				style={{
					height: Dimensions.get("window").height - offset * (Device.deviceName !== "iPhone" ? 1 : 2) - 50,
					width: Dimensions.get("window").width - Math.floor(Dimensions.get("window").width / 10) + 25,
					marginTop: 15,
				}}
			>
				<ScrollView vertical>
					{Array.from(Array(size).keys()).map((ele) => {
						const chunk = buttons.slice(ele * divider, ele * divider + divider);
						return (
							<View key={`row-${ele}`} style={styles.container}>
								{chunk?.map((el) => {
									return (
										<GateButton
											key={`controller-${buttons.indexOf(el)}`}
											disabled={el.status}
											onPress={() => handleClick(el)}
											style={[
												styles.nnth_buttons,
												chunk?.indexOf(el) !== 0 && styles.nth_buttons,
												chunk?.indexOf(el) === divider && styles.lastButton,
											]}
										>
											{el.value}
										</GateButton>
									);
								})}
							</View>
						);
					})}
				</ScrollView>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		display: "flex",
		flexDirection: "row",
		marginHorizontal: 15,
		flexWrap: "wrap",
		width: Math.floor(Dimensions.get("window").width / 175) * 175 - 20,
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
		backgroundColor: "#255957",
		borderColor: "transparent",
		borderRadius: 15,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		padding: 15,
		width: 150,
	},
	disabled: {
		color: "#1FD6C1",
	},
	lastButton: {
		marginRight: 25,
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
